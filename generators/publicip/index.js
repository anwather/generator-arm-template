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
        '\n\nWelcome to the Azure ARM Template project generator for public IP addresses!\n'
    );

    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the public IP?'
      },
      {
        type: 'input',
        name: 'location',
        message: 'Where should the resource be created?',
        default: '[resourceGroup().location]'
      },
      {
        type: 'input',
        name: 'dnsname',
        message: 'What is the prefix for the public DNS name?'
      },
      {
        type: 'list',
        name: 'allocationMethod',
        message: 'How should the IP be allocated?',
        choices: ['Dynamic', 'Static']
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
    template.resources.push({
      apiVersion: '2015-05-01-preview',
      type: 'Microsoft.Network/publicIPAddresses',
      name: this.props.name,
      location: this.props.location,
      properties: {
        publicIPAllocationMethod: this.props.allocationMethod,
        dnsSettings: {
          domainNameLabel: this.props.dnsname
        }
      },
      dependsOn: []
    });

    this.fs.writeJSON(templatePath, template, null, 2);
  }

  install() {
    this.installDependencies();
  }
};
