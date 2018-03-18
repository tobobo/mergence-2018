import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleRandomGroup } from '../../store/actions';

const RandomGroup = ({ toggle, onOrOff }) => (
  <button onClick={() => toggle(onOrOff)}>random group {onOrOff}</button>
);

RandomGroup.propTypes = {
  toggle: propTypes.func.isRequired,
  onOrOff: propTypes.oneOf(['on', 'off']).isRequired,
};

const mapDispatchToProps = dispatch => ({
  toggle: onOrOff => dispatch(toggleRandomGroup(onOrOff)),
});

export default connect(undefined, mapDispatchToProps)(RandomGroup);
