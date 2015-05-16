/*jslint node:true indent:2 unparam:true */
'use strict';

module.exports = function (req, res, next) {
  res.jSend = function () {
    return res.json({});
  };
  return next();
};

