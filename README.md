
# Ajax (HEAD, OPTIONS, GET, POST, PUT, DELETE) requests in JavaScript

## Synopsis


## Dependencies

Only one dependency: object-hash.

## Examples

```javascript
var ajax = require('es-ajax');
```
Or
```html
<script src="<PATH/TO/LIBRARY>/dist/bundle.js">
```

```javascript
ajax('/some/url')
  .get()
  .then(function(response) {
    // ...
  })
  .catch(function(error) {
    // ...
  });

ajax('/some/url')
  // /some/url?foo=bar&bar=baz
  .get({
    foo: 'bar',
    bar: 'baz'
  })
  // ...

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

  // @todo
  // - Get list all active requests.
  // - Stop all requests.
  // - Stop request with an ID.
  // - Get meta-data for request by an ID.
  // -- number of done(fail) responses
  // ...

```

## Testing

Tests are performed using "mocha", "sinon" and "expect" library and "karma" as a server. Run `npm test`.

## Building the documentation

You can use JSDoc comments found within the source code.

## Minifying

You can grab minified versions of es-ajax from /dist path after running `webpack`.
