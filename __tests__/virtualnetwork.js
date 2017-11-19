'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

var generator;
var template;

describe('generator-arm-template:virtualnetwork', () => {
  before(() => {
    generator = helpers.createGenerator(
      'arm-template:virtualnetwork',
      [path.join(__dirname, '../generators/virtualnetwork')],
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

  it('creates a network with no DNS servers', () => {
    template = generator._addResource(template, {
      name: 'testName',
      location: 'testLocation',
      addressSpace: '192.168.0.0/16',
      subnetName: 'subnet-1',
      subnetAddressSpace: '192.168.0.0/16',
      dnsServers: ''
    });
    assert.equal(template.resources[0].type, 'Microsoft.Network/virtualNetworks');
    assert.equal(template.resources[0].properties.dhcpOptions.dnsServers.length, 0);
  });

  it('creates a network with one custom DNS server', () => {
    template = generator._addResource(template, {
      name: 'testName',
      location: 'testLocation',
      addressSpace: '192.168.0.0/16',
      subnetName: 'subnet-1',
      subnetAddressSpace: '192.168.0.0/16',
      dnsServers: '192.168.0.4'
    });
    assert.equal(template.resources[0].type, 'Microsoft.Network/virtualNetworks');
    assert.equal(template.resources[0].properties.dhcpOptions.dnsServers.length, 1);
  });

  it('creates a network with multiple custom DNS servers', () => {
    template = generator._addResource(template, {
      name: 'testName',
      location: 'testLocation',
      addressSpace: '192.168.0.0/16',
      subnetName: 'subnet-1',
      subnetAddressSpace: '192.168.0.0/16',
      dnsServers: '192.168.0.4,8.8.8.8'
    });
    assert.equal(template.resources[0].type, 'Microsoft.Network/virtualNetworks');
    assert.equal(template.resources[0].properties.dhcpOptions.dnsServers.length, 2);
  });
});
