import React, { Component } from 'react';
import propTypes from 'prop-types';
import Keyboard from './keyboard/Keyboard';

class KeyboardContainer extends Component {
  constructor(props) {
    super(props);
    this.selectedClientIndex = 0;
  }

  render() {
    const { sendKeyboardNote } = this.props;
    return (
      <Keyboard
        onKeyPress={(pitch, frequency) => sendKeyboardNote(frequency)}
      />
    );
  }
}

KeyboardContainer.propTypes = {
  sendKeyboardNote: propTypes.func.isRequired,
};

export default KeyboardContainer;
