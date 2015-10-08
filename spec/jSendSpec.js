/*jslint node:true indent:2 nomen:true */
/*globals jasmine, expect, describe, it, beforeEach, afterEach, spyOn */
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
  spyOn(res, 'jsonp').and.callThrough();
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
    it('should call res.jsend when req.query.callback is specified', function () {
      req.query.callback = function () { return undefined; };
      res.jSend();
      expect(res.jsonp).toHaveBeenCalled();
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
    it('should send response code of 201 if request was a POST (not jsonp)', function () {
      req.method = 'POST';
      res.jSend();
      expect(res.statusCode).toBe(201);
    });
    it('should send response code of 201 if request was a POST (using jsonp with _method)', function () {
      req.method = 'GET'; // jsonp is always GET due to browser limitations
      req._method = 'POST'; // _method property is used to specify method for jsonp requests so jsonp can be used to interact with restful web services
      res.jSend();
      expect(res.statusCode).toBe(201);
    });
    it('should send data of null if request was a DELETE (not jsonp)', function () {
      req.method = 'DELETE';
      res.jSend([ 'this', 'should', 'not', 'be', 'sent', 'as', 'data']);
      assert(getResponseData().data === null);
    });
    it('should send data of null if request was a DELETE (using jsonp with _method)', function () {
      req.method = 'GET';
      req._method = 'DELETE';
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
      it('should throw correct error if code is not a number', function () {
        expect(function () {
          res.jSend.error({message: 'foo', code: 'should be number'});
        }).toThrowError('res.jSend.error options validation: expected optional property code to be of type number (was string)');
      });
      it('should throw correct error if data is not an object', function () {
        expect(function () {
          res.jSend.error({message: 'foo', code: 500, data: 'not an object'});
        }).toThrowError('res.jSend.error options validation: expected optional property data to be of type object (was string)');
      });
      it('should throw correct error if message not defined', function () {
        expect(function () {
          res.jSend.error({code: 500});
        }).toThrowError('res.jSend.error options validation: expected property message to be of type string (was undefined)');
      });
      it('should set res status code to be specified code', function () {
        res.jSend.error({code: 501, message: 'Not Implemented'});
        expect(res.statusCode).toEqual(501);
      });
      it('should set response status to error', function () {
        res.jSend.error({code: 500, message: 'Internal Server Error'});
        expect(getResponseData().status).toEqual('error');
      });
      it('should set response message', function () {
        res.jSend.error({code: 500, message: 'Example message'});
        expect(getResponseData().message).toEqual('Example message');
      });
      it('should set response data', function () {
        res.jSend.error({code: 500, message: 'Example message', data: { foo: 'bar'}});
        expect(getResponseData().data).toEqual({foo: 'bar'});
      });
      it('should set data to null if not specified', function () {
        res.jSend.error({code: 500, message: 'Example message'});
        expect(getResponseData().data).toEqual(null);
      });

      describe('formatting of error data', function () {
        var exampleError, env, options;

        beforeEach(function () {
          env = process.env.NODE_ENV;
          exampleError = new Error('the app crashed');
          options = {
            code: 500,
            message: 'Internal Server Error',
            data: exampleError
          };
        });
        afterEach(function () {
          process.env.NODE_ENV = env;
        });

        it('should format error as data', function () {
          res.jSend.error(options);
          expect(getResponseData().data.message).toEqual('Error: the app crashed');
        });
        it('should provide a stacktrace on data if error', function () {
          var stack = exampleError.stack;
          res.jSend.error(options);
          expect(getResponseData().data.stack).toEqual(stack);
        });
        it('should not output a data object if environment is production', function () {
          process.env.NODE_ENV = 'production';
          res.jSend.error(options);
          expect(getResponseData().data).toEqual(undefined);
        });
      });
    });
  });
});
