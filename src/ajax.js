'use strict';

import guid from './utils/guid';
import factory from './utils/factory';
import objectHash from 'object-hash';

const _requests = new Set();
const _meta = new Map();

export function ajax(url, parameters = {}, requestId) {
  const defaults = {
    isSingleton: false,
    api: 'xhr', // xhr || fetch
    headers: {},
    request: {}
  };
  const settings = Object.assign({}, defaults, parameters);
  const xhrId = requestId || guid();
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
    });
  }

  function decorator(name) {
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
      default:
        throw new Error(`No method "${name}".`);
    }
  }

  function setTimeout(time) {
    xhrApi.setTimeout(time);
    return this;
  }

  function cancel() {
    xhrApi.cancel();
    return this;
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

    return this;
  }

  function onProgress() {
    // @todo
  }

  return {
    // Static, may user without any XHR.
    abortAll,
    getXhrId,
    getXhrMeta,
    getAllRequests,
    setOverride: decorator('setOverride'),
    setTimeout,
    // Non-static, should be used with a XHR (fetch) instance.
    options: decorator('options'),
    head: decorator('head'),
    get: decorator('get'),
    post: decorator('post'),
    put: decorator('put'),
    del: decorator('del'),
    file: decorator('del'),
    cancel,
    onProgress
  };
}
