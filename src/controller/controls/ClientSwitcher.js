import React, { Component } from 'react';
import propTypes from 'prop-types';
import SwitchClient from './SwitchClient';

class ClientSwitcher extends Component {
  constructor(props) {
    super(props);
    this.state = { solo: true };
  }

  handleSoloChange(e) {
    this.setState({ solo: e.target.checked });
  }

  render() {
    const {
      setSelectedClient,
      selectedClientIndex,
      clients,
      sendClientAction,
    } = this.props;
    const { solo } = this.state;
    return (
      <div>
        <div>clients: {clients.length}</div>
        <div>selected: {selectedClientIndex + 1}</div>
        <SwitchClient
          setSelectedClient={setSelectedClient}
          selectedClientIndex={selectedClientIndex}
          clients={clients}
          sendClientAction={sendClientAction}
          direction="asc"
          solo={solo}
        >
          +
        </SwitchClient>
        <SwitchClient
          setSelectedClient={setSelectedClient}
          selectedClientIndex={selectedClientIndex}
          sendClientAction={sendClientAction}
          clients={clients}
          direction="desc"
          solo={solo}
        >
          -
        </SwitchClient>
        <label htmlFor="solo">
          <input
            type="checkbox"
            checked={this.state.solo}
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
