import React from 'react'
import { SmartCardType } from '../../models/SmartCard'
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap'
import {
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  InputGroup,
  InputGroupText
} from 'reactstrap'
import { userService } from '../../_services/user.service'
import UserInfo from './userinfo'

export default class Init extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      user: null,
      credit: 0,
      creditSuccess: undefined,
      creditSuccessAmount: undefined
    }
  }
  componentWillMount () {
    this.fetchUserDetails()
  }

  changeCredit = event => {
    this.setState({ [event.target.name]: event.target.event })
  }

  onSubmit = () => {
    let amount = this.state.credit
    let user_id = this.state.user.id
    let body = { amount, user_id, merchant_id: 3 }
    this.setState({ loading: true })
    userService
      .credit(body)
      .then(data => {
        data = JSON.parse(JSON.stringify(data))
        if (data.success) {
          this.setState({
            creditSuccess: true,
            creditSuccessAmount: data.transaction.amount,
            loading: false
          })
          this.fetchUserDetails()
        } else {
          this.setState({
            creditSuccess: false,
            loading: false,
            error: JSON.stringify(data.error)
          })
        }
      })
      .catch(error => {
        console.log('ee', error.toString())
        this.setState({
          loading: false,
          creditSuccess: false,
          error: JSON.stringify(error)
        })
      })
  }

  fetchUserDetails = () => {
    this.setState({ loading: true })
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
    let { credit } = this.state
    return (
      <Card>
        <CardHeader>SmartID</CardHeader>
        <CardBody>
          {this.state.loading && <Label>Loading...</Label>}
          {this.state.error && <Label> Error : {this.state.error}</Label>}
          {this.state.user && (
            <Row>
              <Col xs='8'>
                <UserInfo user={this.state.user} />
              </Col>
              <Col xs='4'>
                <Form>
                  <InputGroup>
                    <InputGroupText>Credit Amount : </InputGroupText>
                    <Input
                      onChange={this.changeCredit}
                      name='credit'
                      value={credit}
                      type='number'
                    />
                    <Button color='primary'>Credit</Button>
                  </InputGroup>
                </Form>
              </Col>
            </Row>
          )}
        </CardBody>
      </Card>
    )
  }
}
