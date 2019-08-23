import { NFC, KEY_TYPE_A, KEY_TYPE_B } from 'nfc-pcsc'
import SmartCardReader from '../models/SmartCardReader'
import SmartCard, { Block, Sector } from '../models/SmartCard'

export default class DeviceController {
  constructor (callbacks) {
    this.nfc = new NFC()
    this.errorOccurred =
      callbacks.errorOccurred === undefined
        ? function () {}
        : callbacks.errorOccurred
    this.isLoadingCardData =
      callbacks.isLoadingCardData === undefined
        ? function () {}
        : callbacks.isLoadingCardData
    this.deviceDetected =
      callbacks.deviceDetected === undefined
        ? function () {}
        : callbacks.deviceDetected
    this.deviceRemoved =
      callbacks.deviceRemoved === undefined
        ? function () {}
        : callbacks.deviceRemoved
    ;(this.cardDetected =
      callbacks.cardDetected === undefined
        ? function () {}
        : callbacks.cardDetected),
    (this.cardRemoved =
        callbacks.cardRemoved === undefined
          ? function () {}
          : callbacks.cardRemoved)
  }

  init () {
    this.nfc.on('reader', reader => {
      console.log(`${reader.reader.name}  device attached`)
      this.deviceDetected(new SmartCardReader(reader.reader.name))

      reader.on('card', async card => {
        console.log(`${reader.reader.name}  card detected`, card)
        var smartCard = new SmartCard(card.uid)
        this.isLoadingCardData(true)
        const key = 'FFFFFFFFFFFF' // key must be a 12-chars HEX string, an instance of Buffer, or array of bytes
        const keyType = KEY_TYPE_B

        for (var i = 0; i < 16; i++) {
          var sector = new Sector()
          try {
            await reader.authenticate(i * 4, keyType, key)

            console.info(`sector ${i} successfully authenticated`)

            for (var j = 0; j < 4; j++) {
              try {
                // reader.read(blockNumber, length, blockSize = 4, packetSize = 16)
                const data = await reader.read(i * 4 + j, 16, 16)
                const block = new Block(data)
                sector.setBlock(j, block)
                console.log(`data read`, data)
                const payload = data.toString() // utf8 is default encoding
              } catch (err) {
                console.error(`error when reading data`, err)
                this.errorOccurred(err)
              }
            }
          } catch (err) {
            console.error(
              `error when authenticating block 0 within the sector 0`,
              reader,
              err
            )
            this.errorOccurred(err)
            this.isLoadingCardData(false)
            return
          }
          smartCard.setSector(i, sector)
        }
        console.log(smartCard)
        this.isLoadingCardData(false)
        this.cardDetected(smartCard)
      })

      reader.on('card.off', card => {
        console.log(`${reader.reader.name}  card removed`, card)
        this.cardRemoved()
        this.isLoadingCardData(false)
      })

      reader.on('error', err => {
        console.log(`${reader.reader.name}  an error occurred`, err)
        this.errorOccurred(err)
        this.isLoadingCardData(false)
      })

      reader.on('end', () => {
        console.log(`${reader.reader.name}  device removed`)
        this.deviceRemoved()
        this.isLoadingCardData(false)
      })
    })

    this.nfc.on('error', err => {
      console.log('an error occurred', err)
      this.errorOccurred(err)
      this.isLoadingCardData(falseks)
    })
  }
}
