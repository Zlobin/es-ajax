const http = require('http');
const url = require('url');

const app = http.createServer((request, response) => {
  const override = request.headers['x-http-method-override'] || '';
  const responseBody = {
    'foo': 'bar',
    'requestData': {
      'method': request.method,
      // @todo
      // 'isFile': false,
      // If http server doesn't allow PUT, DELETE methods.
      'isOverriden': !!override,
      'overrideMethod': override,
      'headers': request.headers
    }
  };
  const URL = url.parse(request.url, true);

  if (request.url === '/favicon.ico') {
    response.writeHead(200, {'Content-Type': 'image/x-icon'} );
    response.end();
    return;
  }

  if (URL.query.timeout !== void 0) {
    request.setTimeout(parseInt(URL.query.timeout, 10));
  }

  response.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': request.headers['access-control-request-headers'],
    'Access-Control-Allow-Methods': 'POST, GET, HEAD, OPTIONS'
  });
  response.write(JSON.stringify(responseBody));
  response.end();
}).listen(1337, '127.0.0.1');

console.log('Server is running.');
