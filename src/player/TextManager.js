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

function hasTouchStart() {
  return 'ontouchstart' in window;
}

function getText(textKey) {
  if (!textKey) return undefined;
  if (hasTouchStart() && texts.touchStart[textKey])
    return texts.touchStart[textKey];
  return texts.default[textKey];
}

class TextManager extends Component {
  constructor() {
    super();
    this.state = { textVisible: true };
  }

  componentDidMount() {
    if (hasTouchStart()) {
      this.waitForTap = true;
    }
  }

  componentWillReceiveProps(nextProps) {
    // make sure to fade out when new text comes in early
    if (nextProps.textKey !== 'welcome') {
      this.waitForTap = false;
      this.setState({ textVisible: true });
    }
  }

  waitForFadeOut() {
    this.waitingForFadeOut = true;
    if (this.waitForTap) {
      window.addEventListener('touchstart', () => {
        this.waitingForFadeOut = false;
        this.setState({ textVisible: false });
      });
    } else {
      setTimeout(() => {
        this.waitingForFadeOut = false;
        this.setState({ textVisible: false });
      }, 8000);
    }
  }

  render() {
    const { textKey } = this.props;
    const { textVisible } = this.state;
    const text = getText(textKey);
    return (
      <Transition
        in={textVisible}
        appear
        onEntered={() => this.waitForFadeOut()}
        timeout={0}
      >
        {state => <div className={`text text-${state}`}>{text}</div>}
      </Transition>
    );
  }
}

TextManager.defaultProps = {
  textKey: 'welcome',
};

TextManager.propTypes = {
  textKey: propTypes.string,
};

const mapStateToProps = state => ({
  textKey: state.player.text,
  textUpdateTime: state.player.textUpdateTime,
});

export default connect(mapStateToProps, undefined)(TextManager);
