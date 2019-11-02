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
import UserDumpInfo from './userdumpinfo'
import QueryResults from './QueryResults'

export default class New extends React.Component {
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