import { NFC, KEY_TYPE_A, KEY_TYPE_B } from 'nfc-pcsc'
import SmartCardReader from '../models/SmartCardReader'
import SmartCard, { Block, Sector } from '../models/SmartCard'
import { paddy } from '../utils'

export default class DeviceController {
  constructor (callbacks) {
    this.nfc = new NFC()
    this.card = undefined
    this.reader = undefined
    this.smartCard = new SmartCard('')
    this.errorOccurred =
      callbacks.errorOccurred === undefined
        ? function () {}
        : callbacks.errorOccurred
    this.isLoadingCardData =
      callbacks.isLoadingCardData === undefined
        ? function () {}
        : callbacks.isLoadingCardData
    this.isWritingToCard =
      callbacks.isLoadingCardData === undefined
        ? function () {}
        : callbacks.isWritingToCard
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

  setCard (card) {
    this.card = card
  }

  setReader (reader) {
    this.reader = reader
  }

  isCardAvailable () {
    return this.card !== undefined
  }

  isReaderAvailable () {
    return this.reader !== undefined
  }

  clearReaderData () {
    this.reader = undefined
    this.deviceRemoved()
  }

  clearCardData () {
    this.card = undefined
    this.smartCard = undefined
    this.cardRemoved()
  }

  // key must be a 12-chars HEX string, an instance of Buffer, or array of bytes
  async writeData (
    blockNumber,
    data,
    key = 'FFFFFFFFFFFF',
    keyType = KEY_TYPE_B
  ) {
    console.log('data : ',data)
    if (!this.isCardAvailable() || !this.isReaderAvailable()) {
      console.error('Card or reader not available')
      this.errorOccurred('Card or reader not available')
      return
    }
    if (blockNumber < 4 || (blockNumber + 1) % 4 === 0) {
      console.error('WRITING IN SENSITIVE BLOCK!')
      this.errorOccurred('WRITING IN SENSITIVE BLOCK!')
      return
    }
    if(data === undefined || data.length <=0 ){
      console.error('Invalid data')
      this.errorOccurred('Invalid data')
      return
    }
    this.isWritingToCard(true)
    data = paddy(data, 16)

    try {
      await this.reader.authenticate(blockNumber, keyType, key)
      await this.reader.write(blockNumber, Buffer.from(data), 16)
      this.isWritingToCard(false)
      await this.readAllData()
    } catch (err) {
      console.error(err)
      this.isWritingToCard(false)
      this.errorOccurred(err)
    }
  }

  // key must be a 12-chars HEX string, an instance of Buffer, or array of bytes
  async readAllData (key = 'FFFFFFFFFFFF', keyType = KEY_TYPE_B) {
    if (!this.isCardAvailable() || !this.isReaderAvailable()) {
      return
    }
    var smartCard = new SmartCard(this.card.uid)
    this.isLoadingCardData(true)

    for (var i = 0; i < 16; i++) {
      var sector = new Sector(i)
      try {
        await this.reader.authenticate(i * 4, keyType, key)

        console.info(`sector ${i} successfully authenticated`)

        for (var j = 0; j < 4; j++) {
          try {
            // reader.read(blockNumber, length, blockSize = 4, packetSize = 16)
            const data = await this.reader.read(i * 4 + j, 16, 16)
            const block = new Block(i * 4 + j, data)
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
    this.smartCard = smartCard
    this.isLoadingCardData(false)
    this.cardDetected(smartCard)
  }

  init () {
    this.nfc.on('reader', reader => {
      this.setReader(reader)
      console.log(`${reader.reader.name}  device attached`)
      this.deviceDetected(new SmartCardReader(reader.reader.name))

      reader.on('card', async card => {
        this.setCard(card)
        await this.readAllData()
        console.log(`${reader.reader.name}  card detected`, card)
      })

      reader.on('card.off', card => {
        console.log(`${reader.reader.name}  card removed`, card)
        this.clearCardData()
        this.isLoadingCardData(false)
      })

      reader.on('error', err => {
        console.log(`${reader.reader.name}  an error occurred`, err)
        this.clearCardData()
        this.errorOccurred(err)
        this.isLoadingCardData(false)
      })

      reader.on('end', () => {
        console.log(`${reader.reader.name}  device removed`)
        this.clearReaderData()
        this.isLoadingCardData(false)
      })
    })

    this.nfc.on('error', err => {
      console.log('an error occurred', err)
      this.clearReaderData()
      this.errorOccurred(err)
      this.isLoadingCardData(false)
    })
  }
}
