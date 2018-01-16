import 'babel-polyfill';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import Player from './player/Player';
import Controller from './controller/Controller';
import store from './store/store';
import './App.css';

export default () => (
  <Provider store={store}>
    <Router>
      <div className="full-size">
        <Route exact path="/" component={Player} />
        <Route exact path="/perform" component={Controller} />
      </div>
    </Router>
  </Provider>
);
