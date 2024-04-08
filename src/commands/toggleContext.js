const { getAgent } = require('../lib/agent/Agent');
const Command = require('../lib/command');
const vscode = require('vscode');

class ToggleContextCommand extends Command {
  constructor() {
    super('bizarro-devin.toggleContext');
  }

  load(context) {
    // Include context status item
    this.contextStatusItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      -1001
    );
    this.contextStatusItem.text = '$(check) Context included';
    this.contextStatusItem.show();
    context.subscriptions.push(this.contextStatusItem);
  }

  async run() {
    const agent = getAgent();
    agent.includeContextFromEmbeddings = !agent.includeContextFromEmbeddings;

    // Update the status bar
    this.contextStatusItem.text = agent.includeContextFromEmbeddings
      ? '$(check) Context included'
      : '$(close) Context excluded';

    // Show an info message
    // const message = `Including context in prompt is now ${
    //   agent.includeContextFromEmbeddings ? 'enabled' : 'disabled'
    // }.`;
    // vscode.window.showInformationMessage(message);
  }
}

module.exports = ToggleContextCommand;
