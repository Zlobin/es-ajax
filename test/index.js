import expect from 'expect';

const URL = '/';
const defaultMethod = 'GET';
const fakeServer = sinon.fakeServerWithClock.create();
const clock = sinon.useFakeTimers();

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
  console.log('fakeServer', fakeServer.requests[fakeServer.requests.length - 1].requestHeaders);
  fakeServer.restore();
}

function send(url, method, done, parameters = {}) {
  prepareRespond(url, method);
  method = method === 'DELETE' ? 'del' : method.toLowerCase();
  ajax(url)[method](parameters)
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
    const parameters = {
      headers: {
        foo: 'bar',
        bar: 'baz'
      }
    };

    it(`1.3.1: should set headers`, done =>
      send(URL, defaultMethod, done, parameters));
  });

  describe('1.4: Cancel request', () => {
    // ...
  });

  describe('1.5: On progress', () => {
    // ...
  });

  describe('1.6: Set timeout', () => {
    /*
    it('1.4.1: timeout should be reached after 2000 ms', done => {
      const responseTimeout = 3000; // ms
      const requestTimeout = 2000; // s
      const method = 'GET';

      prepareRespond(URL, method);
      ajax().setTimeout(requestTimeout);

      ajax(URL)[method.toLowerCase()]()
        .then((response) => {
          console.log('response', response);
          done('Fail. Timeout should be reached');
        })
        .catch(response => {
          if (response.response === 'Timeout passed before request was completed.') {
            done();
          } else {
            done('Fail. Timeout should be reached');
          }
        });

      clock.tick(responseTimeout)  && respond();
    }); */
  });

  describe('1.7: Abort all requests', () => {
    // ...
  });

  describe('1.8: Get request ID', () => {
    it('1.8.1: should return request ID', () =>
      expect(ajax(URL).getXhrId().toString()).toMatch(/Symbol.*/)
    );
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
