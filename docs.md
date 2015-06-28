
res.jSend.error
------------
- This is for 5xx type errors (i.e. internal server error)
- I guess that the footprint would look like this:
```js
/**
 * Send custom jSend "error" messages to client
 *
 * @param {Object} arguments - Object containing options for jSend.error
 * @param {Number} arguments.code - HTTP Status Code 5xx
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

res.jSend Fail
----------
- This is for 4xx type errors (i.e. bad request, unauthorised etc.)
- Footprint:
```js
/**
 * Send custom jSend "fail" messages to client
 *
 * @param {Object} arguments - Object containing options for jSend.fail
 * @param {Number} arguments.code - HTTP Status Code 4xx
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
