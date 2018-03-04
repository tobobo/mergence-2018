import React, { Component } from 'react';
import { connect } from 'react-redux';
import { map } from 'lodash';
import propTypes from 'prop-types';
import {
  pollClients,
  sendClientAction,
  setSelectedClient,
} from '../store/actions';
import ClientSwitcher from './controls/ClientSwitcher';
import KeyboardContainer from './controls/KeyboardContainer';
import RandomGroup from './controls/RandomGroup';

class Controller extends Component {
  componentDidMount() {
    this.props.pollClients();
  }

  render() {
    const {
      clients,
      selectedClientIndex,
      sendClientAction: sendAction,
      setSelectedClient: setSelected,
    } = this.props;
    return (
      <div>
        <ClientSwitcher
          setSelectedClient={setSelected}
          selectedClientIndex={selectedClientIndex}
          clients={clients}
          sendClientAction={sendAction}
          direction="asc"
        />
        {map(['on', 'off'], onOrOff => (
          <div key={onOrOff}>
            <RandomGroup
              clients={clients}
              sendClientAction={sendAction}
              onOrOff={onOrOff}
            />
          </div>
        ))}
        <div>
          <button onClick={() => sendAction(['*'], 'multiply', { factor: 2 })}>
            8va
          </button>
          <button
            onClick={() => sendAction(['*'], 'multiply', { factor: 0.5 })}
          >
            8vb
          </button>
        </div>
        <div>
          <button onClick={() => sendAction(['*'], 'switch')}>switch</button>
        </div>
        <div>
          <button onClick={() => sendAction(['*'], 'off')}>all off</button>
        </div>
        <div>
          <button onClick={() => sendAction(['*'], 'text', { text: 'thanks' })}>
            thanks
          </button>
        </div>
        <KeyboardContainer clients={clients} sendClientAction={sendAction} />
        {map(clients, clientId => (
          <div key={clientId}>
            {clientId}
            <button onClick={() => sendAction([clientId], 'on')}>on</button>
            <button onClick={() => sendAction([clientId], 'off')}>off</button>
          </div>
        ))}
      </div>
    );
  }
}

Controller.propTypes = {
  pollClients: propTypes.func.isRequired,
  sendClientAction: propTypes.func.isRequired,
  setSelectedClient: propTypes.func.isRequired,
  clients: propTypes.arrayOf(propTypes.string),
  selectedClientIndex: propTypes.number.isRequired,
};

Controller.defaultProps = {
  clients: [],
};

const mapStateToProps = state => ({
  clients: state.controller.clients,
  selectedClientIndex: state.controller.selectedClientIndex,
});

const mapDispatchToProps = dispatch => ({
  pollClients: () => {
    dispatch(pollClients());
  },
  sendClientAction: (clientId, name, options) => {
    dispatch(sendClientAction(clientId, name, options));
  },
  setSelectedClient: selectedClientIndex => {
    dispatch(setSelectedClient(selectedClientIndex));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Controller);
