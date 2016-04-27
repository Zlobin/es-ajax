import guid from './utils/guid';
import factory from './utils/factory';
import objectHash from 'object-hash';

const _requests = new Set();
const _meta = new Map();
let _timeout = 0;

export function ajax(url, parameters = {}, requestId) {
  const defaults = {
    isSingleton: false,
    api: 'xhr', // xhr || fetch
    headers: {},
    request: {}
  };
  const settings = Object.assign({}, defaults, parameters);
  const xhrId = requestId || guid();
  const self = this;
  let xhrApi;

  if (requestId !== void 0 && !_requests.has(xhrId)) {
    throw new Error('Request with ID did not found.');
  }

  if (url) {
    xhrApi = factory(settings.api, url, settings.request, settings.headers);
    xhrApi.onBeforeSend(params => {
      const { headers, request, time } = params;
      const hash = objectHash({
        url,
        method: request.method || '',
        body: request.body || ''
      });

      _requests.add(xhrId);
      _meta.set(xhrId, {
        url,
        isSingleton: settings.isSingleton,
        xhrApi,
        hash,
        request,
        headers,
        startTime: time
      });

      xhrApi.setTimeout(_timeout);
    });
  }

  function proxy(name) {
    if (xhrApi === void 0) {
      throw new Error('URL must have.');
    }

    switch (name) {
      case 'head':
        return () => xhrApi.head();
      case 'options':
        return () => xhrApi.options();
      case 'get':
        return data => xhrApi.get(data);
      case 'post':
        return data => xhrApi.post(data);
      case 'put':
        return data => xhrApi.put(data);
      case 'del':
        return data => xhrApi.delete(data);
      case 'file':
        return data => xhrApi.file(data);
      case 'setOverride':
        return (method = [], callback) => xhrApi.setOverride(method, callback);
      case 'cancel':
        return () => {
          xhrApi.cancel();
          return self;
        };
      case 'onProgress':
        return callback => {
          xhrApi.onProgress(callback);
          return self;
        };
      default:
        throw new Error(`No method "${name}".`);
    }
  }

  function getXhrId() {
    return xhrId;
  }

  function getXhrMeta() {
    return _meta.get(xhrId);
  }

  function getAllRequests() {
    const response = {};

    _requests.forEach(value => {
      if (value !== void 0) {
        response[value] = _meta.get(value);
      }
    });

    return response;
  }

  function abortAll() {
    _meta.forEach(request =>
      request.xhrApi && request.xhrApi.cancel()
    );

    return self;
  }

  function setTimeout(time) {
    _timeout = time;

    return self;
  }

  return {
    // Static, may user without any XHR.
    abortAll,
    getXhrId,
    getXhrMeta,
    getAllRequests,
    setTimeout,
    // Non-static, should be used with a XHR (fetch) instance.
    setOverride: proxy('setOverride'),
    options: proxy('options'),
    head: proxy('head'),
    get: proxy('get'),
    post: proxy('post'),
    put: proxy('put'),
    del: proxy('del'),
    file: proxy('del'),
    cancel: proxy('cancel'),
    onProgress: proxy('onProgress')
  };
}
