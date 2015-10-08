/*jslint node:true indent:2*/
'use strict';
var arg = require("arg-err");

module.exports = function (req, res, next) {

  function sendResponse(code, json) {
    return res.status(code).json(json);
  }

  function getSuccessCode() {
    return (req._method === 'POST' || req.method === 'POST') ? 201 : 200;
  }

  function getSuccessResponseData(data) {
    return (!data || (req._method === 'DELETE' || req.method === 'DELETE')) ? null : data;
  }

  res.jSend = function (data) {
    var payload = {
      status: 'success',
      data: getSuccessResponseData(data)
    };
    return sendResponse(getSuccessCode(), payload);
  };

  function formatErrorObject(err) {
    return {
      message: String(err),
      stack: err.stack
    };
  }

  function validateErrorOptions(options) {
    if (!options) {
      throw new Error('res.jSend.error invoked without argument');
    }
    var err = arg.err(options, {
      message: "string"
    }, {
      code: "number",
      data: "object"
    });
    if (err) {
      // Arg-Err calls 'properties' 'arguments'
      err = err.replace('argument', 'property');
      throw new Error('res.jSend.error options validation: ' + err);
    }
  }

  res.jSend.error = function (options) {
    validateErrorOptions(options);
    if (options.data instanceof Error) {
      options.data = formatErrorObject(options.data);
    }
    var responseData = {
      status: 'error',
      message: options.message
    };
    if (process.env.NODE_ENV !== 'production') {
      responseData.data = options.data || null;
    }
    return sendResponse(options.code, responseData);
  };

  return next();
};
