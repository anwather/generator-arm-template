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
        '\n\nWelcome to the Azure ARM Template project generator for Network interfaces!\n'
    );

    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the network interface?'
      },
      {
        type: 'input',
        name: 'location',
        message: 'Where should the resource be created?',
        default: '[resourceGroup().location]'
      },
      {
        type: 'input',
        name: 'publicIpName',
        message:
          'What is the name of the public IP address resource to associate to this NIC?'
      },
      {
        type: 'input',
        name: 'networkName',
        message:
          'What is the name of the virtual network address to assoicate to this NIC?'
      },
      {
        type: 'input',
        name: 'subnetName',
        message:
          'What is the name of the subnet in the virtual network to put this NIC in to?'
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
    template = template.addResource(template, this.props);
    this.fs.writeJSON(templatePath, template, null, 2);
  }

  addResource(template, properties) {
    template.resources.push({
      apiVersion: '2015-05-01-preview',
      type: 'Microsoft.Network/networkInterfaces',
      name: properties.name,
      location: properties.location,
      dependsOn: [],
      properties: {
        ipConfigurations: [
          {
            name: 'ipconfig1',
            properties: {
              privateIPAllocationMethod: 'Static',
              privateIPAddress: '192.168.0.4',
              publicIPAddress: {
                id:
                  "[resourceId('Microsoft.Network/publicIPAddresses', '" +
                  properties.publicIpName +
                  "')]"
              },
              subnet: {
                id:
                  "[concat(resourceId('Microsoft.Network/virtualNetworks', '" +
                  properties.networkName +
                  "'), '/subnets/" +
                  properties.subnetName +
                  "')]"
              }
            }
          }
        ]
      }
    });
    return template;
  }

  install() {
    this.installDependencies();
  }
};
