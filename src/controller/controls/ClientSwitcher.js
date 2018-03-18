import React, { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { setClientSwitchSolo, sendClientSwitch } from '../../store/actions';

class ClientSwitcher extends Component {
  handleSoloChange(e) {
    const { setSolo } = this.props;
    setSolo(e.target.checked);
  }

  handleSwitch(direction) {
    const { clients, selectedClientIndex, sendSwitch } = this.props;
    if (!clients.length) return;
    const offsetClientIndex =
      direction === 'asc' ? selectedClientIndex + 1 : selectedClientIndex - 1;
    sendSwitch(offsetClientIndex);
  }

  render() {
    const { selectedClientIndex, clients, solo } = this.props;
    return (
      <div>
        <div>clients: {clients.length}</div>
        {clients.length ? (
          <div>selected: {selectedClientIndex + 1}</div>
        ) : (
          <div>
            <em>no client to select</em>
          </div>
        )}
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
  sendSwitch: propTypes.func.isRequired,
  selectedClientIndex: propTypes.number.isRequired,
  clients: propTypes.arrayOf(propTypes.string).isRequired,
  setSolo: propTypes.func.isRequired,
  solo: propTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  solo: state.controller.clientSwitchSolo,
});

const mapDispatchToProps = dispatch => ({
  setSolo: soloValue => dispatch(setClientSwitchSolo(soloValue)),
  sendSwitch: newClientIndex => dispatch(sendClientSwitch(newClientIndex)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientSwitcher);
