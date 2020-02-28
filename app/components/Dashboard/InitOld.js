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

export default class InitOld extends React.Component {
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
      .then(data => {
        console.log(data)
        data = JSON.parse(JSON.stringify(data))
        if (data.success) {
          this.setState({
            userdump: JSON.parse(JSON.stringify(data.userdump)),
            loading: false
          })
        } else {
          this.setState({
            error: data.error,
            loading: false
          })
        }
      })
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
