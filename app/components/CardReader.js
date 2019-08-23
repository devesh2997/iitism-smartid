import React, { Component } from 'react'
import { NFC, KEY_TYPE_A, KEY_TYPE_B } from 'nfc-pcsc'
import styles from './CardReader.css'
import insert from '../../resources/images/insert.gif'
import DeviceController from '../controllers/DeviceController'
import SmartCardReader from '../models/SmartCardReader'
import SmartCard from '../models/SmartCard'

export default class CardReader extends Component {
  constructor (props) {
    super(props)

    this.state = {
      device: new SmartCardReader(),
      isLoadingCardData: false,
      card: new SmartCard(),
      error: ''
    }
  }

  componentDidMount () {
    const deviceController = new DeviceController({
      errorOccurred: error => this.setState({ error: error }),
      isLoadingCardData: loading =>
        this.setState({ isLoadingCardData: loading }),
      deviceDetected: device => this.setState({ device }),
      deviceRemoved: () => this.setState({ device: new SmartCardReader() }),
      cardDetected: card => this.setState({ card }),
      cardRemoved: () => this.setState({ card: new SmartCard() })
    })
    deviceController.init()
  }

  render () {
    return (
      <div className={styles.cardReader}>
        {this.state.device.isActive ? (
          <CardReaderFound
            device={this.state.device}
            card={this.state.card}
            isLoadingCardData={this.state.isLoadingCardData}
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
      CardReader Detected : {props.device.name}
    </div>
    <Divider />
    <div className={styles.cardHelper}>
      {props.isLoadingCardData === true ? (
        <div>Reading Data ...</div>
      ) : props.card.isActive ? (
        <SmartCardDataView card={props.card} />
      ) : (
        <div style={{ textAlign: 'center' }}>
          <img src={insert} />
          <div>
            Device Ready : Place a smartcard near the device to continue.
          </div>
        </div>
      )}
    </div>
  </div>
)

const Divider = () => <div className={styles.divider} />

const SmartCardDataView = function (props) {
  const card = props.card
  return (
    <div className={styles.cardInfo}>
      <div>ID : {card.id}</div>
    </div>
  )
}
