import React, { Component } from 'react';
import map from 'lodash/map';
import { connect } from 'react-redux';
import uuidv4 from 'uuid/v4';
import store from '../store/store';
import { pollActions } from '../store/actions';

class Player extends Component {
  constructor(props) {
    super(props);
    this.state = { playerActions: [], clientId: uuidv4() };
  }

  componentDidMount() {
    this.props.onMount();
    this.unsubscribe = store.subscribe(this.handleStoreChange.bind(this));
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleStoreChange() {
    this.setState({ playerActions: store.getState().player.actions });
  }

  render() {
    return (
      <div>
        {map(this.state.playerActions, action => (
          <div>{JSON.stringify(action)}</div>
        ))}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  onMount: () => {
    dispatch(pollActions());
  }
});

export default connect(() => ({}), mapDispatchToProps)(Player);
