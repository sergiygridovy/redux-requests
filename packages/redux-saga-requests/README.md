# redux-saga-requests

[![npm version](https://badge.fury.io/js/redux-saga-requests.svg)](https://badge.fury.io/js/redux-saga-requests)
[![Build Status](https://travis-ci.org/klis87/redux-saga-requests.svg?branch=master)](https://travis-ci.org/klis87/redux-saga-requests)
[![Coverage Status](https://coveralls.io/repos/github/klis87/redux-saga-requests/badge.svg?branch=master)](https://coveralls.io/github/klis87/redux-saga-requests?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/klis87/redux-saga-requests/badge.svg)](https://snyk.io/test/github/klis87/redux-saga-requests)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

Redux-Saga addon to simplify handling of AJAX requests. It supports Axios and Fetch API, but different
integrations could be added, as they are implemented in a plugin fashion.

## Motivation

With `redux-saga-requests`, assuming you use `axios` you could refactor a code in the following way:
```diff
  import axios from 'axios';
- import { takeEvery, put, call } from 'redux-saga/effects';
+ import { createRequestInstance, watchRequests, success, error } from 'redux-saga-requests';
+ import axiosDriver from 'redux-saga-requests-axios';

  const FETCH_BOOKS = 'FETCH_BOOKS';
- const FETCH_BOOKS_SUCCESS = 'FETCH_BOOKS_SUCCESS';
- const FETCH_BOOKS_ERROR = 'FETCH_BOOKS_ERROR';

- const fetchBooks = () => ({ type: FETCH_BOOKS });
- const fetchBooksSuccess = data => ({ type: FETCH_BOOKS_SUCCESS, payload: { data } });
- const fetchBooksError = error => ({ type: FETCH_BOOKS_ERROR, payload: { error } });
+ const fetchBooks = () => ({
+   type: FETCH_BOOKS,
+   request: {
+     url: '/books',
+     // you can put here other Axios config attributes, like method, data, headers etc.
+   },
+ });

  const defaultState = {
    data: null,
    fetching: false,
    error: false,
  };

  const booksReducer = (state = defaultState, action) => {
    switch (action.type) {
      case FETCH_BOOKS:
        return { ...defaultState, fetching: true };
-     case FETCH_BOOKS_SUCCESS:
+     case success(FETCH_BOOKS):
        return {
          ...defaultState,
          data: { ...action.payload.data },
        };
-     case FETCH_BOOKS_ERROR:
+     case error(FETCH_BOOKS):
        return { ...defaultState, error: true };
      default:
        return state;
    }
  };

- const fetchBooksApi = () => axios.get('/books');
-
- function* fetchBooksSaga() {
-   try {
-     const response = yield call(fetchBooksApi);
-     yield put(fetchBooksSuccess(response.data));
-   } catch (e) {
-     yield put(fetchBooksError(e));
-   }
- }
-
  function* rootSaga() {
-   yield takeEvery(FETCH_BOOKS, fetchBooksSaga);
+   yield createRequestInstance(axios, { driver: axiosDriver });
+   yield watchRequests();
  }
```
With `redux-saga-requests`, you no longer need to define error and success actions to do things like error handling
or showing loading spinners. You don't need to write repetitive sagas to create requests either.

Here you can see the list of features this library provides:
- you define your AJAX requests as simple actions, like `{ type: FETCH_BOOKS, request: { url: '/books' } }` and `success`,
`error` (`abort` is also supported, see below) actions will be dispatched automatically for you
- `success`, `error` and `abort` functions, which add correct and consistent suffixes to your request action types
- automatic request abort - when a saga is cancelled, a request made by it is automatically aborted and an abort action
is dispatched (especially handy with `takeLatest` and `race` Redux-Saga effects)
- sending multiple requests in one action - `{ type: FETCH_BOOKS_AND_AUTHORS, request: [{ url: '/books' }, { url: '/authors}'] }`
will send two requests and wrap them in `Promise.all`
- flexibility - you can use "auto mode" `watchRequests`
(see [basic example](https://github.com/klis87/redux-saga-requests/tree/master/examples/basic)),
or much more flexible `sendRequest`
(see [advanced example](https://github.com/klis87/redux-saga-requests/tree/master/examples/advanced)),
or... you could even access your request instance with `getRequestInstance`
- support for Axios and Fetch API - additional clients could be added, you could even write your own client
integration as a `driver` - see [./packages/redux-saga-requests-axios/src/axios-driver.js](https://github.com/klis87/redux-saga-requests/blob/monorepo/packages/redux-saga-requests-axios/src/axios-driver.js)
for the example
- compatible with `redux-act` and `redux-actions` libraries - see [redux-act example](https://github.com/klis87/redux-saga-requests/tree/master/examples/redux-act-integration)
- simple to use with server side rendering - for example you could pass Axios instance to `createRequestInstance` and
you don't need to worry that Axios interceptors would be shared across multiple requests
- `onRequest`, `onSuccess`, `onError` and `onAbort` interceptors, you can attach your sagas (or simple functions)
to them to define a global behaviour for a given event type

## Installation

To install the package, just run:
```
$ yarn add redux-saga-requests
```
or...
```
$ npm install redux-saga-requests
```
or you can just use CDN: `https://unpkg.com/redux-saga-requests`.

Also, you need to install a driver:
- if you use Axios, install `axios` and `redux-saga-requests-axios`:
  ```
  $ yarn add axios redux-saga-requests-axios
  ```
  or...
  ```
  $ npm install axios redux-saga-requests-axios
  ```
  or CDN: `https://unpkg.com/redux-saga-requests-axios`.
- if you use Fetch API, install `isomorphic-fetch` (or a different Fetch polyfill) and `redux-saga-requests-fetch`:
  ```
  $ yarn add isomorphic-fetch redux-saga-requests-fetch
  ```
  or...
  ```
  $ npm install isomorphic-fetch redux-saga-requests-fetch
  ```
  or CDN: `https://unpkg.com/redux-saga-requests-fetch`.

Of course, because this is Redux-Saga addon, you also need to install Redux-Saga.

## Usage

For a basic usage, see `Motivation` paragraph. If you don't care about request cancellation, this will be probably all
you need in your applications. You could also use interceptors, if you need to do something extra for every request,
successful response or error.

But, if you would like to take advantage of a possibility to cancel requests, instead of `watchRequests`, you will
need to use `sendRequest`:
```javascript
import axios from 'axios';
import { takeLatest } from 'redux-saga/effects';
import { createRequestInstance, sendRequest } from 'redux-saga-requests';
import axiosDriver from 'redux-saga-requests-axios'; // or a different driver

const FETCH_BOOKS = 'FETCH_BOOKS';

const fetchBooks = () => ({
  type: FETCH_BOOKS,
  request: { url: '/books' },
});

function* rootSaga() {
  yield createRequestInstance(axios, { driver: axiosDriver });
  yield takeLatest(FETCH_POST, sendRequest);
}
```
Now, if `/books` request is pending and another `fetchPost` action is triggered, the previous request will be aborted
and `FETCH_BOOKS_ABORT` will be dispatched. Of course, request cannot be really aborted for Fetch API according to their
specifications, at least [not yet](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort),
but you won't notice it in your application (apart from unnecessary request overhead) - `FETCH_BOOKS_ABORT` actions
will still be fired.

You could also use `race` effect:
```javascript
import axios from 'axios';
import { call, race, take, takeLatest } from 'redux-saga/effects';
import { createRequestInstance, sendRequest } from 'redux-saga-requests';
import axiosDriver from 'redux-saga-requests-axios'; // or a different driver

const FETCH_BOOKS = 'FETCH_BOOKS';
const CANCEL_REQUEST = 'CANCEL_REQUEST';

const fetchBooks = () => ({
  type: FETCH_BOOKS,
  request: { url: '/books' },
});

const cancelRequest = () => ({ type: CANCEL_REQUEST });

function* fetchBookSaga(fetchBookAction) {
  yield race([
    call(sendRequest, fetchBookAction),
    take(CANCEL_REQUEST),
  ]);
}

function* rootSaga() {
  yield createRequestInstance(axios, { driver: axiosDriver });
  yield takeLatest(FETCH_BOOKS, fetchBookSaga);
}
```
In above case, not only the last `/books` request could be successful, but also it could be aborted with `cancelRequest`
action, as `sendRequest` would be aborted as it would lose with `take(CANCEL_REQUEST)` effect.

Of course, you can send requests directly from your sagas:
```javascript
function* fetchBookSaga() {
  const { response, error } = yield call(sendRequest, fetchBooks(), true);

  if (response) {
    // do sth with response
  } else {
    // do sth with error
  }
}
```
The key here is, that you need to pass `true` as second argument to `sendRequest`, so that `fetchBooks` action will be
dispatched - usually it is already dispatched somewhere else (from your React components `onClick` for instance),
but here not, so we must explicitely tell `sendRequest` to dispatch it.

Also, it is possible to get access to your request instance (like Axios) in your Saga:
```javascript
import { getRequestInstance } from 'redux-saga-requests';

function* fetchBookSaga() {
  const requestInstance = yield getRequestInstance();
  /* now you can do whatever you want, for example, if u use axios:
  const response = yield call(requestInstance.get, '/some-url') */
}
```
You can do whatever you want with it, which gives you maximum flexibility. You could even add Axios interceptors here,
but it is preferable to use interceptors from this library.

## Interceptors

You can add global handlers to `onRequest`, `onSuccess`, `onError` add `onAbort`, like so:
```javascript
function* onRequestSaga(request) {
  ...
}

function* onResponseSaga(response) {
  ...
}

function* onErrorSaga(error) {
  ...
}

function* onAbortSaga() {
  ...
}

function* rootSaga() {
  yield createRequestInstance(axios, {
    driver: axiosDriver,
    onRequest: onRequestSaga,
    onSuccess: onResponseSaga,
    onError: onErrorSaga,
    onAbort: onAbortSaga,
  });
  yield watchRequest();
}
```

## Custom action suffixes

As a default, `success`, `error` and `abort` functions generate `_SUCCESS`, `_ERROR` and `_ABORT` suffixes respectively.
However, it is possible to change them in a following way:
```javascript
import axios from 'axios';
import { getActionWithSuffix, watchRequests, createRequestInstance } from 'redux-saga-requests';
import axiosDriver from 'redux-saga-requests-axios'; // or a different driver

const success = getActionWithSuffix('MY_SUCCESS_SUFFIX');
const error = getActionWithSuffix('MY_ERROR_SUFFIX');
const abort = getActionWithSuffix('MY_ABORT_SUFFIX');

function* rootSaga() {
  yield createRequestInstance(axios, { driver: axiosDriver, success, error, abort });
  yield watchRequests();
}
```
So, basically you need to use `getActionWithSuffix` to create your own `success`, `error` and `abort` functions, which
you need to pass in `createRequestInstance` config. Then, instead of using built-in `success`, `error` and `abort`
functions in your reducers, you will use your own ones.

## Usage with Fetch API

All of the above examples show Axios usage, in order to use Fetch API, use below snippet:
```javascript
import 'isomorphic-fetch'; // or a different fetch polyfill
import { createRequestInstance, watchRequests } from 'redux-saga-requests';
import fetchDriver from 'redux-saga-requests-fetch';

function* rootSaga() {
  yield createRequestInstance(
    window.fetch,
    {
      driver: fetchDriver,
      baseURL: 'https://my-domain.com' // optional - it works like axios baseURL, prepending all relative urls
    },
  );
  yield watchRequests();
}
```
And in order to create Fetch API requests, below:
```javascript
fetch('/users', {
  method: 'POST',
  body: data,
});
```
should be translated to this:
```javascript
const fetchUsers = () => ({
  type: 'FETCH_USERS',
  request: {
    url: '/users/',
    method: 'POST',
    body: data,
  }
});
```
The point is, you can use the same request config like you do with pure Fetch API, but you need to pass `url` in the
config itself. Also, one additional parameter you could provide in the config is `responseType`, which is set as `json`
as the default. Available response types are: `arraybuffer`, `blob`, `formData`, `json`, `text`.

## Examples

I highly recommend to try examples how this package could be used in real applications. You could play with those demos
and see what actions are being sent with [redux-devtools](https://github.com/zalmoxisus/redux-devtools-extension).

There are following examples currently:
- [basic](https://github.com/klis87/redux-saga-requests/tree/master/examples/basic)
- [advanced](https://github.com/klis87/redux-saga-requests/tree/master/examples/advanced)
- [Fetch API](https://github.com/klis87/redux-saga-requests/tree/master/examples/fetch-api)
- [redux-act integration](https://github.com/klis87/redux-saga-requests/tree/master/examples/redux-act-integration)

## Credits

This library was inspired by [redux-axios-middleware](https://github.com/svrcekmichal/redux-axios-middleware)
(I highly recommend this library if someone doesn't use Redux-Saga!)
and [issue](https://github.com/redux-saga/redux-saga/issues/1117) in Redux-Saga, when it was recommended not to combine
another async middleware with sagas.

## Licence

MIT