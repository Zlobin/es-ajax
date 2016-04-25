import internal from './utils/internal';
import XhrAbstract from './xhr-abstract';
import { rejectInterface, resolveInterface } from './utils/resolve-reject-interface';
import { methods } from './utils/methods';
import asObject from './utils/as-object';

// XHR2 specification.
// @link https://xhr.spec.whatwg.org/

// XHR2 examples.
// @link http://www.html5rocks.com/en/tutorials/file/xhr2/

export default class XhrAPI extends XhrAbstract {
  constructor(url, request = {}, headers = {}) {
    super();

    const self = internal(this);

    self._shouldOverride = true;
    self._onBeforeSend = null;
    self._timeout = null;
    self._defaultHeaders = {
      'Content-Type': 'text/plain'
    };
    self._defaultRequest = {
      method: methods.get,
      async: true,
      body: null,
      timeout: 0
    };
    self._url = url;

    if (XMLHttpRequest) {
      self._xhr = new XMLHttpRequest();
    } else {
      throw new Error('XMLHttpRequest is not supported.');
    }

    this
      .setHeaders(headers)
      .setRequest(request);

    return this;
  }

  setOverride(method = [], callback = () => {}) {
    const shouldOverride = isTrue =>
      (internal(this)._shouldOverride = isTrue && callback(isTrue));

    this._checkOverride(method)
      .then(shouldOverride(false))
      .catch(shouldOverride(true));

    return this;
  }

  onBeforeSend(callback) {
    if (typeof callback !== 'function') {
      throw new TypeError(`${callback} must be a function.`);
    }

    internal(this)._onBeforeSend = callback;

    return this;
  }

  send() {
    const self = internal(this);
    const xhr = self._xhr;
    const { method, async, body } = self._requests;
    let url = self._url;

    // Split object into URL like ?foo=bar&bar=baz
    if (method === methods.get && body && typeof body === 'object') {
      url += `?${this._prepareUrlParams(body)}`;
    }

    return new Promise((resolve, reject) => {
      function rejected(status, response, headers) {
        reject(rejectInterface(status, response, headers));
      }

      function resolved(status, response, headers) {
        resolve(resolveInterface(status, response, headers));
      }

      try {
        xhr.open(method, url, async);

        xhr.onload = xhr.onerror = function onload() {
          // 0 - undefined
          // 1 - status is between 200 and 399
          // 2 - status is over
          const statusCheck = 0 | this.status / 200;
          const { status, response } = this;
          const responseHeaders = asObject(this.getAllResponseHeaders());

          if (statusCheck === 1) {
            resolved(status, response, responseHeaders);
          } else {
            rejected(status, response, responseHeaders);
          }
        };

        xhr.onabort = function onabort() {
          rejected(null, 'Aborted',
            asObject(this.getAllResponseHeaders()));
        };

        xhr.ontimeout = function ontimeout() {
          rejected(null, 'Timeout passed before request was completed.',
            asObject(this.getAllResponseHeaders()));
        };

        xhr.addEventListener('progress', (e) => {
          let progressValue = null;

          if (e.lengthComputable) {
            // Get progress in percentage.
            progressValue = e.loaded / e.total * 100;
          }

          // @todo
          // this.onProgress.call(null, progressValue);

          return progressValue;
        }, false);

        // Send headers.
        Object
          .keys(self._headers)
          .map(index =>
            xhr.setRequestHeader(index, self._headers[index])
          );

        if (typeof self._onBeforeSend === 'function') {
          self._onBeforeSend({
            headers: self._headers,
            request: self._requests,
            time: Date.now()
          });
        }

        xhr.send(body);
      } catch (error) {
        rejected(null, error, asObject(xhr.getAllResponseHeaders()));
      }
    });
  }

  cancel() {
    const xhr = internal(this)._xhr;

    if (xhr) {
      xhr.removeEventListener('progress');
      xhr.abort();
    }

    return this;
  }

  onProgress(callback) {
    if (typeof callback !== 'function') {
      throw new TypeError(`${callback} must be a function.`);
    }

    // @todo
    return this;
  }

  hasHeader(header) {
    return !!internal(this)._xhr.getResponseHeader(header);
  }

  setHeaders(headers = {}) {
    const self = internal(this);

    if (typeof headers !== 'object') {
      throw new TypeError(`${headers} must be an object.`);
    }

    self._headers = Object.assign({},
      self._defaultHeaders,
      self._headers,
      headers
    );

    return this;
  }

  setRequest(request = {}) {
    const self = internal(this);

    if (typeof request !== 'object') {
      throw new TypeError(`${request} must be an object.`);
    }

    self._requests = Object.assign({},
      self._defaultRequest,
      self._requests,
      request
    );

    return this;
  }
}
