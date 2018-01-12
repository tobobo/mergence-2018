import forEach from 'lodash/forEach';
import request from '../request/apiRequest';
import store from './store';

const SEND_ACTION = 'SEND_ACTION';
const sendAction = (name, options) => dispatch => {
  return request('/api/actions', {
    method: 'post',
    body: {
      client: 123,
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

const pollActions = () => dispatch => {
  request('/api/actions/123').then(actions => {
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

export {
  SEND_ACTION,
  sendAction,
  pollActions,
  RECEIVE_ACTIONS,
  receiveActions
};
