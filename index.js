/*jslint node:true indent:2 unparam:true */
'use strict';

module.exports = function (req, res, next) {
  res.jSend = function (data) {
    var code = 200;
    if (req.method === 'POST') {
      code = 201;
    }
    return res.status(code).json({
      status: 'success',
      data: data || null
    });
  };
  return next();
};

