'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

var generator;

describe('generator-arm-template:networkinterface', () => {
  beforeAll(() => {
    generator = helpers.createGenerator(
      'arm-template:networkinterface',
      [path.join(__dirname, '../generators/networkinterface')],
      null,
      null
    );
  });

  it('contains a storage account', () => {
    var template = {
      $schema:
        'https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#',
      contentVersion: '1.0.0.0',
      parameters: {},
      variables: {},
      resources: [],
      outputs: {}
    };
    template = generator._addResource(template, {
      name: 'testName',
      location: 'testLocation',
      networkName: 'test',
      subnetName: 'test',
      publicIpName: 'test'
    });
    assert.equal(template.resources[0].type, 'Microsoft.Network/networkInterfaces');
  });
});
