import uuidv4 from 'uuid/v4';
import { sortBy, slice } from 'lodash';
import request from '../request/apiRequest';

const sendClientAction = (clientIds, type, options) => () =>
  request('/api/client_actions', {
    method: 'post',
    body: {
      clientIds,
      type,
      options,
    },
  }).then(
    response => console.log('sent player action', response),
    error => {
      console.log('some kinda post error', error);
    }
  );

function getClientId() {
  return dispatch => {
    dispatch(receiveClientId(uuidv4()));
  };
}

const RECEIVE_CLIENT_ID = 'RECEIVE_CLIENT_ID';
function receiveClientId(clientId) {
  return {
    type: RECEIVE_CLIENT_ID,
    clientId,
  };
}

function pollClientActions(clientId) {
  return dispatch => {
    request(`/api/client_actions/${clientId}`).then(clientActions => {
      if (!clientActions || !clientActions.length) return undefined;
      return dispatch(receiveClientActions(clientActions));
    });
    setTimeout(() => pollClientActions(clientId)(dispatch), 1000);
  };
}

const RECEIVE_CLIENT_ACTIONS = 'RECEIVE_CLIENT_ACTIONS';
function receiveClientActions(clientActions) {
  return {
    type: RECEIVE_CLIENT_ACTIONS,
    clientActions,
  };
}

const pollClients = () => dispatch => {
  request('/api/clients').then(clients => {
    if (!clients) return undefined;
    return dispatch(receiveClients(clients));
  });
  setTimeout(() => pollClients()(dispatch), 1000);
};

const RECEIVE_CLIENTS = 'RECEIVE_CLIENTS';
function receiveClients(clients) {
  return {
    type: RECEIVE_CLIENTS,
    clients,
  };
}

const SET_SELECTED_CLIENT = 'SET_SELECTED_CLIENT';
function setSelectedClient(selectedClientIndex) {
  return {
    type: SET_SELECTED_CLIENT,
    selectedClientIndex,
  };
}

const SEND_CLIENT_SWITCH = 'SEND_CLIENT_SWITCH';
const sendClientSwitch = newClientIndex => (dispatch, getState) => {
  const {
    controller: {
      clients,
      selectedClientIndex: oldClientIndex,
      clientSwitchSolo: solo,
    },
  } = getState();
  if (!clients.length) return;
  const adjustedNewClientIndex =
    newClientIndex >= 0
      ? newClientIndex % clients.length
      : clients.length + newClientIndex;
  dispatch(setSelectedClient(adjustedNewClientIndex));
  dispatch(sendClientAction([clients[adjustedNewClientIndex]], 'on'));
  if (solo && oldClientIndex !== adjustedNewClientIndex)
    dispatch(sendClientAction([clients[oldClientIndex]], 'off'));
};

const SET_CLIENT_SWITCH_SOLO = 'SET_CLIENT_SWITCH_SOLO';
function setClientSwitchSolo(soloValue) {
  return {
    type: SET_CLIENT_SWITCH_SOLO,
    soloValue,
  };
}

const TOGGLE_RANDOM_GROUP = 'TOGGLE_RANDOM_GROUP';
const toggleRandomGroup = onOrOff => (dispatch, getState) => {
  const { controller: { clients } } = getState();
  const baseSliceSize = clients.length / 2;
  const fuzzedSliceSize = baseSliceSize * Math.random() + 0.5;
  const safeSliceSize = Math.max(
    Math.min(clients.length, Math.floor(fuzzedSliceSize)),
    1
  );
  const shuffledClients = sortBy(clients, () => Math.random());
  const randomClientSlice = slice(shuffledClients, 0, safeSliceSize);
  dispatch(sendClientAction(randomClientSlice, onOrOff));
};

const SEND_KEYBOARD_NOTE = 'SEND_KEYBOARD_NOTE';
const sendKeyboardNote = frequency => (dispatch, getState) => {
  dispatch(setNextKeyboardClient());
  const { controller: { clients, keyboardClientIndex } } = getState();
  dispatch(
    sendClientAction([clients[keyboardClientIndex]], 'frequency', { frequency })
  );
};

const SET_NEXT_KEYBOARD_CLIENT = 'SET_NEXT_KEYBOARD_CLIENT';
function setNextKeyboardClient() {
  return {
    type: SET_NEXT_KEYBOARD_CLIENT,
  };
}

const CHANGE_KEYBOARD_MODE = 'CHANGE_KEYBOARD_MODE';
function changeKeyboardMode(mode) {
  return {
    type: CHANGE_KEYBOARD_MODE,
    mode,
  };
}

const HANDLE_INITIAL_TOUCH = 'HANDLE_INITIAL_TOUCH';
function handleInitialTouch() {
  return {
    type: HANDLE_INITIAL_TOUCH,
  };
}

const SET_HAS_TOUCH_START = 'SET_HAS_TOUCH_START';
function setHasTouchStart(hasTouchStart) {
  return {
    type: SET_HAS_TOUCH_START,
    hasTouchStart,
  };
}

export {
  sendClientAction,
  getClientId,
  RECEIVE_CLIENT_ID,
  receiveClientId,
  pollClientActions,
  RECEIVE_CLIENT_ACTIONS,
  receiveClientActions,
  pollClients,
  RECEIVE_CLIENTS,
  receiveClients,
  SET_SELECTED_CLIENT,
  setSelectedClient,
  SEND_CLIENT_SWITCH,
  sendClientSwitch,
  TOGGLE_RANDOM_GROUP,
  toggleRandomGroup,
  SET_CLIENT_SWITCH_SOLO,
  setClientSwitchSolo,
  SEND_KEYBOARD_NOTE,
  sendKeyboardNote,
  CHANGE_KEYBOARD_MODE,
  changeKeyboardMode,
  SET_NEXT_KEYBOARD_CLIENT,
  setNextKeyboardClient,
  HANDLE_INITIAL_TOUCH,
  handleInitialTouch,
  SET_HAS_TOUCH_START,
  setHasTouchStart,
};
