const CommandLoader = require('./lib/commandLoader');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Choo choo 🚂!');

  const commandLoader = new CommandLoader(context);
  commandLoader.load('commands');
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
