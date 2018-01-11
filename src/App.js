import 'babel-polyfill';
import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import Player from './player/player';
import Controller from './controller/controller';
import store from './store/store';
import './App.css';

export default () => (
  <Provider store={store}>
    <Router>
      <div>
        <Route exact path="/" component={Player} />
        <Route exact path="/perform" component={Controller} />
      </div>
    </Router>
  </Provider>
);
