
# Ajax requests in JavaScript [![Build Status](https://travis-ci.org/Zlobin/es-ajax.png?branch=master)](https://travis-ci.org/Zlobin/es-ajax)

## Synopsis

This library is for working with (a)synchonously HTTP-requests (HEAD, OPTIONS, GET, POST, PUT, DELETE) in a browser.

All work is based on promises approach. It allows to avoid callback hell.

The library is affording have full control for each external requests. Through API we can cancel current request, abort all active requests, get meta-information for each request-response (starting and ending time, headers). Also we can have number of (non)success responses by define URL. The library allows to create a "singleton" request, which can be sent only once in one time.

## Dependencies

Dependencies: [object-hash](https://www.npmjs.com/package/object-hash), [qs](https://www.npmjs.com/package/qs), [es-middleware](https://www.npmjs.com/package/es-middleware)

## Installation

`npm i -S es-ajax`<br>
or<br>
`git clone https://github.com/Zlobin/es-ajax.git`<br>
`cd es-ajax && npm i && webpack`<br>

## Examples

```javascript
var ajax = require('es-ajax');
```
Or after running `npm i && webpack` inside library path:
```html
<script src="<PATH/TO/LIBRARY>/dist/bundle.js">
```

You can test some stuff inside /demo/ path.

```js
// GET
ajax('/some/url')
  .get()
  .then(function(response) {
    // ...
  })
  .catch(function(error) {
    // ...
  });

// GET with parameters
ajax('/some/url')
  // /some/url?foo=bar&bar=baz
  .get({
    foo: 'bar',
    bar: 'baz'
  })
  // ...

// POST with parameters
ajax('/some/url')
  .post({
    // ...
    foo: 'bar',
    bar: 'baz'
  })
  .then(function(response) {
    // response.headers
    // response.response

    // ... some stuff
  })
  .catch(function(err) {
    console.log(err);
  });
```

You can change content-type of request, available types: 'json', 'text', 'html'

```js
ajax('/some/url', {
    type: 'json'
  })
  .get()
  .then(function() {
    // ...
  })
  .catch(function() {
    // ...
  });
```

Or you can add type manually, via headers:

```js
ajax('/some/url', {
    headers: {
      'Content-type': 'my-type'
    }
  })
  .get()
  .then(function() {
    // ...
  })
  .catch(function() {
    // ...
  });
```

Middleware is the programming pattern of providing hooks with a resume callback. It will be calling before a request was sent. It is able to cancel request, change URL and headers before sending. May be used, for instance, when you want to use some cache library, allow only some http-methods, like GET and POST, for instance.

Some examples:
```js
var cache = function(next) {
  var response = null;

  // For instance, we don't do cache for URL what contains "noCache" parameter.
  if (this.request.url.indexOf('noCache') > 0) {
    // Check if we already have cached resulst from some MyCache library.
    response = MyCache.get({
      url: request.url,
      method: request.method
    });

    if (response !== null) {
      console.log('Data from a cache.');
      // Do not send request to the server.
      // Return cached response.
      return Promise.resolse({
        response: response,
        headers: []
      });
    } else {
      console.log('Send request to the server.');
      return next();
    }
  } else {
    return next();
  }
};

ajax()
  .use([cache]);

// First request will be send to the server.
ajax('/foo/bar')
  .get()
  .then(function() {
    // Second one - not. We will get data immediately from a cache.
    ajax('/foo/bar')
      .get()
      .then(function() {
        // ...
      })
      .catch(function() {
        // ...
      });
  })
  .catch(function() {
    // ...
  });
```

Or if you want to allow to use only GET requests:

```js
var onlyGet = function(next) {
  return this.request.method === 'GET' ?
    next() :
    Promise.reject({
      status: 0,
      response: 'Available only "GET" requests',
      headers: []
    });
};

ajax()
  .use([onlyGet]);

ajax('/foo/bar')
  .get()
  .then(function() {
    // ... succeed
  })
  .catch(function() {
    // ...
  });

  ajax('/foo/bar')
    .post()
    .then(function() {
      // ...
    })
    .catch(function() {
      // ... failed
    });
```

## API

##### Static, may user without any XHR.
- **<code>abortAll</code> Stop all active requests**
- **<code>getXhrId</code> Get uniq id of the current request**
- **<code>getXhrMeta</code> Get meta info for the current request**
- **<code>getAllRequests</code> Get info about each sent request**
- **<code>setTimeout</code> Set timeout when reqeust should be canceled automatically**
- **<code>use</code> add middleware functions**

##### Non-static, should be used with a XHR (fetch) instance.
- **<code>setOverride</code> Set override for DELETE, PUT requests**
- **<code>options</code> Send HTTP `OPTIONS` request**
- **<code>head</code> Send HTTP `HEAD` request**
- **<code>get</code> Send HTTP `GET` request**
- **<code>post</code> Send HTTP `POST` request**
- **<code>put</code> Send HTTP `PUT` request**
- **<code>del</code> Send HTTP `DELETE` request**
- **<code>file</code> Upload a file**
- **<code>cancel</code> Candel current active request**
- **<code>onProgress</code> Add callback for progress file uploading - returns percentage**

## Testing

Tests are performed using "mocha", "sinon", "expect" libraries, PhantomJS as a browser and "karma" as a server. Run `npm test`.

## Minifying

You can grab minified versions of es-ajax from /dist path after running `webpack`.

## TODO

1. Send more than one file
2. Add more tests
3. Singleton request
4. Add custom parameters to the demo
5. Add polyfill for IE(10, 11) for Promises.
