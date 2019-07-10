import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './index.css';
import App from './components/app';

ReactDOM.render(
  <Router>
    <Switch>
      <Route path='/' component={App} exact />
    </Switch>
  </Router>,
  document.getElementById('root')
);
