"use strict:'"

var assert = require('assert');

describe('Module', function() {
  describe('digi module', function () {
    it('should be able to load and instantiate a Digi app', function () {
      var digi = require('../index').Digi;
      assert.notNull(digi);
    });
  });
});
