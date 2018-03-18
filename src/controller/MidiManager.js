import { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  sendClientAction,
  sendKeyboardNote,
  sendClientSwitch,
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

  handleControlChange(controlNumber, controlValue) {
    console.log('control change', controlNumber, controlValue);
    if (!this.controllerMappings[controlNumber]) return;
    this.controllerMappings[controlNumber].call(this, controlValue, this.props);
  }

  handleNotePress(pitch) {
    const { sendKeyboardNote: sendNote } = this.props;
    sendNote(midiToFrequency(pitch));
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

  render() {
    return '';
  }
}

MidiManager.defaultProps = {
  clients: [],
};

MidiManager.propTypes = {
  sendClientAction: propTypes.func.isRequired,
  sendSwitch: propTypes.func.isRequired,
  selectedClientIndex: propTypes.number.isRequired,
  clients: propTypes.arrayOf(propTypes.string),
  sendKeyboardNote: propTypes.func.isRequired,
};

const mapStateToProps = state => ({
  clients: state.controller.clients,
});

const mapDispatchToProps = dispatch => ({
  sendClientAction: (clientId, name, options) => {
    dispatch(sendClientAction(clientId, name, options));
  },

  sendSwitch: (clientId, name, options) => {
    dispatch(sendClientSwitch(clientId, name, options));
  },

  sendKeyboardNote: frequency => {
    dispatch(sendKeyboardNote(frequency));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MidiManager);
