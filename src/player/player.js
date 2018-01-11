import React, { Component } from 'react';
import map from 'lodash/map';
import { connect } from 'react-redux';
import store from '../store/store';
import { RECEIVE_ACTION, pollActions } from '../store/actions';

class Player extends Component {
  constructor(props) {
    super(props);
    this.state = { playerActions: [] };
  }

  componentDidMount() {
    console.log('on mount');
    this.props.onMount();
    this.unsubscribe = store.subscribe(this.handleStoreChange.bind(this));
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleStoreChange() {
    console.log('store', store.getState());
    this.setState({ playerActions: store.getState().player.actions });
  }

  render() {
    console.log('state', this.state);
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
