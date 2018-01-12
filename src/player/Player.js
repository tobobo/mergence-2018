import React, { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import map from 'lodash/map';
import { getClientId, pollActions } from '../store/actions';
import AudioManager from './AudioManager';

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
      <div>
        <AudioManager />
        <div>{map(this.props.playerActions, action => <div>{JSON.stringify(action)}</div>)}</div>
      </div>
    );
  }
}

Player.propTypes = {
  getClientId: propTypes.func.isRequired,
  pollActions: propTypes.func.isRequired,
  playerActions: propTypes.shape([]),
  clientId: propTypes.string,
};

Player.defaultProps = {
  playerActions: [],
  clientId: undefined,
};

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
