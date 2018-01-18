import React from 'react';
import propTypes from 'prop-types';
import range from 'lodash/range';
import map from 'lodash/map';
import Octave from './Octave';

const Keyboard = ({ onKeyPress }) => (
  <div className="keyboard">
    {map(range(2, 7), octave => (
      <Octave key={octave} octave={octave} onKeyPress={onKeyPress} />
    ))}
  </div>
);

Keyboard.propTypes = { onKeyPress: propTypes.func.isRequired };

export default Keyboard;
