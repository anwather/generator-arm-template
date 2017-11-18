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
        '\n\nWelcome to the Azure ARM Template project generator for virtual machines!\n'
    );

    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the VM?'
      },
      {
        type: 'input',
        name: 'location',
        message: 'Where should the resource be created?',
        default: '[resourceGroup().location]'
      },
      {
        type: 'input',
        name: 'size',
        message: 'What size should the VM be?'
      },
      {
        type: 'input',
        name: 'username',
        message: 'What is the username of the local admin account?'
      },
      {
        type: 'input',
        name: 'password',
        message: 'What is the password of the local admin account?'
      },
      {
        type: 'input',
        name: 'publisher',
        message: 'Who is the publisher of the image for the VM?',
        default: 'MicrosoftWindowsServer'
      },
      {
        type: 'input',
        name: 'offer',
        message: 'What VM image offer should be used?',
        default: 'WindowsServer'
      },
      {
        type: 'input',
        name: 'sku',
        message: 'What image SKU should be used?',
        default: '2016-Datacenter'
      },
      {
        type: 'input',
        name: 'version',
        message: 'What image version should be used?',
        default: 'latest'
      },
      {
        type: 'input',
        name: 'storageAccount',
        message: 'What storage account should be used for the default disk?'
      },
      {
        type: 'input',
        name: 'nic',
        message: 'What is the name of the NIC that should be used?'
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
    template = this.addResource(template, this.props);
    this.fs.writeJSON(templatePath, template, null, 2);
  }

  addResource(template, properties) {
    template.resources.push({
      apiVersion: '2015-05-01-preview',
      type: 'Microsoft.Compute/virtualMachines',
      name: properties.name,
      location: properties.location,
      dependsOn: [],
      properties: {
        hardwareProfile: {
          vmSize: properties.size
        },
        osProfile: {
          computerName: properties.name,
          adminUsername: properties.username,
          adminPassword: properties.password,
          windowsConfiguration: {
            provisionVMAgent: true,
            enableAutomaticUpdates: true
          }
        },
        storageProfile: {
          imageReference: {
            publisher: properties.publisher,
            offer: properties.offer,
            sku: properties.sku,
            version: properties.version
          },
          osDisk: {
            name: properties.name + '-disk',
            caching: 'ReadWrite',
            createOption: 'FromImage',
            vhd: {
              uri:
                'https://' +
                properties.storageAccount +
                '.blob.core.windows.net/vhds/' +
                properties.name +
                '-disk.vhd'
            }
          }
        },
        networkProfile: {
          networkInterfaces: [
            {
              id:
                "[resourceId('Microsoft.Network/networkInterfaces','" +
                properties.nic +
                "')]"
            }
          ]
        }
      }
    });
    return template;
  }

  install() {
    this.installDependencies();
  }
};
