/*jslint node:true indent:2 */
/*globals describe, it, beforeEach */
'use strict';

var jSend = function (req, res, next) {
  return next();
};

var assert = require('assert'),
  functionCalled,
  req,
  res,
  next;

function setFunctionCalled() {
  functionCalled = true;
}

beforeEach(function () {
  functionCalled = false;
  req = null;
  res = null;
  next = function () { return; };
});

describe('jSend', function () {
  it('should exist', function () {
    assert(jSend);
  });
  it('should be a function', function () {
    assert(typeof jSend === 'function');
  });
  it('should call third parameter "next" function as callback', function () {
    next = setFunctionCalled;
    jSend(req, res, next);
    assert(functionCalled);
  });
});
