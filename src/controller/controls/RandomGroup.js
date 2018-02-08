import React from 'react';
import propTypes from 'prop-types';
import { sortBy, slice } from 'lodash';

const randomGroupToggle = ({ clients, sendClientAction, onOrOff }) => {
  const baseSliceSize = clients.length / 2;
  const fuzzedSliceSize = baseSliceSize * Math.random() + 0.5;
  const safeSliceSize = Math.max(
    Math.min(clients.length, Math.floor(fuzzedSliceSize)),
    1,
  );
  const shuffledClients = sortBy(clients, () => Math.random());
  const randomClientSlice = slice(shuffledClients, 0, safeSliceSize);
  sendClientAction(randomClientSlice, onOrOff);
};

const RandomGroup = ({ clients, sendClientAction, onOrOff }) => (
  <button
    onClick={() => randomGroupToggle({ clients, sendClientAction, onOrOff })}
  >
    random group {onOrOff}
  </button>
);

RandomGroup.propTypes = {
  clients: propTypes.arrayOf(propTypes.string).isRequired,
  sendClientAction: propTypes.func.isRequired,
  onOrOff: propTypes.oneOf(['on', 'off']).isRequired,
};

export default RandomGroup;
