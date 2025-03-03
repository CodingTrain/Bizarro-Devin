const { window } = require('vscode');

function runTerminalCommand(cmd) {
  const terminal = window.terminals[0];
  terminal.sendText(cmd);
}

module.exports = {
  runTerminalCommand,
};
