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
    this.baseFreq = this.props.frequency;

    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.type = 'sine';
    this.oscillator.frequency.value = this.baseFreq;

    this.lowOsc = this.audioContext.createOscillator();
    this.lowOsc.type = 'square';
    this.lowOsc.frequency.value = this.baseFreq / 2;

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
    this.advanceLfos();
  }

  setGain(newGain) {
    this.mainGain.gain.value = newGain;
  }

  advanceLfos() {
    const oscSinVal = Math.sin(this.audioContext.currentTime * 50) * 2;
    this.oscillator.frequency.value = this.baseFreq + oscSinVal;
    const lowOscSinVal = Math.sin(this.audioContext.currentTime * 0.075) * 0.75;
    const lowBaseFreq = this.baseFreq / 2;
    this.lowOsc.frequency.value = lowBaseFreq + lowOscSinVal;
    setTimeout(() => this.advanceLfos(), 1);
  }

  render() {
    return '';
  }
}

AudioManager.propTypes = {
  gain: propTypes.bool,
  frequency: propTypes.number,
};

AudioManager.defaultProps = {
  gain: 0,
  frequency: 220,
};

const mapStateToProps = state => ({
  gain: state.player.gain,
});

export default connect(mapStateToProps, undefined)(AudioManager);
