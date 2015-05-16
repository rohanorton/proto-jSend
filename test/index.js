/*jslint node:true indent:2 */
/*globals describe, it, beforeEach */
'use strict';

var jSend =require('../'),
  assert = require('assert'),
  _ = require('lodash'),
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
  res = {};
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
  it('should add jSend to res object', function () {
    jSend(req, res, next);
    assert(res.jSend);
  });
  describe('res.jSend', function () {
    beforeEach(function () {
      jSend(req, res, next);
    });
    it('should be a function', function () {
      assert(typeof res.jSend === 'function');
    });
    it('should call res.json when invoked', function () {
      res.json = setFunctionCalled;
      res.jSend();
      assert(functionCalled);
    });
    it('should send object to res.json when invoked', function (done) {
      res.json = function (object) {
        assert(_(object).isObject());
        done();
      };
      res.jSend();
    });
  });
});
