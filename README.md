
# Ajax requests in JavaScript

## Synopsis

This library is for working with (a)synchonously HTTP-requests (HEAD, OPTIONS, GET, POST, PUT, DELETE) in a browser.

All work is based on promises approach. It allows to avoid callback hell.

The library is affording have full control for each external requests. Through API we can cancel current request, abort all active requests, get meta-information for each request-response (starting and ending time, headers). Also we can have number of (non)success responses by define URL. The library allows to create a "singleton" request, which can be sent only once in one time.

## Dependencies

Dependencies: [object-hash](https://www.npmjs.com/package/object-hash), [qs](https://www.npmjs.com/package/qs)

## Examples

```javascript
var ajax = require('es-ajax');
```
Or
```html
<script src="<PATH/TO/LIBRARY>/dist/bundle.js">
```

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
    // response.status
    // response.statusText
    // response.type
    // response.url

    if (response.status !== 200) {
      console.log('Something wrong status:' + response.status);
    } else {
      response
        .json()
        .then(function(data) {
          console.log(data);
        });
    }
  })
  .catch(function(err) {
    console.log(err);
  });
```

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

Middleware is calling before a request was sent. It can cancel request, change URL, headers before sending.
May be used, for instance, when you want to to some cache library. An example:
```js
var cache = function(headers, request, time) {
  var response = null;

  // For instance, we don't do cache for URL what contains "noCache" parameter.
  if (request.url.indexOf('noCache') > 0) {
    // Check if we already have cached resulst from some MyCache library.
    response = MyCache.get({
      url: request.url,
      method: request.method
    });

    if (response !== null) {
      console.log('Data from cache.');
      // Do not send request to the server.
      // Return cached response.
    } else {
      console.log('Send request to the server.');
      // Send request.
      // Add response to the cache.
    }
  }
};

ajax()
  .applyMiddleware([cache]);

// First request will be send to the server.
ajax('/foo/bar')
  .get()
  .then(function() {
    // Second one - not. We will get data immediately from a cache.
    ajax('/foo/bar')
      .get();    
  })
  .catch();
```

## API

##### Static, may user without any XHR.
- **<code>abortAll</code> Stop all active requests**
- **<code>getXhrId</code> Get uniq id of the current request**
- **<code>getXhrMeta</code> Get meta info for the current request**
- **<code>getAllRequests</code> Get info about each sent request**
- **<code>setTimeout</code> Set timeout when reqeust should be canceled automatically**
- **<code>applyMiddleware</code> no description**

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

## Building the documentation

You can use JSDoc comments found within the source code.

## Minifying

You can grab minified versions of es-ajax from /dist path after running `webpack`.

## TODO

1. Middleware
2. Send file(s)
3. Add more tests
4. Finish demo
5. Singleton request
