import { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';

function getAudioContext() {
  const Context = window.AudioContext || window.webkitAudioContext;
  if (Context) {
    return new Context();
  }
  return undefined;
}

class AudioManager extends Component {
  componentDidMount() {
    this.audioContext = getAudioContext();
    if (typeof this.audioContext === 'object') this.hasAudio = true;
    if (this.hasAudio) this.setupOscillators();
  }

  componentWillReceiveProps(newProps) {
    if (this.hasAudio) {
      this.setGain(newProps.gain);
    }
  }

  setupOscillators() {
    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.type = 'sine';
    this.oscillator.frequency.value = 220;
    this.oscillator.baseFreq = 220;

    this.lowOsc = this.audioContext.createOscillator();
    this.lowOsc.type = 'square';
    this.lowOsc.frequency.value = 110;
    this.lowOsc.baseFreq = 110;

    const lowGain = this.audioContext.createGain();
    this.lowOsc.connect(lowGain);
    lowGain.gain.value = 0.48;

    this.mainGain = this.audioContext.createGain();
    this.mainGain.gain.value = this.props.gain;
    this.oscillator.connect(this.mainGain);
    lowGain.connect(this.mainGain);

    this.mainGain.connect(this.audioContext.destination);
    this.oscillator.start(0);
    this.lowOsc.start(0);
  }

  setGain(newGain) {
    this.mainGain.gain.value = newGain;
  }

  render() {
    return '';
  }
}

AudioManager.propTypes = {
  gain: propTypes.bool,
};

AudioManager.defaultProps = {
  gain: 0,
};

const mapStateToProps = state => ({
  gain: state.player.gain,
});

export default connect(mapStateToProps, undefined)(AudioManager);
