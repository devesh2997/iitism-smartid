import React from 'react'
import { SmartCardType } from '../models/SmartCard'
import { Card, CardBody, CardHeader } from 'reactstrap'
import { Form, FormGroup, Input, Label, Button } from 'reactstrap'
import { userdumpService } from '../_services/userdump.service'

export default class Dashboard extends React.Component {
  constructor (props) {
    super(props)
    this.card = props.card === undefined ? new SmartCard() : props.card
    this.controller = props.controller
  }

  getComponent = type => {
    switch (type) {
      case SmartCardType.INIT_OLD:
        return <InitOld card={this.card} />
      case SmartCardType.INIT:
        return <Init card={this.card} />
      case SmartCardType.NEW:
        return <New card={this.card} />
      default:
        return <div>Some Error Occurred.</div>
    }
  }

  render () {
    const type = this.card.type
    return <div style={{ marginTop: 20 }}>{this.getComponent(type)}</div>
  }
}

class InitOld extends React.Component {
  constructor (props) {
    super(props)
    this.card = props.card
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
      .get(this.card.admissionNumberForOldCard)
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

  render () {
    return (
      <Card>
        <CardHeader>Initialised, but not in the SmartID system</CardHeader>
        <CardBody>
          Admission Number : {this.card.admissionNumberForOldCard}
          <br />
          {this.state.loading && <Label>Loading...</Label>}
          {this.state.error && <Label>{this.state.error.toString()}</Label>}
          {this.state.userdump && (
            <UserDumpInfo userdump={this.state.userdump} />
          )}
        </CardBody>
      </Card>
    )
  }
}

const UserDumpInfo = ({ userdump }) => {
  return (
    <div>
      <Label>
        Name :{' '}
        {userdump.first_name +
          ' ' +
          userdump.middle_name +
          ' ' +
          userdump.last_name}
      </Label>
      <br />
      <Label>Branch ID : {userdump.branch_id}</Label>
      <br />
      <Label>Course ID : {userdump.course_id}</Label>
      <br />
      <Label>Email: {userdump.email}</Label>
      <br />
      <Label>Mobile Number : {userdump.mobile_no}</Label>
      <br />
    </div>
  )
}

class Init extends React.Component {
  constructor (props) {
    super(props)
    this.card = props.card
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
      .get(this.card.admissionNumber)
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

  render () {
    return (
      <Card>
        <CardHeader>SmartID</CardHeader>
        <CardBody>
          Admission Number : {this.card.admissionNumber}
          <br />
          {this.state.loading && <Label>Loading...</Label>}
          {this.state.error && <Label>{this.state.error.toString()}</Label>}
          {this.state.userdump && (
            <UserDumpInfo userdump={this.state.userdump} />
          )}
        </CardBody>
      </Card>
    )
  }
}

class New extends React.Component {
  constructor (props) {
    super(props)
    this.card = props.card
  }

  render () {
    return <div>New Card</div>
  }
}
