import React, { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { Transition } from 'react-transition-group';

const texts = {
  default: {
    welcome: 'please turn up your sound',
    thanks: 'thank you',
  },
  touchStart: {
    welcome: 'please turn up your sound and tap your screen to begin',
  },
};

class TextManager extends Component {
  constructor() {
    super();
    this.state = { textVisible: true };
  }

  componentDidMount() {
    this.fadeOutAfterDelay();
  }

  componentWillReceiveProps(nextProps) {
    const { hasTouchStart, textKey } = this.props;
    const { textVisible } = this.state;

    if (nextProps.textKey !== 'welcome') {
      this.setState({ textVisible: true });
      this.fadeOutAfterDelay();
    } else if (
      !hasTouchStart &&
      nextProps.hasTouchStart &&
      textKey === 'welcome' &&
      textVisible
    ) {
      this.cancelFadeTimer();
      this.waitingForTouch = true;
    } else if (
      hasTouchStart &&
      nextProps.initialTouchProvided &&
      this.waitingForTouch
    ) {
      this.setState({ textVisible: false });
      this.waitingForTouch = false;
    }
  }

  getText(textKey) {
    const { hasTouchStart } = this.props;
    if (!textKey) return undefined;
    if (hasTouchStart && texts.touchStart[textKey])
      return texts.touchStart[textKey];
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
  hasTouchStart: undefined,
};

TextManager.propTypes = {
  textKey: propTypes.string,
  hasTouchStart: propTypes.bool,
  initialTouchProvided: propTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  textKey: state.player.text,
  hasTouchStart: state.player.hasTouchStart,
  initialTouchProvided: state.player.initialTouchProvided,
});

export default connect(mapStateToProps, undefined)(TextManager);
