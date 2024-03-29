const vscode = require('vscode');

const Command = require('../lib/command');
const { typeRealistically } = require('../util/realisticTyping');
const { speak } = require('../util/speak');
const { script } = require('../script');

class RunAIAgentCommand extends Command {
    constructor() {
        super('bizarro-devin.runAIAgent');
    }

    // TODO: Receive a prompt to get started
    async run() {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('Create a text file first!');
            return; // No open text editor
        }

        // Iterate through each step
        for (const step of script) {
            await this.processStep(step, editor);
        }
    }

    async processStep(step, editor) {
        if (step.type === 'code') {
            // Join the array of strings into a single string separated by newlines, more clear in terms of formatting than the template literal
            await typeRealistically(editor, step.content.join('\n'));
        } else if (step.type === 'narrate') {
            await speak(step.content);
        }
    }
}

module.exports = RunAIAgentCommand;
