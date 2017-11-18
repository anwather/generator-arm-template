'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

var generator;
var template;

describe('generator-arm-template:publicip', () => {
  beforeAll(() => {
    generator = helpers.createGenerator(
      'arm-template:publicip',
      [path.join(__dirname, '../generators/publicip')],
      null,
      null
    );
  });
  beforeEach(() => {
    template = {
      $schema:
        'https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#',
      contentVersion: '1.0.0.0',
      parameters: {},
      variables: {},
      resources: [],
      outputs: {}
    };
  });

  it('creates a public IP with no DNS label', () => {
    template = generator._addResource(template, {
      name: 'testName',
      location: 'testLocation',
      dnsname: '',
      allocationMethod: 'Dynamic'
    });
    assert.equal(template.resources[0].type, 'Microsoft.Network/publicIPAddresses');
    assert.equal(template.resources[0].properties.dnsSettings, undefined);
  });

  it('creates a public IP with a DNS label', () => {
    template = generator._addResource(template, {
      name: 'testName',
      location: 'testLocation',
      dnsname: 'testlabel',
      allocationMethod: 'Dynamic'
    });
    assert.equal(template.resources[0].type, 'Microsoft.Network/publicIPAddresses');
    assert.equal(
      template.resources[0].properties.dnsSettings.domainNameLabel,
      'testlabel'
    );
  });
});
