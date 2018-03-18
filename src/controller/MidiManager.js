import { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  sendClientAction,
  sendKeyboardNote,
  sendClientSwitch,
  setClientSwitchSolo,
} from '../store/actions';
import { midiToFrequency } from './lib/helpers';

function mapIntRange(value, inMin, inMax, outMin, outMax) {
  const proportion = value / (inMax - inMin);
  const unroundedMap = proportion * (outMax - outMin) + outMin;
  return Math.round(unroundedMap);
}

class MidiManager extends Component {
  componentDidMount() {
    if (!navigator.requestMIDIAccess) return;
    navigator.requestMIDIAccess().then(midi => {
      this.midi = midi;
      this.scanForMidi();
    });
    this.controllerMappings = {
      16: this.switchClient,
      32: this.setSolo,
      65: this.sendSwitch,
      34: this.send8va,
      50: this.send8vb,
      66: this.sendReset,
      35: this.sendBlues,
      51: this.sendReds,
      67: this.sendRainbow,
      36: this.sendAllOff,
      52: this.sendThanks,
    };
  }

  onMidiMessage(message) {
    switch (message.data[0]) {
      case 144:
        // note press
        this.handleNotePress(message.data[1]);
        break;
      case 176:
        // control change
        this.handleControlChange(message.data[1], message.data[2]);
        break;
      case 248:
        // messages that get sent all the time
        break;
      default:
        console.log('unknown midi message', message);
    }
  }

  setSolo(value) {
    const { setSolo } = this.props;
    setSolo(value === 127);
  }

  switchClient(value) {
    const { clients, selectedClientIndex, sendSwitch } = this.props;
    if (!clients.length) return;
    const mappedControllerValue = mapIntRange(
      value,
      0,
      127,
      0,
      Math.max(clients.length - 1, 0)
    );
    if (mappedControllerValue !== selectedClientIndex)
      sendSwitch(mappedControllerValue);
  }

  handleNotePress(pitch) {
    const { sendKeyboardNote: sendNote } = this.props;
    sendNote(midiToFrequency(pitch));
  }

  handleControlChange(controlNumber, controlValue) {
    console.log('control change', controlNumber, controlValue);
    if (!this.controllerMappings[controlNumber]) return;
    this.controllerMappings[controlNumber].call(this, controlValue, this.props);
  }

  scanForMidi() {
    const inputs = this.midi.inputs.values();
    const boundOnMidiMessage = this.onMidiMessage.bind(this);
    let input;
    for (
      input = inputs.next();
      input && input.value && !input.done;
      input = inputs.next()
    ) {
      input.value.onmidimessage = boundOnMidiMessage;
    }
  }

  sendSwitch(value) {
    if (value === 0) return;
    const { sendAction } = this.props;
    sendAction(['*'], 'switch');
  }

  send8va(value) {
    if (value === 0) return;
    const { sendAction } = this.props;
    sendAction(['*'], 'multiply', { factor: 2 });
  }

  send8vb(value) {
    if (value === 0) return;
    const { sendAction } = this.props;
    sendAction(['*'], 'multiply', { factor: 0.5 });
  }

  sendReset(value) {
    if (value === 0) return;
    const { sendAction } = this.props;
    sendAction(['*'], 'reset');
  }

  sendBlues(value) {
    if (value === 0) return;
    const { sendAction } = this.props;
    sendAction(['*'], 'color', { color: 'blue' });
  }

  sendReds(value) {
    if (value === 0) return;
    const { sendAction } = this.props;
    sendAction(['*'], 'color', { color: 'red' });
  }

  sendRainbow(value) {
    if (value === 0) return;
    const { sendAction } = this.props;
    sendAction(['*'], 'color', { color: 'rainbow' });
  }

  sendAllOff(value) {
    if (value === 0) return;
    const { sendAction } = this.props;
    sendAction(['*'], 'off');
  }

  sendThanks(value) {
    if (value === 0) return;
    const { sendAction } = this.props;
    sendAction(['*'], 'text', { text: 'thanks' });
  }

  render() {
    return '';
  }
}

MidiManager.defaultProps = {
  clients: [],
};

MidiManager.propTypes = {
  sendAction: propTypes.func.isRequired,
  sendSwitch: propTypes.func.isRequired,
  setSolo: propTypes.func.isRequired,
  selectedClientIndex: propTypes.number.isRequired,
  clients: propTypes.arrayOf(propTypes.string),
  sendKeyboardNote: propTypes.func.isRequired,
};

const mapStateToProps = state => ({
  clients: state.controller.clients,
});

const mapDispatchToProps = dispatch => ({
  sendAction: (clientId, name, options) => {
    dispatch(sendClientAction(clientId, name, options));
  },

  sendSwitch: newClientId => {
    dispatch(sendClientSwitch(newClientId));
  },

  setSolo: soloValue => {
    dispatch(setClientSwitchSolo(soloValue));
  },

  sendKeyboardNote: frequency => {
    dispatch(sendKeyboardNote(frequency));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MidiManager);
