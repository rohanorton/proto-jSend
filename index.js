/*jslint node:true indent:2 unparam:true */
'use strict';

module.exports = function (req, res, next) {
  res.jSend = function (data) {
    return res.json({
      status: 'success',
      data: data || null
    });
  };
  return next();
};

