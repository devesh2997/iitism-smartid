// @flow
import React, { Component } from 'react'
import Routes from '../Routes'
import { HashRouter, Switch, Route, Link } from 'react-router-dom'
import { history } from '../_helpers'
import { authenticationService } from '../_services'
import { PrivateRoute } from '../components/PrivateRoute'
import LoginPage from './LoginPage'
import CardReaderPage from './CardReaderPage'
import UserdumpPage from './UserdumpPage'
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

type Props = {}

export default class Root extends Component<Props> {
  constructor (props) {
    super(props)

    this.state = {
      currentUser: null
    }
  }

  componentDidMount () {
    authenticationService.currentUser.subscribe(x =>
      this.setState({ currentUser: x })
    )
  }

  logout () {
    authenticationService.logout()
    history.push('/login')
  }
  render () {
    const { currentUser } = this.state
    return (
      <HashRouter>
        {/* <HashRouter history={history}> */}
        <div>
          {currentUser && (
            <Nav>
              <NavItem>
                <Link to='/' className='nav-item nav-link'>
                  Smartcard
                </Link>
              </NavItem>
              <NavItem>
                <Link to='/userdump' className='nav-item nav-link'>
                  Userdump
                </Link>
              </NavItem>
              <NavItem>
                <a onClick={this.logout} className='nav-item nav-link'>
                  Logout
                </a>
              </NavItem>
            </Nav>
          )}
          {/* <Route exact path = "/" render={()=><div>home</div>} />
          <Route path = "/login" render={()=><div>login</div>} /> */}
          <Switch>
            <PrivateRoute exact path='/' component={CardReaderPage} />
            <PrivateRoute path='/userdump' component={UserdumpPage} />
            <Route exact path='/login' component={LoginPage} />
          </Switch>
        </div>
      </HashRouter>
    )
  }
}
