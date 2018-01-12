import { combineReducers } from 'redux';
import extend from 'lodash/extend';
import { RECEIVE_ACTIONS, receiveAction } from './actions';

export default combineReducers({
  player: (state = { actions: undefined }, action) => {
    switch (action.type) {
      case RECEIVE_ACTIONS:
        return extend({}, state, { actions: action.actions });
      default:
        return state;
    }
  },
  controller: null
});
