import React from 'react'
import { SmartCardType } from '../../models/SmartCard'
import { Card, CardBody, CardHeader } from 'reactstrap'
import { authHeader, handleResponse, appendJWTToUrl } from '../../_helpers'
import { apiUrl } from '../../config'
import {
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  InputGroup,
  InputGroupText,
  Row,
  Col
} from 'reactstrap'
import { userdumpService } from '../../_services/userdump.service'
import userinfo from './SmartIdUserInfo'
import QueryResults from './QueryResults'

export default class New extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      query: '',
      error: '',
      users: [],
      loading: false,
      prefix: '',
      prefixes: []
    }
  }

  componentDidMount () {
    this.fetchPrefixes()
  }

  fetchPrefixes = () => {
    const requestOptions = { method: 'GET' }
    fetch(appendJWTToUrl(`${apiUrl}user/getIdPrefixes.php?`), requestOptions)
      .then(handleResponse)
      .then(data => {
        console.log('prefixes', data)
        if (data.success) {
          this.setState({ prefixes: data.prefixes })
        }
      })
  }

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleSubmit = event => {
    event.preventDefault()

    const { query, prefix } = this.state
    this.setState({ loading: true })

    userdumpService.query(query, prefix).then(
      data => {
        data = JSON.parse(JSON.stringify(data))
        if (data.success) {
          this.setState({
            users: JSON.parse(JSON.stringify(data.users)),
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

  onChangePrefix = event => {
    this.setState({ prefix: event.target.value })
  }

  render () {
    const { query, error, prefixes } = this.state
    const { loading, users, prefix } = this.state
    let userinfo = []
    for (let i = 0; i < users.length; i++) {
      userinfo.push(<userinfo key={i} userdump={users[i]} />)
    }
    return (
      <Card>
        <CardHeader>New Card</CardHeader>
        <CardBody>
          <Form onSubmit={this.handleSubmit}>
            <InputGroup>
              <Row>
                <Col>
                  <InputGroupText>Search : </InputGroupText>
                </Col>
                <Col>
                  <Input
                    name='prefix'
                    value={prefix}
                    onChange={this.handleInputChange}
                    placeholder='Prefix'
                  />
                </Col>
              </Row>

              <Input
                name='query'
                value={query}
                onChange={this.handleInputChange}
                placeholder='Enter admission number or name'
                required
              />
              <Button color='primary' onClick={this.handleSubmit}>
                Search
              </Button>
            </InputGroup>
          </Form>
          {loading && <div>Loading ...</div>}
          <QueryResults users={users} init={this.props.init} />
        </CardBody>
      </Card>
    )
  }
}
