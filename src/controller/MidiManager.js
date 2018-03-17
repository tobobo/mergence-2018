import { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { sendClientAction, sendKeyboardNote } from '../store/actions';
import { midiToFrequency } from './lib/helpers';

class MidiManager extends Component {
  componentDidMount() {
    if (!navigator.requestMIDIAccess) return;
    navigator.requestMIDIAccess().then(midi => {
      this.midi = midi;
      this.getMidiInputs();
    });
  }
  onMidiMessage(message) {
    switch (message.data[0]) {
      case 144:
        this.handleNotePress(message.data[1]);
        break;
      default:
    }
  }

  getMidiInputs() {
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

  handleNotePress(pitch) {
    const { sendKeyboardNote: sendNote } = this.props;
    sendNote(midiToFrequency(pitch));
  }

  render() {
    return '';
  }
}

MidiManager.propTypes = {
  // sendClientAction: propTypes.func.isRequired,
  sendKeyboardNote: propTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  sendClientAction: (clientId, name, options) => {
    dispatch(sendClientAction(clientId, name, options));
  },

  sendKeyboardNote: frequency => {
    dispatch(sendKeyboardNote(frequency));
  },
});

export default connect(undefined, mapDispatchToProps)(MidiManager);
