import React from 'react';
import propTypes from 'prop-types';

const Key = ({ type, pitch, onPress }) => {
  const frequency = 2 ** ((pitch - 69) / 12) * 440;
  return (
    <div
      className={`key key-${type}`}
      onMouseDown={() => onPress(pitch, frequency)}
      role="presentation"
    />
  );
};

Key.propTypes = {
  type: propTypes.oneOf(['white', 'black']).isRequired,
  pitch: propTypes.number.isRequired,
  onPress: propTypes.func.isRequired,
};

export default Key;
