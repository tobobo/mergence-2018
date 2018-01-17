import React from 'react';
import propTypes from 'prop-types';
import map from 'lodash/map';
import Key from './Key';

const Octave = ({ octave, onKeyPress }) => {
  const basePitch = (octave + 1) * 12;
  const [w, b] = ['white', 'black'];
  const keyPattern = [w, b, w, b, w, w, b, w, b, w, b, w];
  return (
    <div className="octave">
      {map(keyPattern, (keyType, index) => {
        const pitch = basePitch + index;
        return (
          <Key type={keyType} pitch={pitch} onPress={onKeyPress} key={pitch} />
        );
      })}
    </div>
  );
};

Octave.propTypes = {
  octave: propTypes.number.isRequired,
  onKeyPress: propTypes.func.isRequired,
};

export default Octave;
