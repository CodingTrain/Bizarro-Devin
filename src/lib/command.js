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
   */
  load() {
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
