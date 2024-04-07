const CommandLoader = require('./lib/commandLoader');
const vscode = require('vscode');

/** @type {vscode.StatusBarItem} */
let statusBarItem = null;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Choo choo 🚂!');

  const commandLoader = new CommandLoader(context);
  commandLoader.load('commands');

  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    -1000
  );
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  setStatusbarText('$(circle-slash) Awaiting input');
}

function setStatusbarText(text) {
  statusBarItem.text = text;
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
  setStatusbarText,
};
