const { getAgent } = require('../lib/agent/Agent');
const Command = require('../lib/command');
const vscode = require('vscode');

class IgnoreErrorsCommand extends Command {
  constructor() {
    super('bizarro-devin.ignoreErrors');
  }

  async run() {
    const agent = getAgent();
    agent.ignoreErrors = !agent.ignoreErrors;

    vscode.window.showInformationMessage(
      'Error ignoring is now ' + (agent.ignoreErrors ? 'enabled' : 'disabled')
    );
  }
}

module.exports = IgnoreErrorsCommand;
