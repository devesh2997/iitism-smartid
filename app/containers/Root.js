// @flow
import React, { Component } from 'react';
import Routes from '../Routes';
import { BrowserRouter as Router } from 'react-router-dom';

type Props = {
};

export default class Root extends Component<Props> {
  render() {
    return (
      <Router><Routes /></Router>
      
    );
  }
}
