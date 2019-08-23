import React, { Component } from 'react'
import { NFC, KEY_TYPE_A, KEY_TYPE_B } from 'nfc-pcsc'
import styles from './CardReader.css'
import insert from '../../resources/images/insert.gif'
import DeviceController from '../controllers/DeviceController'
import SmartCardReader from '../models/SmartCardReader'
import SmartCard, { Sector, Block } from '../models/SmartCard'
import {
  Container,
  Row,
  Col,
  Alert,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading
} from 'reactstrap'

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
      <div>
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
  <div className={styles.center}>
    <div>No Smartcard Reader Detected</div>
    <div style={{ fontSize: '0.5em' }}>
      (Plug in your smartcard reader device to continue.)
    </div>
  </div>
)

const CardReaderFound = props => (
  <div>
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <div>CardReader Detected : {props.device.name}</div>
      <Divider />
    </div>
    <div>
      {props.isLoadingCardData === true ? (
        <div className={styles.center}>Reading Data ...</div>
      ) : props.card.isActive ? (
        <SmartCardDataView card={props.card} />
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

const Divider = () => <div className={styles.divider} />

const SmartCardDataView = function (props) {
  const card = props.card === undefined ? new SmartCard() : props.card
  var sectors = []
  for (const [index, sector] of card.sectors.entries()) {
    sectors.push(
      <ListGroupItem style={{ fontSize: '0.8em' }}>
        <ListGroupItemHeading  style={{ fontSize: '1em' }}>
          Sector: {sector.id}
        </ListGroupItemHeading>
        <SectorDataView sector={sector} />
      </ListGroupItem>
    )
  }
  return (
    <Container style={{ padding: '20px' }}>
      Card ID : {card.id}
      <ListGroup style={{ paddingTop: '20px' }}>{sectors}</ListGroup>
    </Container>
  )
}

const SectorDataView = function (props) {
  const sector = props.sector === undefined ? new Sector() : props.sector
  var blocks = []
  for (const [index, block] of sector.blocks.entries()) {
    blocks.push(<BlockDataView block={block} />)
  }
  return <Col xs='auto'>{blocks}</Col>
}

const BlockDataView = function (props) {
  const block = props.block === undefined ? new Block() : props.block
  const bytes = []
  for (const b of block.data) {
    bytes.push(<span style={{ padding: '5px', width:'30px', textAlign:'center' }}>{b}</span>)
  }
  return <Row><Col xs='1' style={{ padding: '5px' }}>B:{block.id}</Col> {bytes}</Row>
}
