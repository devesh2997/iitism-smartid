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

  async clearData (blockNumber, key = 'FFFFFFFFFFFF', keyType = KEY_TYPE_B) {
    this.errorOccurred(undefined)
    if (!this.isCardAvailable() || !this.isReaderAvailable()) {
      console.error('Card or reader not available')
      this.errorOccurred('Card or reader not available')
      return
    }
    this.isWritingToCard(true)
    let dataBuffer = Buffer.allocUnsafe(16)
    dataBuffer.fill(0)
    try {
      await this.reader.authenticate(blockNumber, keyType, key)
      // await this.reader.write(blockNumber, Buffer.from(data), 16)
      await this.reader.write(blockNumber, dataBuffer, 16)
      this.isWritingToCard(false)
      await this.readAllData()
    } catch (err) {
      console.error(err)
      this.isWritingToCard(false)
      this.errorOccurred(err)
    }
  }

  //function to block the first sector of a given block
  async lockFirstBlock (
    blockNumber,
    key = 'FFFFFFFFFFFF',
    keyType = KEY_TYPE_B
  ) {
    this.errorOccurred(undefined)
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

    blockNumber = blockNumber - (blockNumber % 4) + 3

    this.isWritingToCard(true)
    let dataBuffer
    //this is the sequence of bytes that need to be written to a sector trailer
    //in order to block the first sector of that block.
    dataBuffer = Buffer.from([
      255,
      255,
      255,
      255,
      255,
      255,
      255,
      6,
      144,
      105,
      255,
      255,
      255,
      255,
      255,
      255
    ])
    console.log('buffer', dataBuffer)
    try {
      await this.reader.authenticate(blockNumber, keyType, key)
      // await this.reader.write(blockNumber, Buffer.from(data), 16)
      await this.reader.write(blockNumber, dataBuffer, 16)
      this.isWritingToCard(false)
      await this.readAllData()
    } catch (err) {
      console.error(err)
      this.isWritingToCard(false)
      this.errorOccurred(err)
    }
  }

  async initCard (id) {
    const blockNumber = 36
    const key = 'FFFFFFFFFFFF'
    const keyType = KEY_TYPE_B

    this.writeData(blockNumber, id, key, keyType)
      .then(() => {
        this.lockFirstBlock(blockNumber)
      })
      .catch(e => {
        console.log(e)
        this.errorOccurred(e)
      })
  }

  //function to write data in a specific block of a card
  // key must be a 12-chars HEX string, an instance of Buffer, or array of bytes
  async writeData (
    blockNumber,
    data,
    key = 'FFFFFFFFFFFF',
    keyType = KEY_TYPE_B
  ) {
    this.errorOccurred(undefined)
    console.log('data : ', data)
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
    if (data === undefined || data.length <= 0) {
      console.error('Invalid data')
      this.errorOccurred('Invalid data')
      return
    }
    this.isWritingToCard(true)
    // data = paddy(data, 16)
    let dataBuffer
    dataBuffer = Buffer.allocUnsafe(16)
    dataBuffer.fill(0)
    dataBuffer.write(data)
    console.log('buffer', dataBuffer)

    try {
      await this.reader.authenticate(blockNumber, keyType, key)
      // await this.reader.write(blockNumber, Buffer.from(data), 16)
      await this.reader.write(blockNumber, dataBuffer, 16)
      this.isWritingToCard(false)
      await this.readAllData()
    } catch (err) {
      console.error(err)
      this.isWritingToCard(false)
      this.errorOccurred(err)
    }
  }

  //function to read all the sectors of a card
  // key must be a 12-chars HEX string, an instance of Buffer, or array of bytes
  async readAllData (key = 'FFFFFFFFFFFF', keyType = KEY_TYPE_B) {
    this.errorOccurred(undefined)
    if (!this.isCardAvailable() || !this.isReaderAvailable()) {
      return
    }
    var smartCard = new SmartCard(this.card.uid)
    this.isLoadingCardData(true)

    for (var i = 0; i < 16; i++) {
      if (i !== 0 && i != 9) continue
      var sector = new Sector(i)
      try {
        await this.reader.authenticate(i * 4, keyType, key)

        // console.info(`sector ${i} successfully authenticated`)

        for (var j = 0; j < 4; j++) {
          try {
            // reader.read(blockNumber, length, blockSize = 4, packetSize = 16)
            const data = await this.reader.read(i * 4 + j, 16, 16)
            if (i * 4 + j === 36) console.log('sense', data)
            const block = new Block(i * 4 + j, data)
            sector.setBlock(j, block)
            // console.log(`data read`, data)
            const payload = data.toString() // utf8 is default encoding
          } catch (err) {
            console.error(`error when reading data`, err)
            this.errorOccurred(err)
          }
        }
      } catch (err) {
        console.error(
          `error when authenticating block 0 within the sector 0`,
          err
        )
        this.errorOccurred(err)
        this.isLoadingCardData(false)
        return
      }
      smartCard.setSector(i, sector)
    }
    // console.log(smartCard)
    this.smartCard = smartCard
    this.isLoadingCardData(false)
    this.cardDetected(smartCard)
  }

  //initialising the controller with the relevant callbacks provided by the nfc-pcsc library
  init () {
    this.nfc.on('reader', reader => {
      //card reader has been detected
      this.setReader(reader)
      console.log(`${reader.reader.name}  device attached`)
      this.deviceDetected(new SmartCardReader(reader.reader.name))

      //a card had been detected in reader's proximity
      reader.on('card', async card => {
        this.setCard(card)
        await this.readAllData()
        console.log(`${reader.reader.name}  card detected`, card)
      })

      //card has been removed from the reader's proximity
      reader.on('card.off', card => {
        console.log(`${reader.reader.name}  card removed`, card)
        this.clearCardData()
        this.isLoadingCardData(false)
      })

      //an error has occurred while reading card data
      reader.on('error', err => {
        console.log(`${reader.reader.name}  an error occurred`, err)
        this.clearCardData()
        this.errorOccurred(err)
        this.isLoadingCardData(false)
      })

      //card reader has been removed
      reader.on('end', () => {
        console.log(`${reader.reader.name}  device removed`)
        this.clearReaderData()
        this.isLoadingCardData(false)
      })
    })

    //an error has occurred within the nfc-pcsc library
    this.nfc.on('error', err => {
      console.log('an error occurred', err)
      this.clearReaderData()
      this.errorOccurred(err)
      this.isLoadingCardData(false)
    })
  }
}
