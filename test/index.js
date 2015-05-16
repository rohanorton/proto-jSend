/*jslint node:true indent:2 */
/*globals describe, it */
'use strict';

var jSend = function () { return; };

var assert = require('assert');

describe('jSend', function () {
  it('should exist', function () {
    assert(jSend);
  });
  it('should be a function', function () {
    assert(typeof jSend === 'function');
  });
  it('should call third parameter "next" function as callback', function () {
    var called = false,
      req = null,
      res = null,
      next = function () { called = true; };
    jSend(req, res, next);
    assert(called);
  });
});
