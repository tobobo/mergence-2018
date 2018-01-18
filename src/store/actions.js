import uuidv4 from 'uuid/v4';
import request from '../request/apiRequest';

const sendClientAction = (clientId, type, options) => () =>
  request('/api/client_actions', {
    method: 'post',
    body: {
      clientId,
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
};
