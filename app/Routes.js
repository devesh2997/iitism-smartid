import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import CardReaderPage from './containers/CardReaderPage';

export default () => (
  <App>
    <Switch>
      <Route path={routes.HOME} component={CardReaderPage} />
    </Switch>
  </App>
);
