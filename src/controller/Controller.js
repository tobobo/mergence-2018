import React, { Component } from 'react';
import { connect } from 'react-redux';
import map from 'lodash/map';
import propTypes from 'prop-types';
import { pollClients, sendClientAction } from '../store/actions';

class Controller extends Component {
  componentDidMount() {
    this.props.pollClients();
  }

  render() {
    return (
      <div>
        <div>
          {map(this.props.clients, clientId => (
            <div key={clientId}>
              {clientId}
              <button onClick={() => this.props.sendClientAction(clientId, 'on')}>on</button>
              <button onClick={() => this.props.sendClientAction(clientId, 'off')}>off</button>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

Controller.propTypes = {
  pollClients: propTypes.func.isRequired,
  sendClientAction: propTypes.func.isRequired,
  clients: propTypes.arrayOf(propTypes.string),
};

Controller.defaultProps = {
  clients: [],
};

const mapStateToProps = state => ({
  clients: state.controller.clients,
});

const mapDispatchToProps = dispatch => ({
  pollClients: () => {
    dispatch(pollClients());
  },
  sendClientAction: (clientId, name, options) => {
    dispatch(sendClientAction(clientId, name, options));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Controller);
