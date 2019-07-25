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

  componentWillReceiveProps(nextProps) {
    const { initialTouchProvided } = this.props;
    if (this.hasAudio) {
      this.setGain(nextProps.gain);
      this.setFrequency(nextProps.frequency);
    }
    if (
      !initialTouchProvided &&
      nextProps.initialTouchProvided &&
      !this.oscillatorsStarted
    ) {
      this.startOscillators();
    }
  }

  setupOscillators() {
    const { frequency, gain } = this.props;
    this.baseFreq = frequency;

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
    this.mainGain.gain.value = gain;
    this.oscillator.connect(this.mainGain);
    lowGain.connect(this.mainGain);

    this.mainGain.connect(this.audioContext.destination);
    this.advanceLfos();
  }

  setGain(newGain) {
    this.mainGain.gain.value = newGain;
  }

  setFrequency(newFrequency) {
    this.baseFreq = newFrequency;
  }

  startOscillators() {
    this.oscillator.start(0);
    this.lowOsc.start(0);
    this.oscillatorsStarted = true;
  }

  advanceLfos() {
    const oscSinVal = Math.sin(this.audioContext.currentTime * 50) * 4;
    this.oscillator.frequency.value = this.baseFreq + oscSinVal;
    const lowOscSinVal = Math.sin(this.audioContext.currentTime * 0.075) * 1;
    const lowBaseFreq = this.baseFreq / 2;
    this.lowOsc.frequency.value = lowBaseFreq + lowOscSinVal;
    setTimeout(() => this.advanceLfos(), 1);
  }

  render() {
    return '';
  }
}

AudioManager.propTypes = {
  gain: propTypes.number,
  frequency: propTypes.number,
  initialTouchProvided: propTypes.bool.isRequired,
};

AudioManager.defaultProps = {
  gain: 0,
  frequency: 220,
};

const mapStateToProps = ({
  player: { gain, frequency, initialTouchProvided },
}) => ({
  gain,
  frequency,
  initialTouchProvided,
});

export default connect(mapStateToProps, undefined)(AudioManager);
