import React, { Component } from 'react'
import { NFC, KEY_TYPE_A, KEY_TYPE_B } from 'nfc-pcsc'
import styles from './CardReader.css'
import insert from '../../resources/images/insert.gif'
import DeviceController from '../controllers/DeviceController'
import SmartCardReader from '../models/SmartCardReader'
import SmartCard, { Sector, Block } from '../models/SmartCard'
import CardDataView from './CardDataView'
import { Alert } from 'reactstrap'
import { Divider } from './Divider'

export default class CardReader extends Component {
  constructor (props) {
    super(props)
    this.deviceController = new DeviceController({
      errorOccurred: error => this.setState({ error: error }),
      isLoadingCardData: loading =>
        this.setState({ isLoadingCardData: loading }),
      isWritingToCard: loading => this.setState({ isWritingToCard: loading }),
      deviceDetected: device => this.setState({ device }),
      deviceRemoved: () => this.setState({ device: new SmartCardReader() }),
      cardDetected: card => this.setState({ card }),
      cardRemoved: () => this.setState({ card: new SmartCard() })
    })

    this.state = {
      device: new SmartCardReader(),
      isLoadingCardData: false,
      card: new SmartCard(),
      error: ''
    }
  }

  componentDidMount () {
    this.deviceController.init()
  }

  render () {
    const { card } = this.state
    if (card.sectors.length > 9) console.log('sensehere', card.admissionNumber)
    return (
      <div>
        {this.error !== undefined && this.error.length > 0 ? (
          <Alert color='danger'>{this.error}</Alert>
        ) : (
          <div />
        )}
        {this.state.device.isActive ? (
          <CardReaderFound
            device={this.state.device}
            card={this.state.card}
            isLoadingCardData={this.state.isLoadingCardData}
            controller={this.deviceController}
          />
        ) : (
          <CardReaderNotFound />
        )}
      </div>
    )
  }
}

const CardReaderNotFound = () => (
  <div className={styles.center}>
    <div>No Smartcard Reader Detected</div>
    <div style={{ fontSize: '0.5em' }}>
      (Plug in your smartcard reader device to continue.)
    </div>
  </div>
)

const CardReaderFound = props => {
  console.log('sensehere2', props.card.admissionNumber)
  return (
    <div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <div>CardReader Detected : {props.device.name}</div>
        <Divider />
      </div>
      <div>
        {props.isLoadingCardData === true ? (
          <div className={styles.center}>Reading Data ...</div>
        ) : props.card.isActive ? (
          <CardDataView card={props.card} controller={props.controller} />
        ) : (
          <div className={styles.center}>
            <img src={insert} />
            <div style={{ fontSize: '0.6em' }}>
              Device Ready : Place a smartcard near the device to continue.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
