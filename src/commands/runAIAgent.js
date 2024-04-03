const { getAgent } = require('../lib/agent/Agent');

const vscode = require('vscode');
const Command = require('../lib/command');

const { prompts } = require('../prompt');

class RunAIAgentCommand extends Command {
  constructor() {
    super('bizarro-devin.runAIAgent');
  }

  // TODO: Receive a prompt to get started
  async run() {
    let editor = vscode.window.visibleTextEditors[0];
    if (!editor) {
      vscode.window.showInformationMessage('Create a text file first!');
      return;
    }

    // const agent = getAgent();
    // const startingPrompt = prompts.startingPrompt;
    // agent.prompt(startingPrompt);
  }
}

module.exports = RunAIAgentCommand;
