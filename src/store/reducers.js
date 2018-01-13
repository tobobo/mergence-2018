import { combineReducers } from 'redux';
import extend from 'lodash/extend';
import forEachRight from 'lodash/forEachRight';
import { RECEIVE_CLIENT_ID, RECEIVE_CLIENT_ACTIONS, RECEIVE_CLIENTS } from './actions';

const clientActionMappings = {
  on: state => extend({}, state, { gain: 1 }),
  off: state => extend({}, state, { gain: 0 }),
};

function handleReceiveClientActions(state, { clientActions }) {
  let newState = extend({}, state, { clientActions });
  forEachRight(clientActions, (clientAction) => {
    if (!clientActionMappings[clientAction.type]) return;
    newState = clientActionMappings[clientAction.type](newState);
  });
  return newState;
}

export default combineReducers({
  player: (state = { clientActions: undefined, clientId: undefined, gain: 0 }, action) => {
    switch (action.type) {
      case RECEIVE_CLIENT_ID:
        return extend({}, state, { clientId: action.clientId });
      case RECEIVE_CLIENT_ACTIONS:
        return handleReceiveClientActions(state, action);
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
