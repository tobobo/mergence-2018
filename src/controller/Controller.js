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

  confirmRefresh() {
    const { sendClientAction: sendAction } = this.props;
    // eslint-disable-next-line no-alert
    if (window.confirm('reset state of all clients?'))
      sendAction(['*'], 'refresh');
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
        <div>
          <div className="control-box">
            <ClientSwitcher
              setSelectedClient={setSelected}
              selectedClientIndex={selectedClientIndex}
              clients={clients}
              sendClientAction={sendAction}
              direction="asc"
            />
          </div>
          <div className="control-box">
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
              <button onClick={() => sendAction(['*'], 'switch')}>
                switch
              </button>
            </div>
          </div>
          <div className="control-box">
            <div>
              <button
                onClick={() => sendAction(['*'], 'multiply', { factor: 2 })}
              >
                8va
              </button>
            </div>
            <div>
              <button
                onClick={() => sendAction(['*'], 'multiply', { factor: 0.5 })}
              >
                8vb
              </button>
            </div>
            <div>
              <button onClick={() => sendAction(['*'], 'reset')}>reset</button>
            </div>
          </div>
          <div className="control-box">
            <div>
              <button
                onClick={() => sendAction(['*'], 'color', { color: 'blue' })}
              >
                blues
              </button>
            </div>
            <div>
              <button
                onClick={() => sendAction(['*'], 'color', { color: 'red' })}
              >
                reds
              </button>
            </div>
            <div>
              <button
                onClick={() => sendAction(['*'], 'color', { color: 'rainbow' })}
              >
                rainbow
              </button>
            </div>
          </div>
          <div className="control-box">
            <div>
              <button onClick={() => sendAction(['*'], 'off')}>all off</button>
            </div>
            <div>
              <button
                onClick={() => sendAction(['*'], 'text', { text: 'thanks' })}
              >
                thanks
              </button>
            </div>
            <div>
              <button onClick={() => this.confirmRefresh()}>
                full refresh
              </button>
            </div>
          </div>
        </div>
        <KeyboardContainer clients={clients} sendClientAction={sendAction} />
        {/* map(clients, clientId => (
          <div key={clientId}>
            {clientId}
            <button onClick={() => sendAction([clientId], 'on')}>on</button>
            <button onClick={() => sendAction([clientId], 'off')}>off</button>
          </div>
        )) */}
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
