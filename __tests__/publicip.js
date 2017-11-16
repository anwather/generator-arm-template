'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

var generator;

describe('generator-arm-template:publicip', () => {
  beforeAll(() => {
    generator = helpers.createGenerator(
      'arm-template:publicip',
      [path.join(__dirname, '../generators/publicip')],
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
    template = generator.addResource(template, {
      name: 'testName',
      location: 'testLocation',
      dnsName: 'test',
      allocationMethod: 'Dynamic'
    });
    assert.equal(template.resources[0].type, 'Microsoft.Network/publicIPAddresses');
  });
});
