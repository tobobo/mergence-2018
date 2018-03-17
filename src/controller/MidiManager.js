import { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { sendClientAction } from '../store/actions';
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
    const {
      sendClientAction: sendAction,
      clients,
      selectedClientIndex,
    } = this.props;
    sendAction([clients[selectedClientIndex]], 'frequency', {
      frequency: midiToFrequency(pitch),
    });
  }

  render() {
    return '';
  }
}

MidiManager.propTypes = {
  sendClientAction: propTypes.func.isRequired,
  clients: propTypes.arrayOf(propTypes.string),
  selectedClientIndex: propTypes.number.isRequired,
};

MidiManager.defaultProps = {
  clients: [],
};

const mapStateToProps = state => ({
  clients: state.controller.clients,
  selectedClientIndex: state.controller.selectedClientIndex,
});

const mapDispatchToProps = dispatch => ({
  sendClientAction: (clientId, name, options) => {
    dispatch(sendClientAction(clientId, name, options));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MidiManager);
