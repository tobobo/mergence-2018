import { combineReducers } from 'redux';
import extend from 'lodash/extend';
import {
  RECEIVE_CLIENT_ID,
  RECEIVE_ON,
  RECEIVE_OFF,
  RECEIVE_ACTIONS,
  RECEIVE_CLIENTS,
} from './actions';

export default combineReducers({
  player: (state = { actions: undefined, clientId: undefined, gain: 0 }, action) => {
    switch (action.type) {
      case RECEIVE_CLIENT_ID:
        return extend({}, state, { clientId: action.clientId });
      case RECEIVE_ON:
        return extend({}, state, { gain: 1 });
      case RECEIVE_OFF:
        return extend({}, state, { gain: 0 });
      case RECEIVE_ACTIONS:
        return extend({}, state, { actions: action.actions });
      default:
        return state;
    }
  },
  controller: (state = { clients: undefined }, action) => {
    switch (action.type) {
      case RECEIVE_CLIENTS:
        return extend({}, state, { clients: action.clients });
      default:
        return state;
    }
  },
});
