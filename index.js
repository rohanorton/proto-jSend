/*jslint node:true indent:2 unparam:true */
'use strict';

module.exports = function (req, res, next) {

  function sendResponse(code, json) {
    return res.status(code).json(json);
  }

  function getSuccessCode() {
    return req.method === 'POST' ? 201 : 200;
  }

  res.jSend = function (data) {
    var payload = {
      status: 'success',
      data: data || null
    };

    return sendResponse(getSuccessCode(), payload);
  };

  return next();
};

