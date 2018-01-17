import React, { Component } from 'react';
import propTypes from 'prop-types';

class ClientSwitcher extends Component {
  constructor(props) {
    super(props);
    this.state = { solo: true };
  }

  handleSoloChange(e) {
    this.setState({ solo: e.target.checked });
  }

  handleSwitch(direction) {
    const { solo } = this.state;
    const {
      clients,
      setSelectedClient,
      sendClientAction,
      selectedClientIndex,
    } = this.props;
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

  render() {
    const { selectedClientIndex, clients } = this.props;
    const { solo } = this.state;
    return (
      <div>
        <div>clients: {clients.length}</div>
        <div>selected: {selectedClientIndex + 1}</div>
        <button onClick={() => this.handleSwitch('asc')}>+</button>
        <button onClick={() => this.handleSwitch('desc')}>-</button>
        <label htmlFor="solo">
          <input
            type="checkbox"
            checked={solo}
            onChange={e => this.handleSoloChange(e)}
            id="solo"
          />
          solo
        </label>
      </div>
    );
  }
}

ClientSwitcher.propTypes = {
  setSelectedClient: propTypes.func.isRequired,
  sendClientAction: propTypes.func.isRequired,
  selectedClientIndex: propTypes.number.isRequired,
  clients: propTypes.arrayOf(propTypes.string).isRequired,
};

export default ClientSwitcher;
