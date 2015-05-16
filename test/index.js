/*jslint node:true indent:2 nomen:true */
/*globals describe, it, beforeEach */
'use strict';

var jSend = require('../'),
  httpMocks = require('node-mocks-http'),
  assert = require('assert'),
  _ = require('lodash'),
  functionCalled,
  req,
  res,
  next;

function setFunctionCalled() {
  functionCalled = true;
}

function getResponseData() {
  return JSON.parse(res._getData());
}

beforeEach(function () {
  functionCalled = false;
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
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
    it('should send response with status set to "success"', function () {
      res.jSend();
      assert.equal(getResponseData().status, 'success');
    });
    it('should send response with data set to null', function () {
      res.jSend();
      assert(getResponseData().data === null);
    });
    it('should send response with data set to res.jSend parameter', function () {
      var data = [ 'this', 'is', 'a', 'test' ];
      res.jSend(data);
      assert.deepEqual(getResponseData().data, data);
    });
    it('should send response code of 200', function () {
      res.jSend();
      assert.equal(res.statusCode, 200);
    });
  });
});
