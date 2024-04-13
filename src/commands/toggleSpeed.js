const Command = require('../lib/command');
const vscode = require('vscode');
const { getAgent } = require('../lib/agent/Agent');

class ToggleSpeedCommand extends Command {
  constructor() {
    super('bizarro-devin.toggleSpeed');
  }

  load(context) {
    // Include context status item
    this.contextStatusItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      -1001
    );
    this.contextStatusItem.text = '$(watch) Normal';
    this.contextStatusItem.show();
    context.subscriptions.push(this.contextStatusItem);
  }

  async run() {
    const agent = getAgent();
    agent.speed = !agent.speed;

    // Update the status bar
    this.contextStatusItem.text = agent.includeContextFromEmbeddings
      ? '$(flame) Fast'
      : '$(watch) Normal';

    // Show an info message
    // const message = `Including context in prompt is now ${
    //   agent.includeContextFromEmbeddings ? 'enabled' : 'disabled'
    // }.`;
    // vscode.window.showInformationMessage(message);
  }
}

module.exports = ToggleSpeedCommand;
