import React from 'react';
import propTypes from 'prop-types';
import { midiToFrequency } from '../../lib/helpers';

const Key = ({ type, pitch, onPress }) => (
  <div
    className={`key key-${type}`}
    onMouseDown={() => onPress(pitch, midiToFrequency(pitch))}
    role="presentation"
  />
);

Key.propTypes = {
  type: propTypes.oneOf(['white', 'black']).isRequired,
  pitch: propTypes.number.isRequired,
  onPress: propTypes.func.isRequired,
};

export default Key;
