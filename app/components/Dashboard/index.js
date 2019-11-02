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
import InitOld from './InitOld'
import New from './New'
import Init from './Init'

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
