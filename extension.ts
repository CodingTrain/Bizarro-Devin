import vscode from 'vscode';
import typewriter from './typewriter';
import { Devin_Response } from './yourAi';
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context: vscode.ExtensionContext) {
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

function pauseAgent(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
  vscode.commands.executeCommand('livePreview.start');
  
  let code = (await Devin_Response("start","")).msg
  typewriter(code,(character) => {
    editor.edit((editBuilder) => editBuilder.insert(editor.selection.active, character));
  })


  vscode.commands.executeCommand('editor.action.formatDocument');

  // await pauseAgent(3000);

  // editor.edit((editBuilder) => {
  //   editBuilder.insert(
  //     editor.selection.active,
  //     `
  //   );
  // });
}

module.exports = {
  activate,
  deactivate,
};
