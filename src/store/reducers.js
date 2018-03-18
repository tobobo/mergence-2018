import { combineReducers } from 'redux';
import extend from 'lodash/extend';
import pick from 'lodash/pick';
import forEachRight from 'lodash/forEachRight';
import {
  RECEIVE_CLIENT_ID,
  RECEIVE_CLIENT_ACTIONS,
  RECEIVE_CLIENTS,
  SET_SELECTED_CLIENT,
  SET_CLIENT_SWITCH_SOLO,
  SET_NEXT_KEYBOARD_CLIENT,
  HANDLE_INITIAL_TOUCH,
  SET_HAS_TOUCH_START,
} from './actions';

const initialAudiovisualState = {
  gain: 0,
  frequency: 220,
  color: 'white',
};

const clientActionMappings = {
  on: state => extend({}, state, { gain: 1 }),
  off: state => extend({}, state, { gain: 0 }),
  frequency: (state, { frequency }) => extend({}, state, { frequency }),
  multiply: (state, { factor }) =>
    extend({}, state, { frequency: state.frequency * factor }),
  switch: state => extend({}, state, { gain: state.gain ? 0 : 1 }),
  text: (state, { text }) => extend({}, state, { text }),
  color: (state, { color }) =>
    extend({}, state, {
      color,
      colorIncrement: state.colorIncrement + 1,
    }),
  reset: state =>
    extend({}, state, pick(initialAudiovisualState, 'frequency', 'color')),
  refresh: state => extend({}, state, initialAudiovisualState),
};

function handleReceiveClientActions(state, { clientActions }) {
  let newState = extend({}, state, { clientActions });
  forEachRight(clientActions, clientAction => {
    if (!clientActionMappings[clientAction.type]) return;
    newState = clientActionMappings[clientAction.type](
      newState,
      clientAction.options
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

function handleKeyboardIncrement(state) {
  const { keyboardClientIndex, clients } = state;
  if (!clients || !clients.length) return state;
  const offsetClientIndex = keyboardClientIndex + 1;
  const newClientIndex = offsetClientIndex % clients.length;
  return extend({}, state, { keyboardClientIndex: newClientIndex });
}

export default combineReducers({
  player: (
    state = extend(
      {
        clientActions: undefined,
        clientId: undefined,
        hasTouchStart: 'ontouchstart' in window,
        initialTouchProvided: false,
        colorIncrement: 0,
        text: undefined,
      },
      initialAudiovisualState
    ),
    action
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
    state = {
      clients: undefined,
      clientSwitchSolo: true,
      selectedClientIndex: 0,
      keyboardClientIndex: 0,
    },
    action
  ) => {
    switch (action.type) {
      case RECEIVE_CLIENTS:
        return handleReceiveClients(state, action);
      case SET_SELECTED_CLIENT:
        return extend({}, state, {
          selectedClientIndex: action.selectedClientIndex,
        });
      case SET_CLIENT_SWITCH_SOLO:
        return extend({}, state, {
          clientSwitchSolo: action.soloValue,
        });
      case SET_NEXT_KEYBOARD_CLIENT:
        return handleKeyboardIncrement(state);
      default:
        return state;
    }
  },
});
