import objectHash from 'object-hash';
import Middleware from 'es-middleware';

import guid from './utils/guid';
import factory from './utils/factory';
import contentTypes from './utils/content-types';
import is from './utils/is';

const _requests = new Set();
const _meta = new Map();
const mw = new Middleware();
let _timeout = 0;

export default function ajax(url, parameters = {}) {
  const defaults = {
    isSingleton: false,
    api: 'xhr', // xhr || fetch
    type: 'json', // text || json || html
    headers: {},
    request: {}
  };
  const settings = Object.assign({}, defaults, parameters);
  const xhrId = parameters.id || guid();
  let xhrApi;
  let meta;

  if (!is._undefined(parameters.type) && contentTypes[parameters.type]) {
    settings.headers['Content-Type'] = contentTypes[parameters.type];
  }

  if (parameters.id !== void 0) {
    // Check if xhrApi with xhrId is exists.
    if (!_requests.has(xhrId)) {
      throw new Error('Request with ID did not found.');
    } else {
      // Get API instance from the meta.
      meta = _meta.get(xhrId);
      xhrApi = meta.xhrAPI;
      url = meta.url;
    }
  }

  if (!xhrApi && url) {
    // Create new instance.
    xhrApi = factory(settings.api, url, settings.request, settings.headers);
    xhrApi.setMiddleware(mw);
    xhrApi.onBeforeSend(params => {
      const { headers, request, time } = params;
      const hash = objectHash({
        url,
        method: request.method || ''
        // @todo broken for file sending.
        // body: request.body || ''
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
    const self = this;

    if (is._undefined(xhrApi)) {
      return () => {};
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
        throw new Error(`No method with name "${name}".`);
    }
  }

  function getXhrId() {
    return xhrId;
  }

  function getXhrMeta() {
    return _meta.get(xhrId);
  }

  function getAllRequests() {
    const response = [];

    _requests.forEach(value => {
      if (!is._undefined(value)) {
        response.push(Object.assign({},
        _meta.get(value), {
          id: value.toString()
        }));
      }
    });

    return response;
  }

  function abortAll() {
    _meta.forEach(request =>
      request.xhrApi && request.xhrApi.cancel()
    );

    return this;
  }

  function setTimeout(time) {
    _timeout = time;

    return this;
  }

  function use(functions) {
    mw.use(functions);

    return this;
  }

  return {
    // Static, may be used without any XHR instance.
    abortAll,
    getXhrId,
    getXhrMeta,
    getAllRequests,
    setTimeout,
    use,
    // Non-static, should be used with a XHR (fetch) instance.
    setOverride: proxy('setOverride'),
    options: proxy('options'),
    head: proxy('head'),
    get: proxy('get'),
    post: proxy('post'),
    put: proxy('put'),
    del: proxy('del'),
    file: proxy('file'),
    cancel: proxy('cancel'),
    onProgress: proxy('onProgress')
  };
}
