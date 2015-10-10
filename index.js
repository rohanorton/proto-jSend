/*jslint node:true indent:2*/
'use strict';
var arg = require("arg-err");

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
    if (!options) {
      throw new Error('res.jSend.error invoked without options');
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
    if (!options) {
      throw new Error('res.jSend.fail invoked without options');
    }
    var err = arg.err(options, {
      data: "object"
    }, {
      code: "number",
    });
    if (err) {
      // Arg-Err calls 'properties' 'arguments'
      err = err.replace('argument', 'property');
      throw new Error('res.jSend.fail options validation: ' + err);
    }
  }

  res.jSend.fail = function (options) {
    validateFailOptions(options);
    if (options.code === undefined) {
      options.code = 400;
    }
    var responseData = {
      status: 'fail',
      code: options.code,
      data: options.data
    };
    return sendResponse(options.code, responseData);
  };


  return next();
};
