import 'whatwg-fetch';
import merge from 'lodash/merge';

const API_BASE = 'http://localhost:3001';

function handleJsonResponse(response) {
  try {
    return response.json();
  } catch (err) {
    console.log('parse error', err);
    throw err;
  }
}

export default function(path, options, ...rest) {
  const body = options ? JSON.stringify(options.body) : undefined;
  const reqOptions = merge({}, options, {
    body,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return fetch(`${API_BASE}${path}`, reqOptions, ...rest).then(
    handleJsonResponse
  );
}
