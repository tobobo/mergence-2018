import React, { Component } from 'react';
import { connect } from 'react-redux';
import map from 'lodash/map';
import propTypes from 'prop-types';
import { pollClients, sendAction } from '../store/actions';

class Controller extends Component {
  componentDidMount() {
    this.props.pollClients();
  }

  onActionClick() {
    if (!this.props.clients.length) return;
    const clientId = this.props.clients[Math.floor(Math.random() * this.props.clients.length)];
    this.props.sendAction(clientId);
  }

  render() {
    return (
      <div>
        <button onClick={() => this.onActionClick()}>Dispatch</button>
        <div>{map(this.props.clients, client => <div>{client}</div>)}</div>
      </div>
    );
  }
}

Controller.propTypes = {
  pollClients: propTypes.func.isRequired,
  sendAction: propTypes.func.isRequired,
  clients: propTypes.arrayOf(propTypes.string),
};

Controller.defaultProps = {
  clients: [],
};

const mapStateToProps = state => ({
  clients: state.controller.clients,
});

const matchDispatchToProps = dispatch => ({
  pollClients: () => {
    dispatch(pollClients());
  },
  sendAction: (clientId) => {
    dispatch(sendAction(clientId, 'my_action', { action: 'opts' }));
  },
});

export default connect(mapStateToProps, matchDispatchToProps)(Controller);
