import forEach from 'lodash/forEach';
import request from '../request/apiRequest';
import store from './store';
import uuidv4 from 'uuid/v4';

const SEND_ACTION = 'SEND_ACTION';
const sendAction = (clientId, name, options) => dispatch => {
  return request('/api/actions', {
    method: 'post',
    body: {
      clientId,
      name,
      options
    }
  }).then(
    response => console.log('sent action', response),
    error => {
      console.log('some kinda post error', error);
    }
  );
};

const getClientId = () => dispatch => {
  dispatch(receiveClientId(uuidv4()));
};

const RECEIVE_CLIENT_ID = 'RECEIVE_CLIENT_ID';
const receiveClientId = clientId => ({
  type: RECEIVE_CLIENT_ID,
  clientId
});

const pollActions = () => dispatch => {
  request(`/api/actions/${store.getState().player.clientId}`).then(actions => {
    if (!actions || !actions.length) return;
    return dispatch(receiveActions(actions));
  });
  setTimeout(() => pollActions()(dispatch), 1000);
};

const RECEIVE_ACTIONS = 'RECEIVE_ACTIONS';
const receiveActions = actions => ({
  type: RECEIVE_ACTIONS,
  actions
});

const pollClients = () => dispatch => {
  request('/api/clients').then(clients => {
    if (!clients || !clients.length) return;
    return dispatch(receiveClients(clients));
  });
  setTimeout(() => pollClients()(dispatch), 1000);
};

const RECEIVE_CLIENTS = 'RECEIVE_CLIENTS';
const receiveClients = clients => ({
  type: RECEIVE_CLIENTS,
  clients
});

export {
  SEND_ACTION,
  sendAction,
  getClientId,
  RECEIVE_CLIENT_ID,
  receiveClientId,
  pollActions,
  RECEIVE_ACTIONS,
  receiveActions,
  pollClients,
  RECEIVE_CLIENTS,
  receiveClients
};
