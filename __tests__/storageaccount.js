'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const resource = require(path.join(__dirname, '../generators/storageaccount/index.js'));

describe('generator-arm-template:storageaccount', () => {
  it('contains a storage account', () => {
    var t = resource.addResource(null);
    assert.notEqual(t, null);
  });
});
