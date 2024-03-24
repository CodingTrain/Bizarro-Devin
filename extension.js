const vscode = require('vscode');

const { typeRealistically } = require('./util/realisticTyping');
const { speak } = require('./util/speak');
const { sleep } = require('./util/sleep');

const { script } = require('./script');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Choo choo 🚂!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand(
        'bizarro-devin.chooChoo',
        runAIAgent
    );
    context.subscriptions.push(disposable);
}

function deactivate() {}

// TODO: Receive a prompt to get started
async function runAIAgent() {
    // TODO: CREATE index.html and sketch.js
    // Run live server
    // Also, set up the window panes properly

    // get active text editor
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage('Create a text file first!');
        return; // No open text editor
    }

    // Open live preview
    await vscode.commands.executeCommand('livePreview.start');

    // Wait a second for the window to at least open
    while (vscode.window.tabGroups.all.length < 2) {
        await sleep(50);
    }

    // Toggle row layout
    await vscode.commands.executeCommand(
        'workbench.action.toggleEditorGroupLayout'
    );

    // Set this tab as our active tab again (weird workaround to make sure the next command works)
    await vscode.commands.executeCommand('vscode.open', editor.document.uri);

    // Move code editor to the bottom
    await vscode.commands.executeCommand(
        'workbench.action.moveActiveEditorGroupDown'
    );

    // Iterate through each step
    for (const step of script) {
        await processStep(step, editor);
    }
}

async function processStep(step, editor) {
    if (step.type === 'code') {
        await typeRealistically(editor, step.content.join('\n')); // Join the array of strings into a single string separated by newlines, more clear in terms of formatting than the template literal
    } else if (step.type === 'narrate') {
        await speak(step.content);
    }
}

module.exports = {
    activate,
    deactivate,
};
