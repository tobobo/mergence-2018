import React, { Component } from 'react';
import map from 'lodash/map';
import { connect } from 'react-redux';
import { getClientId, pollActions } from '../store/actions';

class Player extends Component {
  constructor(props) {
    super(props);
    props.getClientId();
  }

  componentDidUpdate() {
    if (this.props.clientId && !this.polling) {
      this.polling = true;
      this.props.pollActions();
    }
  }

  render() {
    return (
      <div>{map(this.props.playerActions, action => <div>{JSON.stringify(action)}</div>)}</div>
    );
  }
}

const mapStateToProps = state => ({
  playerActions: state.player.actions,
  clientId: state.player.clientId,
});

const mapDispatchToProps = dispatch => ({
  getClientId: () => {
    dispatch(getClientId());
  },
  pollActions: () => {
    dispatch(pollActions());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Player);
