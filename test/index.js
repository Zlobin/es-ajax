import expect from 'expect';

const URL = '/';
const fakeServer = sinon.fakeServer.create();

function prepareRespond(url, method = 'GET') {
  const response = {
    'response': 'ok'
  };
  const headers = {
    'Content-Type': 'application/json'
  };

  fakeServer.respondWith(
    method,
    url, [
      200,
      headers,
      JSON.stringify(response)
    ]
  );
}

function respond() {
  fakeServer.respond();
  fakeServer.restore();
}

function send(url, method, done) {
  prepareRespond(url, method);
  method = method === 'DELETE' ? 'del' : method.toLowerCase();
  ajax(url)[method]()
    .then(() => done())
    .catch(() => done('An error occured'));
  respond();
}

describe('1. es-ajax test', () => {
  describe('1.1: Public API', () => {
    let i = 0;

    [
      'get',
      'post',
      'put',
      'del',
      'head',
      'options',
      'file',
      'cancel',
      'onProgress',
      'getXhrId',
      'abortAll',
      'getXhrMeta',
      'getAllRequests',
      'setOverride',
      'setTimeout',
      'applyMiddleware'
    ].forEach(method =>
      it(`1.1.${++i}: should have "${method}" method`, () =>
        expect(ajax(URL)[method]).toBeA('function'))
    );
  });

  describe('1.2: HTTP requests', () => {
    let i = 0;

    [
      'GET',
      'POST',
      'PUT',
      'HEAD',
      'OPTIONS',
      'DELETE',
      'FILE'
    ].forEach(method =>
      it(`1.2.${++i}: should send "${method}" request`, done =>
        send(URL, method, done))
    );
  });

  describe('1.3: Set headers', () => {
    // ...
  });

  describe('1.4: Cancel request', () => {
    // ...
  });

  describe('1.5: On progress', () => {
    // ...
  });

  describe('1.6: Set timeout', () => {
    // ...
  });

  describe('1.7: Abort all requests', () => {
    // ...
  });

  describe('1.8: Get request ID', () => {
    // ...
  });

  describe('1.9: Get request meta information', () => {
    // ...
  });

  describe('1.10: Get all requests', () => {
    // ...
  });

  describe('1.11: Apply middleware', () => {
    // ...
  });
});
