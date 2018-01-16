import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';

const VisualsManager = ({ gain }) => {
  const color = gain === 1 ? '#FFFFFF' : '#000000';
  return (
    <div className="visuals full-size" style={{ backgroundColor: color }} />
  );
};

VisualsManager.propTypes = {
  gain: propTypes.number.isRequired,
};

const mapStateToProps = state => ({
  gain: state.player.gain,
});

export default connect(mapStateToProps, undefined)(VisualsManager);
