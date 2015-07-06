/*jslint node:true indent:2 nomen:true */
/*globals jasmine, expect, describe, it, beforeEach, spyOn */
'use strict';

var jSend = require('../'),
  httpMocks = require('node-mocks-http'),
  assert = require('assert'),
  functionCalled,
  req,
  res,
  next;

function getResponseData() {
  return JSON.parse(res._getData());
}

beforeEach(function () {
  functionCalled = false;
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = function () { return; };
  spyOn(res, 'json').and.callThrough();
});

describe('jSend', function () {
  it('should exist', function () {
    assert(jSend);
  });
  it('should be a function', function () {
    assert(typeof jSend === 'function');
  });
  it('should call third parameter "next" function as callback', function () {
    next = jasmine.createSpy('spy');
    jSend(req, res, next);
    expect(next).toHaveBeenCalled();
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
      res.jSend();
      expect(res.json).toHaveBeenCalled();
    });
    it('should send object to res.json when invoked', function () {
      res.jSend();
      expect(res.json).toHaveBeenCalledWith(jasmine.any(Object));
    });
    it('should send response with status set to "success"', function () {
      res.jSend();
      expect(getResponseData().status).toBe('success');
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
    it('should send response code of 201 if request was a POST', function () {
      req.method = 'POST';
      res.jSend();
      expect(res.statusCode).toBe(201);
    });
    it('should send data of null if request was a DELETE', function () {
      req.method = 'DELETE';
      res.jSend([ 'this', 'should', 'not', 'be', 'sent', 'as', 'data']);
      assert(getResponseData().data === null);
    });

    describe('res.jSend.error', function () {
      it('should be function', function () {
        expect(res.jSend.error).toEqual(jasmine.any(Function));
      });
      it('should throw correct error if invoked without an argument', function () {
        expect(res.jSend.error).toThrowError('res.jSend.error invoked without argument');
      });
      it('should throw correct error if status not defined', function () {
        expect(function () {
          res.jSend.error({message: 'foo'});
        }).toThrowError('res.jSend.error options validation: expected property status to be of type number (was undefined)');
      });
      it('should throw correct error if message not defined', function () {
        expect(function () {
          res.jSend.error({status: 500});
        }).toThrowError('res.jSend.error options validation: expected property message to be of type string (was undefined)');
      });
      it('should set res status code to specified status', function () {
        res.jSend.error({status: 501, message: 'Not Implemented'});
        expect(res.statusCode).toEqual(501);
      });
      it('should set response status to error', function () {
        res.jSend.error({status: 500, message: 'Internal Server Error'});
        expect(getResponseData().status).toEqual('error');
      });
      it('should set response message', function () {
        res.jSend.error({status: 500, message: 'Example message'});
        expect(getResponseData().message).toEqual('Example message');
      });
    });
  });
});
