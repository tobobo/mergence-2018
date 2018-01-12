import React, { Component } from 'react';
import { connect } from 'react-redux';
import map from 'lodash/map';
import propTypes from 'prop-types';
import { pollClients, sendAction } from '../store/actions';

class Controller extends Component {
  componentDidMount() {
    this.props.pollClients();
  }

  render() {
    return (
      <div>
        <div>
          {map(this.props.clients, clientId => (
            <div>
              {clientId}
              <button onClick={() => this.props.sendAction(clientId, 'on')}>on</button>
              <button onClick={() => this.props.sendAction(clientId, 'off')}>off</button>
            </div>
          ))}
        </div>
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

const mapDispatchToProps = dispatch => ({
  pollClients: () => {
    dispatch(pollClients());
  },
  sendAction: (clientId, name, options) => {
    dispatch(sendAction(clientId, name, options));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Controller);
