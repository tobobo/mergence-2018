import React from 'react';
import propTypes from 'prop-types';

function handleSwitch({
  setSelectedClient,
  sendClientAction,
  selectedClientIndex,
  clients,
  direction,
  solo,
}) {
  const oldClientIndex = selectedClientIndex;
  const offsetClientIndex =
    direction === 'asc' ? selectedClientIndex + 1 : selectedClientIndex - 1;
  const newClientIndex =
    offsetClientIndex >= 0
      ? offsetClientIndex % clients.length
      : oldClientIndex + 1 - offsetClientIndex;
  setSelectedClient(newClientIndex);
  sendClientAction(clients[newClientIndex], 'on');
  if (solo) sendClientAction(clients[oldClientIndex], 'off');
}

const SwitchClients = ({
  setSelectedClient,
  selectedClientIndex,
  clients,
  direction,
  sendClientAction,
  children,
  solo,
}) => (
  <button
    onClick={() =>
      handleSwitch({
        setSelectedClient,
        selectedClientIndex,
        clients,
        direction,
        sendClientAction,
        solo,
      })
    }
  >
    {children}
  </button>
);

SwitchClients.propTypes = {
  setSelectedClient: propTypes.func.isRequired,
  sendClientAction: propTypes.func.isRequired,
  selectedClientIndex: propTypes.number.isRequired,
  clients: propTypes.arrayOf(propTypes.string).isRequired,
  direction: propTypes.string.isRequired,
  children: propTypes.element.isRequired,
  solo: propTypes.bool.isRequired,
};

export default SwitchClients;
