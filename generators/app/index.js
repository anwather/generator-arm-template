'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay('Welcome to the unreal ' + chalk.red('arm-template') + ' generator!'));

    const prompts = [
      {
        type: 'confirm',
        name: 'someAnswer',
        message: 'Would you like to enable this option?',
        default: true
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    this.fs.copy(
      this.templatePath('Deploy-AzureResourceGroup.ps1'),
      this.destinationPath('Deploy-AzureResourceGroup.ps1')
    );
    this.fs.copy(
      this.templatePath('azuredeploy.json'),
      this.destinationPath('azuredeploy.json')
    );
    this.fs.copy(
      this.templatePath('azuredeploy.parameters.json'),
      this.destinationPath('azuredeploy.parameters.json')
    );
    this.fs.copy(
      this.templatePath('.vscode/launch.json'),
      this.destinationPath('.vscode/launch.json')
    );
  }

  install() {
    this.installDependencies();
  }
};
