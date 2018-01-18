import React, { Component } from 'react';
import propTypes from 'prop-types';
import Keyboard from './keyboard/Keyboard';

class KeyboardContainer extends Component {
  constructor(props) {
    super(props);
    this.selectedClientIndex = 0;
  }

  sendFreqToNextClient(frequency) {
    const { selectedClientIndex } = this;
    const { clients, sendClientAction } = this.props;
    if (!clients.length) return;
    const offsetClientIndex = selectedClientIndex + 1;
    const newClientIndex = offsetClientIndex % clients.length;
    sendClientAction(clients[newClientIndex], 'frequency', { frequency });
    this.selectedClientIndex = newClientIndex;
  }

  render() {
    return (
      <Keyboard
        onKeyPress={(pitch, frequency) => this.sendFreqToNextClient(frequency)}
      />
    );
  }
}

KeyboardContainer.propTypes = {
  sendClientAction: propTypes.func.isRequired,
  clients: propTypes.arrayOf(propTypes.string).isRequired,
};

export default KeyboardContainer;
