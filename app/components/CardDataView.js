import React from 'react'
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  Button,
  CardTitle,
  CardText,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap'
import SmartCard from '../models/SmartCard'
import classnames from 'classnames'

export default class CardDataView extends React.Component {
  constructor (props) {
    super(props)
    this.card = props.card === undefined ? new SmartCard() : props.card
    this.controller = props.controller
    this.toggle = this.toggle.bind(this)
    this.state = {
      activeTab: '1',
      writeRequestBlockNumber: -1,
      writeRequestData: '',
      modal: false
    }
  }

  toggleModal = (blockNumber = -1) => {
    this.setState(prevState => ({
      modal: !prevState.modal,
      writeRequestBlockNumber: blockNumber
    }))
  }

  setData = event => {
    this.setState({ writeRequestData: event.target.value })
  }

  submitWriteRequest = () => {
    this.setState({
      modal: false
    })
    this.writeData(
      this.state.writeRequestBlockNumber,
      this.state.writeRequestData
    )
  }

  writeData = (blockNumber, data) => {
    if (this.controller === undefined) return
    this.controller.writeData(blockNumber, data)
  }

  toggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      })
    }
  }

  render () {
    return (
      <div style={{ marginTop: '50px', marginLeft: '25px' }}>
        <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>
            Write data to block
          </ModalHeader>
          <Form>
            <FormGroup>
              <Input
                name='data'
                id='data'
                placeholder='Enter data to write'
                value={this.state.writeRequestData}
                onChange={this.setData}
              />
            </FormGroup>
          </Form>
          <ModalFooter>
            <Button color='primary' onClick={this.submitWriteRequest}>
              Write
            </Button>{' '}
            <Button color='secondary' onClick={this.toggleModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        <div style={{ marginBottom: '10px' }}>Card ID : {this.card.id}</div>
        <div style={{ marginBottom: '10px' }}>Data : </div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => {
                this.toggle('1')
              }}
            >
              Raw
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => {
                this.toggle('2')
              }}
            >
              UTF-8
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId='1'>
            <SmartCardDataView
              card={this.card}
              format={this.state.activeTab}
              controller={this.controller}
              toggleWrite={this.toggleModal}
            />
          </TabPane>
          <TabPane tabId='2'>
            <SmartCardDataView
              card={this.card}
              format={this.state.activeTab}
              controller={this.controller}
              toggleWrite={this.toggleModal}
            />
          </TabPane>
        </TabContent>
      </div>
    )
  }
}

const SmartCardDataView = function (props) {
  const card = props.card === undefined ? new SmartCard() : props.card
  var sectors = []
  for (const [index, sector] of card.sectors.entries()) {
    sectors.push(
      <ListGroupItem style={{ fontSize: '0.8em' }}>
        <ListGroupItemHeading style={{ fontSize: '1em' }}>
          Sector: {sector.id}
        </ListGroupItemHeading>
        <SectorDataView
          sector={sector}
          format={props.format}
          controller={props.controller}
          toggleWrite={props.toggleWrite}
        />
      </ListGroupItem>
    )
  }
  return (
    <Container style={{ padding: '20px' }}>
      <ListGroup style={{ paddingTop: '20px' }}>{sectors}</ListGroup>
    </Container>
  )
}

const SectorDataView = function (props) {
  const sector = props.sector === undefined ? new Sector() : props.sector
  var blocks = []
  for (const [index, block] of sector.blocks.entries()) {
    blocks.push(
      <BlockDataView
        block={block}
        format={props.format}
        controller={props.controller}
        toggleWrite={props.toggleWrite}
      />
    )
  }
  return <Col xs='auto'>{blocks}</Col>
}

const BlockDataView = function (props) {
  const block = props.block === undefined ? new Block() : props.block
  const bytes = []
  switch (props.format) {
    case '1':
      for (const b of block.data) {
        bytes.push(
          <span style={{ padding: '5px', width: '30px', textAlign: 'center' }}>
            {b}
          </span>
        )
      }
      break
    case '2':
      bytes.push(
        <span style={{ padding: '5px' }}>{block.data.toString()}</span>
      )

      break

    default:
      for (const b of block.data) {
        bytes.push(
          <span style={{ padding: '5px', width: '30px', textAlign: 'center' }}>
            {b}
          </span>
        )
      }
      break
  }

  bytes.push(
    <span>
      <Button
        style={{ margin: '5px', padding: '2px', fontSize: '0.8em' }}
        outline
        color='primary'
        onClick={() => props.toggleWrite(block.id)}
      >
        WRITE
      </Button>
    </span>
  )

  return (
    <Row>
      <Col xs='1' style={{ padding: '5px' }}>
        B:{block.id}
      </Col>{' '}
      {bytes}
    </Row>
  )
}
