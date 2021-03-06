import React, { Component } from 'react';
import { connect } from 'react-redux';
import { map } from 'lodash';
import propTypes from 'prop-types';
import {
  pollClients,
  sendClientAction,
  setSelectedClient,
  sendKeyboardNote,
  changeKeyboardMode,
} from '../store/actions';
import ClientSwitcher from './controls/ClientSwitcher';
import KeyboardContainer from './controls/KeyboardContainer';
import RandomGroup from './controls/RandomGroup';
import MidiManager from './MidiManager';

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
      sendKeyboardNote: sendNote,
      changeKeyboardMode: changeKeyMode,
      keyboardMode,
      setSelectedClient: setSelected,
    } = this.props;
    return (
      <div>
        <MidiManager />
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
        <KeyboardContainer clients={clients} sendKeyboardNote={sendNote} />
        <label htmlFor="modeSoloist">
          <input
            type="radio"
            id="modeSoloist"
            checked={keyboardMode === 'soloist'}
            onChange={e => {
              if (e.target.checked) changeKeyMode('soloist');
            }}
          />Soloist
        </label>
        <label htmlFor="modeRoundRobin">
          <input
            type="radio"
            id="modeRoundRobin"
            checked={keyboardMode === 'round robin'}
            onChange={e => {
              if (e.target.checked) changeKeyMode('round robin');
            }}
          />Round Robin
        </label>
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
  sendKeyboardNote: propTypes.func.isRequired,
  setSelectedClient: propTypes.func.isRequired,
  changeKeyboardMode: propTypes.func.isRequired,
  keyboardMode: propTypes.string.isRequired,
  clients: propTypes.arrayOf(propTypes.string),
  selectedClientIndex: propTypes.number.isRequired,
};

Controller.defaultProps = {
  clients: [],
};

const mapStateToProps = state => ({
  clients: state.controller.clients,
  selectedClientIndex: state.controller.selectedClientIndex,
  keyboardMode: state.controller.keyboardMode,
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
  sendKeyboardNote: selectedClientIndex => {
    dispatch(sendKeyboardNote(selectedClientIndex));
  },
  changeKeyboardMode: mode => {
    dispatch(changeKeyboardMode(mode));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Controller);
