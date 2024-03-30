const vscode = require('vscode');

const Command = require('../lib/command');
const {
  typeRealistically,
  typeImmediately,
} = require('../util/realisticTyping');
const { speak } = require('../util/speak');

const { query, queryStream } = require('../util/queryModel');

// const { script } = require('../script');
const { prompts } = require('../prompt');

class RunAIAgentCommand extends Command {
  constructor() {
    super('bizarro-devin.runAIAgent');
  }

  // TODO: Receive a prompt to get started
  async run() {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showInformationMessage('Create a text file first!');
      return;
    }

    const startingPrompt = prompts.startingPrompt;
    queryStream(startingPrompt, async (response) => {
      console.log(response);
      await typeImmediately(editor, response.response);
    });
    // const response = await query(startingPrompt);
    // typeImmediately(editor, response.response);
    // console.log(response);
  }

  async processStep(step, editor) {
    if (step.type === 'code') {
      // Join the array of strings into a single string separated by newlines, more clear in terms of formatting than the template literal
      await typeRealistically(editor, step.content);
      // await typeRealistically(editor, step.content.join('\n'));
    } else if (step.type === 'narrate') {
      await speak(step.content);
    }
  }
}

module.exports = RunAIAgentCommand;
