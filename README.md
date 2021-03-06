jSend
=====
[![Build
Status](https://travis-ci.org/rohanorton/proto-jSend.svg?branch=master)](https://travis-ci.org/rohanorton/proto-jSend)
[![Coverage
Status](https://coveralls.io/repos/github/rohanorton/proto-jSend/badge.svg?branch=master)](https://coveralls.io/github/rohanorton/proto-jSend?branch=master)

[Express](http://expressjs.com/ "Fast, unopinionated, minimalist web framework for Node.js")
 [middleware](http://expressjs.com/en/guide/using-middleware.html "using Expressjs middleware")
 for
 [jSend](http://labs.omniti.com/labs/jsend "Original jSend specification")
 [responses](http://expressjs.com/en/4x/api.html#res "Expressjs responses").


# install

With [npm](https://www.npmjs.com/) do:

```
npm install proto-jsend
```

Then assign as express middleware. This will add the jSend methods to the express request and response objects.
```js
var app = express(),
 jSend = require('proto-jsend');

app.use(jSend);

```

## Methods

res.jSend
------------

```js
/**
 * Send jSend success response to the client
 * 
 * res.jSend will infer the status code (200 or 201 from the request http method)
 * if jsonp is used req.method is always 'GET' so in this case req._method property must be set to the desired method e.g 'POST' if you wish to receive a 201 code
 *
 * @param {Object} data - data to send in response
 */
res.jSend = function (data) {
  // ...
}
```

res.jSend.error
------------
- This is for 5xx type errors (i.e. internal server error)
```js
/**
 * Send custom jSend "error" messages to client
 *
 * @param {Object} arguments - Object containing options for jSend.error
 * @param {Number} arguments.code - HTTP Status Code 5xx (defaults to 500)
 * @param {String} arguments.message - Message to be sent to the client
 * @param {Object} [arguments.data] - Object to be sent to the client
 */
res.jSend.error = function (arguments) {
  // ...
}
```
- Example usage:
```js
res.jSend.error({
  code: 500,
  message: "Internal Server Error",
  data: new Error('Broke it!')
});
``` 
```http
HTTP/1.1 500 Error
{
  "status": "error",
  "message": "Internal Server Error"
}
```
- A stack trace (or I guess, whatever you want to put in data) will also show on the data property when not in production environment for debugging purposes:
```http
HTTP/1.1 500 Error
{
  "status": "error",
  "message": "Internal Server Error",
  "data": "Error: Broke it!\n    at Object.<anonymous> (/Users/foo/app.js:12:25)\n    at Module._compile (module.js:460:26)\n    at Object.Module._extensions..js (module.js:478:10)\n    at Module.load (module.js:355:32)\n    at Function.Module._load (module.js:310:12)\n    at Function.Module.runMain (module.js:501:10)\n    at startup (node.js:129:16)\n    at node.js:814:3"
}
```

res.jSend.fail
----------
- This is for 4xx type errors (i.e. bad request, unauthorised etc.)
- Footprint:
```js
/**
 * Send custom jSend "fail" messages to client
 *
 * @param {Object} arguments - Object containing options for jSend.fail
 * @param {Number} arguments.code - HTTP Status Code 4xx (defailts to 400)
 * @param {Object} arguments.data - Object to be sent to the Client
 */
res.jSend.fail = function (arguments) {
   // ...
};
```
- Example usage:
```js
res.jSend.error({
  code: 400,
  message: "Bad Request",
  data: {
    title: "Title property of type string is required"
  }
});
``` 
```http
HTTP/1.1 400 Bad Request
{
  "status": "fail",
  "data": {
    "title": "Title property of type string is required"
  }
}
``` 
