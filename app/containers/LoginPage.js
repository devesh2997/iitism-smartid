// @flow
import React, { Component } from 'react';
import Login from '../components/Login'

type Props = {};

export default class LoginPage extends Component<Props> {
  props: Props;

  render() {
    return <Login location={this.props.location} history={this.props.history}/>
  }
}


