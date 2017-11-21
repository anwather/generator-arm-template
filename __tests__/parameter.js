'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

var generator;
var template;

describe('generator-arm-template:parameter', () => {
  before(() => {
    generator = helpers.createGenerator(
      'arm-template:parameter',
      [path.join(__dirname, '../generators/parameter')],
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

  it('creates a new string parameter', () => {
    template = generator._addParameter(template, {
      name: 'testparam',
      description: 'testparam',
      parameterType: 'string'
    });
    assert.equal(template.parameters.testparam.type, 'string');
  });

  it('creates a new string parameter with allowed values', () => {
    template = generator._addParameter(template, {
      name: 'testparam',
      description: 'testparam',
      parameterType: 'string',
      allowedValues: 'one,two,three'
    });
    assert.equal(template.parameters.testparam.type, 'string');
    assert.equal(template.parameters.testparam.allowedValues[0], 'one');
    assert.equal(template.parameters.testparam.allowedValues[1], 'two');
    assert.equal(template.parameters.testparam.allowedValues[2], 'three');
  });

  it('creates a new string parameter with min/max length', () => {
    template = generator._addParameter(template, {
      name: 'testparam',
      description: 'testparam',
      parameterType: 'string',
      minLength: 1,
      maxLength: 10
    });
    assert.equal(template.parameters.testparam.type, 'string');
    assert.equal(template.parameters.testparam.minLength, 1);
    assert.equal(template.parameters.testparam.maxLength, 10);
  });

  it('creates a new string parameter with a default value', () => {
    template = generator._addParameter(template, {
      name: 'testparam',
      description: 'testparam',
      parameterType: 'string',
      defaultValue: 'mydefault'
    });
    assert.equal(template.parameters.testparam.type, 'string');
    assert.equal(template.parameters.testparam.defaultValue, 'mydefault');
  });

  it('creates a new int parameter', () => {
    template = generator._addParameter(template, {
      name: 'testparam',
      description: 'testparam',
      parameterType: 'int'
    });
    assert.equal(template.parameters.testparam.type, 'int');
  });

  it('creates a new int parameter with min/max values', () => {
    template = generator._addParameter(template, {
      name: 'testparam',
      description: 'testparam',
      parameterType: 'int',
      minValue: 1,
      maxValue: 10
    });
    assert.equal(template.parameters.testparam.type, 'int');
    assert.equal(template.parameters.testparam.minValue, 1);
    assert.equal(template.parameters.testparam.maxValue, 10);
  });
});
