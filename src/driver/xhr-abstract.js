import methods from './utils/methods';
import internal from './utils/internal';
import methodsOverride from './utils/methods-override';
import is from '../utils/is';

export default class XhrAbstract {
  constructor(/* url, request = {}, headers = {} */) {
    if (is._undefined(this.middleware)) {
      this.middleware = {};
      this.middleware = {
        run: () => {},
        setContext: () => {}
      };
    }

    return this;
  }

  _checkOverride(method = []) {
    if (!is._array(method)) {
      throw new TypeError('"method" variable must be an Array.');
    }

    const optionsRequest = this.options.bind(this);

    return new Promise((resolve, reject) => {
      function shouldOverride(override) {
        return override ? reject() : resolve();
      }

      optionsRequest()
        .then(response => {
          const allowHeader = (response.headers || {}).Allow.split(',') || [];
          let numberAllows = 0;

          allowHeader.forEach(element =>
            (method.indexOf(element) > -1 ? numberAllows++ : 0)
          );

          shouldOverride(numberAllows !== method.length);
        })
        .catch(() => shouldOverride(true));
    });
  }

  _methodOverride(methodName) {
    this.setHeaders(methodsOverride(methodName));
  }

  head() {
    this.setRequest({
      method: methods.head,
      body: null
    });

    return this.send();
  }

  options() {
    this.setRequest({
      method: methods.options,
      body: null
    });

    return this.send();
  }

  get(data = null) {
    this.setRequest({
      method: methods.get,
      body: data
    });

    return this.send();
  }

  file(data = null) {
    // @todo data can be an array of files.
    return this.post(data, true);
  }

  post(data = null, isFile = false) {
    this.setRequest({
      method: methods.post,
      body: data
    });

    return this.send(isFile);
  }

  delete(data = null) {
    const shouldOverride = internal(this)._shouldOverride;

    this.setRequest({
      method: shouldOverride ? methods.post : methods.delete,
      body: data
    });

    if (shouldOverride) {
      this._methodOverride(methods.delete);
    }

    return this.send();
  }

  put(data = null) {
    const shouldOverride = internal(this)._shouldOverride;

    this.setRequest({
      method: shouldOverride ? methods.post : methods.put,
      body: data
    });

    if (shouldOverride) {
      this._methodOverride(methods.put);
    }

    return this.send();
  }

  setMiddleware(middleware) {
    this.middleware = middleware;
  }

  send() {
    //
  }

  cancel() {
    //
  }

  onProgress(/* callback */) {
    //
  }

  getHeaders() {
    //
  }

  hasHeader(/* header */) {
    //
  }

  setHeaders(/* headers */) {
    //
  }

  getRequests() {
    //
  }

  setRequest(/* request */) {
    //
  }

  setTimeout(/* timeout */) {
    //
  }

  onBeforeSend(/* callback */) {
    //
  }

  getUrl() {
    //
  }

  setUrl(/* url */) {
    //
  }
}
