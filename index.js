/*jslint node:true indent:2*/
'use strict';
var arg = require("arg-err");

module.exports = function (req, res, next) {

  function sendResponse(code, json) {
    return res.status(code).json(json);
  }

  function getSuccessCode() {
    return req.method === 'POST' ? 201 : 200;
  }

  function getSuccessResponseData(data) {
    return (!data || req.method === 'DELETE') ? null : data;
  }

  res.jSend = function (data) {
    var payload = {
      status: 'success',
      data: getSuccessResponseData(data)
    };

    return sendResponse(getSuccessCode(), payload);
  };

  res.jSend.error = function (options) {
    if (!options) {
      throw new Error('res.jSend.error invoked without argument');
    }
    var err = arg.err(options, {
      status: "number",
      message: "string"
    });
    if (err) {
      err = err.replace('argument', 'property');
      throw new Error('res.jSend.error options validation: ' + err);
    }
  };

  return next();
};
