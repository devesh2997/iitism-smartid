import React from 'react'
import { SmartCardType } from '../../models/SmartCard'
import { Card, CardBody, CardHeader } from 'reactstrap'
import {
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  InputGroup,
  InputGroupText
} from 'reactstrap'
import { userdumpService } from '../../_services/userdump.service'
import { userService } from '../../_services/user.service'
import UserDumpInfo from './userdumpinfo'
import QueryResults from './QueryResults'
import UserInfo from './userinfo'

export default class Dashboard extends React.Component {
  constructor (props) {
    super(props)
    this.controller = props.controller
    this.state = { error: '', message: '' }
  }

  initializeCard = user => {
    user.smartid_no = this.props.card.id
    user.password = user.admn_no
    userService
      .create(user)
      .then(async data => {
        console.log(data)
        if (data.success) {
          this.setState({ message: data.message })
          await this.controller.writeData(36, user.admn_no)
        } else {
          this.setState({ error: data.error })
        }
      })
      .catch(error => {
        this.setState({ error: error })
        console.log(error.toString())
      })
  }

  getComponent = type => {
    switch (type) {
      case SmartCardType.INIT_OLD:
        return <InitOld card={this.props.card} init={this.initializeCard} />
      case SmartCardType.INIT:
        return <Init card={this.props.card} />
      case SmartCardType.NEW:
        return <New card={this.props.card} init={this.initializeCard} />
      default:
        return <div>Some Error Occurred.</div>
    }
  }

  render () {
    const type = this.props.card.type
    return (
      <div style={{ marginTop: 20 }}>
        {this.state.error.length > 0 && (
          <div>{this.state.error.toString()}</div>
        )}
        {this.state.message.length > 0 && (
          <div>{this.state.message.toString()}</div>
        )}
        {this.getComponent(type)}
      </div>
    )
  }
}

class InitOld extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      userdump: null
    }
  }

  componentWillMount () {
    this.setState({ loading: true })
    this.fetchUserDetails()
  }

  fetchUserDetails = () => {
    userdumpService
      .get(this.props.card.admissionNumberForOldCard)
      .then(data =>
        this.setState({
          userdump: JSON.parse(JSON.stringify(data.userdump)),
          loading: false
        })
      )
      .catch(error => {
        this.setState({ loading: false, error: error })
      })
  }

  onInit = event => {
    this.props.init(this.state.userdump)
  }

  render () {
    return (
      <Card>
        <CardHeader>Initialised, but not in the SmartID system</CardHeader>
        <CardBody>
          {this.state.loading && <Label>Loading...</Label>}
          {this.state.error && <Label>{this.state.error.toString()}</Label>}
          {this.state.userdump && (
            <div>
              <UserDumpInfo userdump={this.state.userdump} />
              <Button color='primary' onClick={this.onInit}>
                Init
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    )
  }
}

class Init extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      user: null
    }
  }
  componentWillMount () {
    this.setState({ loading: true })
    this.fetchUserDetails()
  }

  fetchUserDetails = () => {
    userService
      .get(this.props.card.admissionNumber)
      .then(data => {
        data = JSON.parse(JSON.stringify(data))
        if (data.success) {
          this.setState({
            user: JSON.parse(JSON.stringify(data.user)),
            loading: false
          })
        } else {
          this.setState({ loading: false, error: JSON.stringify(data.error) })
        }
      })
      .catch(error => {
        console.log('ee', error.toString())
        this.setState({ loading: false, error: JSON.stringify(error) })
      })
  }

  render () {
    return (
      <Card>
        <CardHeader>SmartID</CardHeader>
        <CardBody>
          {this.state.loading && <Label>Loading...</Label>}
          {this.state.error && <Label> Error : {this.state.error}</Label>}
          {this.state.user && (
            <UserInfo user={this.state.user} />
          )}
        </CardBody>
      </Card>
    )
  }
}

class New extends React.Component {
  constructor (props) {
    super(props)
    this.state = { query: '', error: '', userdumps: [], loading: false }
  }

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleSubmit = event => {
    event.preventDefault()

    const { query } = this.state
    this.setState({ loading: true })

    userdumpService.query(query).then(
      data => {
        console.log('dd', data)
        data = JSON.parse(JSON.stringify(data))
        if (data.success) {
          this.setState({
            userdumps: JSON.parse(JSON.stringify(data.userdumps)),
            loading: false
          })
        } else {
          this.setState({ loading: false, error: JSON.stringify(data.error) })
        }
      },
      error => {
        console.log('something went wrong')
        this.setState({ error: error.toString() })
      }
    )
  }

  render () {
    const { query, error } = this.state
    const { loading, userdumps } = this.state
    let userdumpinfo = []
    for (let i = 0; i < userdumps.length; i++) {
      userdumpinfo.push(<UserDumpInfo key={i} userdump={userdumps[i]} />)
    }
    return (
      <Card>
        <CardHeader>New Card</CardHeader>
        <CardBody>
          <Form onSubmit={this.handleSubmit}>
            <InputGroup>
              <InputGroupText>Search : </InputGroupText>
              <Input
                name='query'
                value={query}
                onChange={this.handleInputChange}
                placeholder='Enter admission number or name'
                required
              />
            </InputGroup>
          </Form>
          {loading && <div>Loading ...</div>}
          <QueryResults userdumps={userdumps} init={this.props.init} />
        </CardBody>
      </Card>
    )
  }
}
