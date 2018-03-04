import { combineReducers } from 'redux';
import extend from 'lodash/extend';
import forEachRight from 'lodash/forEachRight';
import {
  RECEIVE_CLIENT_ID,
  RECEIVE_CLIENT_ACTIONS,
  RECEIVE_CLIENTS,
  SET_SELECTED_CLIENT,
  HANDLE_INITIAL_TOUCH,
  SET_HAS_TOUCH_START,
} from './actions';

const clientActionMappings = {
  on: state => extend({}, state, { gain: 1 }),
  off: state => extend({}, state, { gain: 0 }),
  frequency: (state, { frequency }) => extend({}, state, { frequency }),
  multiply: (state, { factor }) =>
    extend({}, state, { frequency: state.frequency * factor }),
  switch: state => extend({}, state, { gain: state.gain ? 0 : 1 }),
  text: (state, { text }) =>
    extend({}, state, { text, textUpdateTime: Date.now() }),
};

function handleReceiveClientActions(state, { clientActions }) {
  let newState = extend({}, state, { clientActions });
  forEachRight(clientActions, clientAction => {
    if (!clientActionMappings[clientAction.type]) return;
    newState = clientActionMappings[clientAction.type](
      newState,
      clientAction.options,
    );
  });
  return newState;
}

function handleReceiveClients(state, { clients }) {
  const newStateValues = { clients };
  if (!clients.length) {
    newStateValues.selectedClientIndex = 0;
  } else if (clients.length < state.selectedClientIndex) {
    newStateValues.selectedClientIndex = clients.length - 1;
  }
  return extend({}, state, newStateValues);
}

export default combineReducers({
  player: (
    state = {
      clientActions: undefined,
      clientId: undefined,
      gain: 0,
      frequency: 220,
      hasTouchStart: undefined,
      initialTouchProvided: false,
    },
    action,
  ) => {
    switch (action.type) {
      case RECEIVE_CLIENT_ID:
        return extend({}, state, { clientId: action.clientId });
      case RECEIVE_CLIENT_ACTIONS:
        return handleReceiveClientActions(state, action);
      case HANDLE_INITIAL_TOUCH:
        return extend({}, state, { initialTouchProvided: true });
      case SET_HAS_TOUCH_START:
        return extend({}, state, { hasTouchStart: action.hasTouchStart });
      default:
        return state;
    }
  },
  controller: (
    state = { clients: undefined, selectedClientIndex: 0 },
    action,
  ) => {
    switch (action.type) {
      case RECEIVE_CLIENTS:
        return handleReceiveClients(state, action);
      case SET_SELECTED_CLIENT:
        return extend({}, state, {
          selectedClientIndex: action.selectedClientIndex,
        });
      default:
        return state;
    }
  },
});
