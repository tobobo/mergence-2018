import React from 'react';
import propTypes from 'prop-types';
import Keyboard from './keyboard/Keyboard';

const KeyboardContainer = props => {
  const { sendKeyboardNote } = props;
  return (
    <Keyboard onKeyPress={(pitch, frequency) => sendKeyboardNote(frequency)} />
  );
};

KeyboardContainer.propTypes = {
  sendKeyboardNote: propTypes.func.isRequired,
};

export default KeyboardContainer;
