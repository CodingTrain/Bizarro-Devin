const vscode = require('vscode');

class Command {
  /**
   * Create a new command
   * @param {string} id The id of the command
   */
  constructor(id) {
    this.id = id;
  }

  /**
   * Load the command, gets run once when the command is registered
   * @param {vscode.ExtensionContext} context The extension context
   */
  load(context) {
    // Do nothing by default
  }

  /**
   * Run the command
   */
  run() {
    throw new Error('Method not implemented.');
  }
}

module.exports = Command;
