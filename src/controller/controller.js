import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sendAction } from '../store/actions';

class Controller extends Component {
  render() {
    return <button onClick={this.props.onActionClick}>Dispatch</button>;
  }
}

const matchDispatchToProps = dispatch => ({
  onActionClick: () => {
    dispatch(sendAction('my_action', { action: 'opts' }));
  }
});

export default connect(() => ({}), matchDispatchToProps)(Controller);
