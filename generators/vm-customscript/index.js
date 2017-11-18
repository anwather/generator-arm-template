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
        '\n\nWelcome to the Azure ARM Template project generator for custom script VM Extension!\n'
    );

    const prompts = [
      {
        type: 'input',
        name: 'vmName',
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
        name: 'scriptUrl',
        message: 'What is the URL of the script to download and run?'
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
    template = this._addResource(template, this.props);
    this.fs.writeJSON(templatePath, template, null, 2);
  }

  _addResource(template, properties) {
    template.resources.push({
      apiVersion: '2015-06-15',
      type: 'Microsoft.Compute/virtualMachines/extensions',
      name: properties.vmName + '/CustomScript1',
      location: properties.location,
      dependsOn: [
        "[resourceId('Microsoft.Compute/virtualMachines', '" + properties.vmName + "')]"
      ],
      properties: {
        publisher: 'Microsoft.Compute',
        type: 'CustomScriptExtension',
        typeHandlerVersion: '1.8',
        autoUpgradeMinorVersion: true,
        settings: {
          fileUris: [properties.scriptUrl]
        },
        protectedSettings: {
          commandToExecute: 'powershell -ExecutionPolicy Unrestricted -File DevSetup.ps1',
          storageAccountName: "[parameters('storageAccountName')]",
          storageAccountKey: "[parameters('storageAccountKey')]"
        }
      }
    });
    // TODO: Fix the command to use the file name of the script in the command
    // TODO: confirm the protected settings around the storage account stuff to see what is needed
    return template;
  }

  install() {}
};
