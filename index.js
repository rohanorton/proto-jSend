/*jslint node:true indent:2 nomen:true*/
'use strict';
var arg = require("arg-err").config({ propErr: true }),
  assert = require('assert');

module.exports = function (req, res, next) {

  function sendResponse(code, json) {
    if (req.query.callback) {
      return res.jsonp(json);
    }
    return res.status(code).json(json);
  }

  function getSuccessCode() {
    return (req._method === 'POST' || req.method === 'POST') ? 201 : 200;
  }

  function getSuccessResponseData(data) {
    return (!data || (req._method === 'DELETE' || req.method === 'DELETE')) ? null : data;
  }

  res.jSend = function (data, metadata) {
    var payload = {
      status: 'success',
      data: getSuccessResponseData(data)
    };
    if (metadata) {
      payload.metadata = metadata;
    }
    return sendResponse(getSuccessCode(), payload);
  };

  function formatErrorObject(err) {
    return {
      message: String(err),
      stack: err.stack
    };
  }

  function validateErrorOptions(options) {
    assert(options, 'res.jSend.error invoked without options');
    var required = {
        message: "string"
      },
      optional = {
        code: "number",
        data: "object"
      },
      err = arg.err(options, required, optional);
    assert(!err, 'res.jSend.error options validation: ' + err);
  }


  res.jSend.error = function (options) {
    validateErrorOptions(options);
    if (options.data instanceof Error) {
      options.data = formatErrorObject(options.data);
    }
    if (options.code === undefined) {
      options.code = 500;
    }
    var responseData = {
      status: 'error',
      code: options.code,
      message: options.message
    };
    if (process.env.NODE_ENV !== 'production') {
      responseData.data = options.data || null;
    }
    return sendResponse(options.code, responseData);
  };

  function validateFailOptions(options) {
    assert(options, 'res.jSend.fail invoked without options');
    var required = {},
      optional = {
        data: ["object", "string"],
        code: "number",
        message: "string",
      },
      err = arg.err(options, required, optional);
    assert(!err, 'res.jSend.fail options validation: ' + err);
  }

  res.jSend.fail = function (options) {
    validateFailOptions(options);
    if (options.code === undefined) {
      options.code = 400;
    }
    var responseData = {
      status: 'fail',
      code: options.code,
      data: options.data,
      message: options.message
    };
    return sendResponse(options.code, responseData);
  };


  return next();
};
