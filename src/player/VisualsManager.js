import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import TextManager from './TextManager';

function getOnColor(color) {
  switch (color) {
    case 'white':
      return '#FFFFFF';
    case 'blue':
      return '#0000FF';
    case 'red':
      return '#FF0000';
    case 'rainbow':
      return '#00FF00';
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
};

const mapStateToProps = state => ({
  gain: state.player.gain,
  color: state.player.color,
});

export default connect(mapStateToProps, undefined)(VisualsManager);
