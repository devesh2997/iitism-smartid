import React, { Component } from 'react'
import { merchantService } from '../../_services/merchants.service'

import { Card, CardBody, CardHeader } from 'reactstrap'
import {
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  InputGroup,
  InputGroupText,
  Alert,
  Collapse,
  Row,
  Col
} from 'reactstrap'

export default class AddMerchant extends Component {
  constructor (props) {
    super(props)
    this.state = {
      adding: false,
      collapse: false,
      business_name: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      email: '',
      mobile_no: '',
      password: '',
      success: undefined
    }
  }

  createMerchant = async () => {
    let {
      business_name,
      first_name,
      middle_name,
      last_name,
      email,
      mobile_no,
      password
    } = this.state

    let merchant = {
      business_name,
      first_name,
      middle_name,
      last_name,
      email,
      mobile_no,
      password
    }
    this.setState({ adding: true, success:undefined })
    let res = await merchantService.create(JSON.stringify(merchant))
    this.setState({ adding: false, success: res.success, collapse:true })
    this.props.refresh()
    console.log(res)
  }

  toggle = () => {
    this.setState({ collapse: !this.state.collapse })
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  render () {
    let {
      adding,
      success,
      business_name,
      first_name,
      middle_name,
      last_name,
      email,
      mobile_no,
      password,
      collapse
    } = this.state

    return (
      <div>
        {adding === true && <div>Adding merchant </div>}
        {success === true && <Alert color="primary">Successfully added Merchant</Alert>}
        {success === false && <Alert color="primary">Some error occurred</Alert>}
        {adding !== true && (
          <div>
            <Button
              color='primary'
              onClick={this.toggle}
              style={{ marginBottom: '1rem' }}
            >
              Add Merchant
            </Button>
            <Collapse isOpen={collapse}>
              <Card>
                <CardHeader>Enter Details</CardHeader>
                <CardBody>
                  <Form>
                    <FormGroup row>
                      <Label for='business_name' sm={2}>
                        Business name
                      </Label>
                      <Col sm={10}>
                        <Input
                          onChange={this.onChange}
                          type='text'
                          name='business_name'
                          id='business_name'
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for='password' sm={2}>
                        Password
                      </Label>
                      <Col sm={10}>
                        <Input
                          onChange={this.onChange}
                          type='text'
                          name='password'
                          id='password'
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for='first_name' sm={2}>
                        First name
                      </Label>
                      <Col sm={10}>
                        <Input
                          onChange={this.onChange}
                          type='text'
                          name='first_name'
                          id='first_name'
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for='middle_name' sm={2}>
                        Middle name
                      </Label>
                      <Col sm={10}>
                        <Input
                          onChange={this.onChange}
                          type='text'
                          name='middle_name'
                          id='middle_name'
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for='last_name' sm={2}>
                        Last name
                      </Label>
                      <Col sm={10}>
                        <Input
                          onChange={this.onChange}
                          type='text'
                          name='last_name'
                          id='last_name'
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for='email' sm={2}>
                        Email
                      </Label>
                      <Col sm={10}>
                        <Input
                          onChange={this.onChange}
                          type='text'
                          name='email'
                          id='email'
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for='mobile_no' sm={2}>
                        Mobile Number
                      </Label>
                      <Col sm={10}>
                        <Input
                          onChange={this.onChange}
                          type='text'
                          name='mobile_no'
                          id='mobile_no'
                        />
                      </Col>
                    </FormGroup>
                    <Button
                      color='primary'
                      onClick={this.createMerchant}
                      style={{ marginBottom: '1rem' }}
                    >
                      Submit
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            </Collapse>
          </div>
        )}
      </div>
    )
  }
}
