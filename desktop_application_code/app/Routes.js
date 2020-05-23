import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import CardReaderPage from './containers/CardReaderPage';
import LoginPage from './containers/LoginPage';

export default () => (
  <App>
    <Switch>
      <Route path={routes.HOME} component={CardReaderPage} />
      <Route path={routes.CARD_READER} component={CardReaderPage} />
    </Switch>
  </App>
);
