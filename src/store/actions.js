import uuidv4 from 'uuid/v4';
import forEach from 'lodash/forEach';
import request from '../request/apiRequest';
import store from './store';

const SEND_ACTION = 'SEND_ACTION';
const sendAction = (clientId, type, options) => () =>
  request('/api/actions', {
    method: 'post',
    body: {
      clientId,
      type,
      options,
    },
  }).then(
    response => console.log('sent action', response),
    (error) => {
      console.log('some kinda post error', error);
    },
  );

function getClientId() {
  return (dispatch) => {
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

function pollActions() {
  return (dispatch) => {
    request(`/api/actions/${store.getState().player.clientId}`).then((actions) => {
      if (!actions || !actions.length) return undefined;
      return dispatch(receiveActions(actions));
    });
    setTimeout(() => pollActions()(dispatch), 1000);
  };
}

const RECEIVE_ON = 'RECEIVE_ON';
function receiveOn() {
  return {
    type: RECEIVE_ON,
  };
}

const RECEIVE_OFF = 'RECEIVE_OFF';
function receiveOff() {
  return {
    type: RECEIVE_OFF,
  };
}

const actionMappings = {
  on: () => store.dispatch(receiveOn()),
  off: () => store.dispatch(receiveOff()),
};

const RECEIVE_ACTIONS = 'RECEIVE_ACTIONS';
function receiveActions(actions) {
  forEach(actions, (action) => {
    if (actionMappings[action.type]) {
      actionMappings[action.type](action);
    }
  });

  return {
    type: RECEIVE_ACTIONS,
    actions,
  };
}

const pollClients = () => (dispatch) => {
  request('/api/clients').then((clients) => {
    if (!clients || !clients.length) return undefined;
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

export {
  SEND_ACTION,
  sendAction,
  getClientId,
  RECEIVE_CLIENT_ID,
  receiveClientId,
  pollActions,
  RECEIVE_ON,
  receiveOn,
  RECEIVE_OFF,
  receiveOff,
  RECEIVE_ACTIONS,
  receiveActions,
  pollClients,
  RECEIVE_CLIENTS,
  receiveClients,
};
