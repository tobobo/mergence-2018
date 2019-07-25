import React, { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { Transition } from 'react-transition-group';

const texts = {
  default: {
    welcome: 'please turn up your sound and click to begin',
    thanks: 'thank you',
  },
  touchStart: {
    welcome:
      'please turn on your ringer, turn up your sound, and tap your screen to begin',
  },
};

class TextManager extends Component {
  constructor() {
    super();
    this.state = { textVisible: true };
  }

  componentDidMount() {
    this.waitingForTouch = true;
  }

  componentWillReceiveProps(nextProps) {
    const { initialTouchProvided } = this.props;

    if (nextProps.textKey !== 'welcome') {
      this.setState({ textVisible: true });
      this.fadeOutAfterDelay();
    } else if (
      !initialTouchProvided &&
      nextProps.initialTouchProvided &&
      this.waitingForTouch
    ) {
      this.setState({ textVisible: false });
      this.waitingForTouch = false;
    }
  }

  getText(textKey) {
    const { hasTouch } = this.props;
    if (!textKey) return undefined;
    if (hasTouch && texts.touchStart[textKey]) return texts.touchStart[textKey];
    return texts.default[textKey];
  }

  fadeOutAfterDelay() {
    this.cancelFadeTimer();
    this.fadeTimeout = setTimeout(() => {
      this.setState({ textVisible: false });
    }, 8000);
  }

  cancelFadeTimer() {
    if (this.fadeTimeout) clearTimeout(this.fadeTimeout);
  }

  render() {
    const { textKey } = this.props;
    const { textVisible } = this.state;
    return (
      <Transition in={textVisible} appear timeout={0}>
        {state => (
          <div className={`text text-${state}`}>{this.getText(textKey)}</div>
        )}
      </Transition>
    );
  }
}

TextManager.defaultProps = {
  textKey: 'welcome',
};

TextManager.propTypes = {
  textKey: propTypes.string,
  hasTouch: propTypes.bool.isRequired,
  initialTouchProvided: propTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  textKey: state.player.text,
  hasTouch: state.player.hasTouchStart,
  initialTouchProvided: state.player.initialTouchProvided,
});

export default connect(mapStateToProps, undefined)(TextManager);
