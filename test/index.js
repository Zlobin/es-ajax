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
    .catch(() => done('Error occured'));
  respond();
}

describe('1. es-ajax test', () => {
  describe('1.1: Public API', () => {
    const instance = ajax(URL);

    it('1.1.1: should have "get" method', () =>
      expect(instance.get).toBeA('function')
    );

    it('1.1.2: should have "post" method', () =>
      expect(instance.post).toBeA('function')
    );

    it('1.1.3: should have "put" method', () =>
      expect(instance.put).toBeA('function')
    );

    it('1.1.4: should have "del" method', () =>
      expect(instance.del).toBeA('function')
    );

    it('1.1.5: should have "head" method', () =>
      expect(instance.head).toBeA('function')
    );

    it('1.1.6: should have "options" method', () =>
      expect(instance.options).toBeA('function')
    );

    it('1.1.7: should have "file" method', () =>
      expect(instance.file).toBeA('function')
    );

    it('1.1.8: should have "cancel" method', () =>
      expect(instance.cancel).toBeA('function')
    );

    it('1.1.9: should have "onProgress" method', () =>
      expect(instance.onProgress).toBeA('function')
    );

    it('1.1.10: should have "getXhrId" method', () =>
      expect(instance.getXhrId).toBeA('function')
    );

    it('1.1.11: should have "abortAll" method', () =>
      expect(instance.abortAll).toBeA('function')
    );

    it('1.1.12: should have "getXhrMeta" method', () =>
      expect(instance.getXhrMeta).toBeA('function')
    );

    it('1.1.13: should have "getAllRequests" method', () =>
      expect(instance.getAllRequests).toBeA('function')
    );

    it('1.1.14: should have "setOverride" method', () =>
      expect(instance.setOverride).toBeA('function')
    );

    it('1.1.15: should have "setTimeout" method', () =>
      expect(instance.setTimeout).toBeA('function')
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
      'DELETE'
    ].map(method =>
      it(`1.2.${++i}: should send "${method}" request`, done => send(URL, method, done))
    );
  });
});
