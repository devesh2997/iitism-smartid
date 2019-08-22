import React, { Component } from 'react'
import { NFC, KEY_TYPE_A, KEY_TYPE_B } from 'nfc-pcsc'
import styles from './CardReader.css'
import insert from '../../resources/images/insert.gif'

export default class CardReader extends Component {
  constructor (props) {
    super(props)

    this.state = {
      readerDetected: false,
      readerDeviceName: '',
      cardDetected: false,
      cardId: '',
      cardData: ''
    }
  }

  componentDidMount () {
    const nfc = new NFC() // optionally you can pass logger

    nfc.on('reader', reader => {
      console.log(`${reader.reader.name}  device attached`)
      this.setState({
        readerDetected: true,
        readerDeviceName: reader.reader.name
      })

      reader.on('card', async card => {
        console.log(`${reader.reader.name}  card detected`, card)
        this.setState({ cardDetected: true, cardId: card.uid })
        const key = 'FFFFFFFFFFFF' // key must be a 12-chars HEX string, an instance of Buffer, or array of bytes
        const keyType = KEY_TYPE_B

        try {
          await reader.authenticate(4, keyType, key)

          console.info(`sector 0 successfully authenticated`, reader)
        } catch (err) {
          console.error(
            `error when authenticating block 0 within the sector 0`,
            reader,
            err
          )
          return
        }
        try {
          // reader.read(blockNumber, length, blockSize = 4, packetSize = 16)
          const data = await reader.read(4, 16, 16)
          console.log(`data read`, data)
          const payload = data.toString() // utf8 is default encoding
          this.setState({ cardData: payload })
          console.log(`data converted`, payload)
        } catch (err) {
          console.error(`error when reading data`, err)
        }
      })

      reader.on('card.off', card => {
        console.log(`${reader.reader.name}  card removed`, card)
        this.setState({ cardDetected: false, cardId: '' })
      })

      reader.on('error', err => {
        console.log(`${reader.reader.name}  an error occurred`, err)
      })

      reader.on('end', () => {
        console.log(`${reader.reader.name}  device removed`)
        this.setState({ readerDetected: false, readerDeviceName: '' })
      })
    })

    nfc.on('error', err => {
      console.log('an error occurred', err)
    })
  }

  render () {
    return (
      <div className={styles.cardReader}>
        {this.state.readerDetected ? (
          <CardReaderFound
            deviceName={this.state.readerDeviceName}
            cardDetected={this.state.cardDetected}
            cardId={this.state.cardId}
            cardData={this.state.cardData}
          />
        ) : (
          <CardReaderNotFound />
        )}
      </div>
    )
  }
}

const CardReaderNotFound = () => (
  <div className={styles.readerNotDetected}>
    <div>No Smartcard Reader Detected</div>
    <div style={{ fontSize: '0.5em' }}>
      (Plug in your smartcard reader device to continue.)
    </div>
  </div>
)

const CardReaderFound = props => (
  <div>
    <div className={styles.readerDetected}>
      CardReader Detected : {props.deviceName}
    </div>
    <Divider />
    <div className={styles.cardInfo}>
      {props.cardDetected ? (
        <div>
          <div>Card Detected </div>
          <div>UID: {props.cardId}</div>
          <div>Card Data : {props.cardData}</div>
        </div>
      ) : (
        <div style={{textAlign:"center"}}>
          <img src={insert}/>
          <div>
            Device Ready : Place a smartcard near the device to continue.
          </div>
        </div>
      )}
    </div>
  </div>
)

const Divider = () => (
  <div className={styles.divider}></div>
)
