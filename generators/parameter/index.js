'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      chalk.blue('                          A                       \n') +
        chalk.blue('                       AAAA                       \n') +
        chalk.blue('                     AAAAAA AAA                   \n') +
        chalk.blue('                  AAAAAAA  AAAAA                  \n') +
        chalk.blue('                AAAAAAAA  AAAAAAA                 \n') +
        chalk.blue('              AAAAAAAAA  AAAAAAAAA                \n') +
        chalk.blue('            AAAAAAAAAA  AAAAAAAAAAA               \n') +
        chalk.blue('           AAAAAAAAAA  AAAAAAAAAAAAAA             \n') +
        chalk.blue('          AAAAAAAAAA  AAAAAAAAAAAAAAAA            \n') +
        chalk.blue('         AAAAAAAAAA   AAAAAAAAAAAAAAAAA           \n') +
        chalk.blue('        AAAAAAAAAA      AAAAAAAAAAAAAAAA          \n') +
        chalk.blue('      AAAAAAAAAAA         AAAAAAAAAAAAAAA         \n') +
        chalk.blue('     AAAAAAAAAAA            AAAAAAAAAAAAAA        \n') +
        chalk.blue('    AAAAAAAAAAA               AAAAAAAAAAAAAA      \n') +
        chalk.blue('   AAAAAAAAAAA                 AAAAAAAAAAAAAA     \n') +
        chalk.blue('   AAAAAAAAAA                 AAAAAAAAAAAAAAAA    \n') +
        chalk.blue('                  AAAAAAAAAAAAAAAAAAAAAAAAAAAAA   \n') +
        chalk.blue('               AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA   \n') +
        '\n\nWelcome to the Azure ARM Template project generator for parameters!\n'
    );

    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the parameter?',
        validate: function(input) {
          // TODO: Add regex to check format of parameter name
          if (input !== '') {
            return true;
          }
          return false;
        }
      },
      {
        type: 'input',
        name: 'description',
        message: 'What is the description of the parameter?'
      },
      {
        type: 'list',
        name: 'parameterType',
        message: 'What os the type of the parameter?',
        choices: [
          'array',
          'bool',
          'int',
          'object',
          'secureObject',
          'securestring',
          'string'
        ]
      },
      {
        type: 'input',
        name: 'defaultValue',
        message: 'What is the default value for this parameter? (blank for no default)'
      },
      {
        type: 'input',
        name: 'allowedValues',
        message:
          'What values are allowed values? (comma seperated list of values, blank for any value allowed)',
        when: function(answers) {
          if (answers.parameterType === 'string') {
            return true;
          }
          return false;
        }
      },
      {
        type: 'input',
        name: 'minValue',
        message: 'What is the minimum value for this parameter? (blank for no minimum)',
        when: function(answers) {
          if (answers.parameterType === 'int') {
            return true;
          }
          return false;
        },
        validate: function(input) {
          if (isNaN(input)) {
            return false;
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'maxValue',
        message: 'What is the maximum value for this parameter? (blank for no maximum)',
        when: function(answers) {
          if (answers.parameterType === 'int') {
            return true;
          }
          return false;
        },
        validate: function(input) {
          if (isNaN(input)) {
            return false;
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'minLength',
        message: 'What is the minimum length of this paramerter? (blank for no minimum)',
        when: function(answers) {
          if (answers.parameterType === 'string' || answers.parameterType === 'array') {
            return true;
          }
          return false;
        },
        validate: function(input) {
          if (isNaN(input)) {
            return false;
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'maxLength',
        message: 'What is the maximum length of this paramerter? (blank for no maximum)',
        when: function(answers) {
          if (answers.parameterType === 'string' || answers.parameterType === 'array') {
            return true;
          }
          return false;
        },
        validate: function(input) {
          if (isNaN(input)) {
            return false;
          }
          return true;
        }
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    var templatePath = this.destinationPath('azuredeploy.json');
    var template = this.fs.readJSON(templatePath);
    template = this._addParameter(template, this.props);
    this.fs.writeJSON(templatePath, template, null, 2);

    var parameterPath = this.destinationPath('azuredeploy.parameters.json');
    var parametersFile = this.fs.readJSON(parameterPath);
    parametersFile = this._addParameterValue(parametersFile, this.props);
    this.fs.writeJSON(parameterPath, parametersFile, null, 2);
  }

  _addParameter(template, properties) {
    var newParameter = {
      type: properties.parameterType
    };
    if (properties.description !== '') {
      newParameter.metadata = {
        description: properties.description
      };
    }
    if (properties.defaultValue !== '') {
      newParameter.defaultValue = properties.defaultValue;
    }
    if (properties.allowedValues !== undefined) {
      newParameter.allowedValues = properties.allowedValues.split(',');
    }
    if (properties.minValue !== undefined) {
      newParameter.minValue = parseInt(properties.minValue, 10);
    }
    if (properties.maxValue !== undefined) {
      newParameter.maxValue = parseInt(properties.maxValue, 10);
    }
    if (properties.minLength !== undefined) {
      newParameter.minLength = parseInt(properties.minLength, 10);
    }
    if (properties.maxLength !== undefined) {
      newParameter.maxLength = parseInt(properties.maxLength, 10);
    }

    template.parameters[properties.name] = newParameter;
    return template;
  }

  _addParameterValue(template, properties) {
    var newParameter = {
      value: ''
    };
    if (properties.defaultValue !== '') {
      newParameter.value = properties.defaultValue;
    }
    template.parameters[properties.name] = newParameter;
    return template;
  }
};
