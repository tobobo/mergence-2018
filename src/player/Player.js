import React, { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { getClientId, pollClientActions } from '../store/actions';
import AudioManager from './AudioManager';
import VisualsManager from './VisualsManager';
import TouchManager from './TouchManager';

class Player extends Component {
  constructor(props) {
    super(props);
    props.getClientId();
  }

  componentDidUpdate() {
    if (this.props.clientId && !this.polling) {
      this.polling = true;
      this.props.pollClientActions(this.props.clientId);
    }
  }

  render() {
    return (
      <div className="full-size">
        <TouchManager />
        <VisualsManager />
        <AudioManager />
        {/* <div>
          {map(this.props.clientActions, clientAction => (
            <div key={clientAction.time}>{JSON.stringify(clientAction)}</div>
          ))}
        </div> */}
      </div>
    );
  }
}

Player.propTypes = {
  getClientId: propTypes.func.isRequired,
  pollClientActions: propTypes.func.isRequired,
  // clientActions: propTypes.arrayOf(propTypes.shape({})),
  clientId: propTypes.string,
};

Player.defaultProps = {
  // clientActions: [],
  clientId: undefined,
};

const mapStateToProps = state => ({
  clientActions: state.player.clientActions,
  clientId: state.player.clientId,
});

const mapDispatchToProps = dispatch => ({
  getClientId: () => {
    dispatch(getClientId());
  },
  pollClientActions: clientId => {
    dispatch(pollClientActions(clientId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Player);
