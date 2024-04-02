const { getAgent } = require('../lib/agent/Agent');
const Command = require('../lib/command');
const vscode = require('vscode');

class ManualPromptCommand extends Command {
  constructor() {
    super('bizarro-devin.manualPrompt');
  }

  async run() {
    const prompt = await vscode.window.showInputBox({
      prompt: 'Enter a prompt',
      placeHolder: 'Enter a prompt',
    });

    if (!prompt) {
      return;
    }

    const agent = getAgent();

    agent.prompt(prompt);
  }
}

module.exports = ManualPromptCommand;
