import React, { Component } from 'react'
import {
  Alert,
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from 'reactstrap'
import { authenticationService } from '../_services'

const INITIAL_STATE = {
  email: '',
  password: '',
  error: ''
}

export default class Login extends Component {
  constructor (props) {
    super(props)

    this.state = { ...INITIAL_STATE }
    if (authenticationService.currentUserValue) {
      this.props.history.push('/')
    }
  }

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  validateInputs = () => {
    const { email, password } = this.state
    if (email.trim() === '' || password === '') {
      this.setState({ error: 'Invalid email or password' })
      return false
    }
    this.setState({ error: '' })
    return true
  }

  handleSubmit = event => {
    event.preventDefault()

    const { email, password } = this.state

    if (this.validateInputs) {
      authenticationService.login(email, password).then(
        user => {
          const { from } = this.props.location.state || {
            from: { pathname: '/' }
          }
          this.props.history.push('/')
        },
        error => {
          console.log('invalid password')
          this.setState({ error: error.toString() })
        }
      )
    }
  }

  render () {
    const { email, password, error } = this.state

    return (
      <div className='app flex-row align-items-center'>
        <Container>
          <Row className='justify-content-center'>
            <Col md='6'>
              <Card className='p-4'>
                <CardBody>
                  <Form onSubmit={this.handleSubmit}>
                    <h1>Login</h1>
                    <p className='text-muted'>Sign In to your account</p>
                    {error && <Alert color='danger'>{error}</Alert>}
                    <InputGroup className='mb-3'>
                      <InputGroupAddon addonType='prepend'>
                        <InputGroupText>
                          <i className='icon-envelope' />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type='email'
                        name='email'
                        value={email}
                        onChange={this.handleInputChange}
                        placeholder='Email address'
                        autoComplete='email'
                        required
                      />
                    </InputGroup>
                    <InputGroup className='mb-4'>
                      <InputGroupAddon addonType='prepend'>
                        <InputGroupText>
                          <i className='icon-key' />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type='password'
                        name='password'
                        value={password}
                        onChange={this.handleInputChange}
                        placeholder='Password'
                        autoComplete='current-password'
                        required
                      />
                    </InputGroup>
                    <Row>
                      <Col xs='6'>
                        <Button type='submit' color='primary' className='px-4'>
                          Login
                        </Button>
                      </Col>
                      {/* <Col xs="6" className="text-right">
												<Button type="button"
													onClick={() => this.props.history.push('/forgot-password')}
													color="link"
													className="px-0"
												>
													Forgot password?
												</Button>
											</Col> */}
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}
