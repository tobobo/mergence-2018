import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import TextManager from './TextManager';

function randomIntInRange(low, high) {
  return low + Math.round(Math.random() * (high - low));
}

function rgbString(red, green, blue) {
  return `rgb(${red}, ${green}, ${blue})`;
}

function getOnColor(color) {
  switch (color) {
    case 'white':
      return '#FFFFFF';
    case 'blue':
      return rgbString(
        randomIntInRange(0, 50),
        randomIntInRange(0, 50),
        randomIntInRange(125, 225)
      );
    case 'red':
      return rgbString(
        randomIntInRange(125, 225),
        randomIntInRange(0, 50),
        randomIntInRange(0, 50)
      );
    case 'rainbow':
      return rgbString(
        randomIntInRange(0, 225),
        randomIntInRange(0, 225),
        randomIntInRange(0, 225)
      );
    default:
      return '#FFFFFF';
  }
}

const VisualsManager = ({ gain, color }) => {
  const backgroundColor = gain === 1 ? getOnColor(color) : '#000000';
  return (
    <div className="visuals full-size" style={{ backgroundColor }}>
      <TextManager />
    </div>
  );
};

VisualsManager.propTypes = {
  gain: propTypes.number.isRequired,
  color: propTypes.string.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  colorIncrement: propTypes.string.isRequired,
};

const mapStateToProps = state => ({
  gain: state.player.gain,
  color: state.player.color,
  colorIncrement: state.player.colorIncrement,
});

export default connect(mapStateToProps, undefined)(VisualsManager);
