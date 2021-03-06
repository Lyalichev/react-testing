import { store } from 'store';
import { setError } from 'store/status';

const BASE_URL = 'http://localhost:8086/';

const request = (url, options = {}, data) => {
  const isUserChecking = url.includes('checkUser');

  const settings = {
    credentials: 'include',
    ...options,
  };

  if (data) {
    settings.body = JSON.stringify(data);
    settings.headers = {
      'Content-type': 'application/json; charset=utf-8'
    };
  }

  const req = fetch(`${BASE_URL}${url}`, settings)
    .then(res => res.json())
    .then((data) => {
      if (data.error) {
        throw data.error;
      }

      return data;
    });

  req.catch(error => !isUserChecking && store.dispatch(setError(String(error))));

  return req;
};

const rest = {
  get(url) {
    return request(url);
  },

  post(url, data) {
    return request(url, {method: 'POST'}, data);
  },

  put(url, data) {
    return request(url, {method: 'PUT'}, data);
  }
};

export {rest, request};
