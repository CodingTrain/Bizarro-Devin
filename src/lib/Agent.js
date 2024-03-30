const { typeImmediately } = require('../util/realisticTyping');
const vscode = require('vscode');
const { provider } = require('./modelProvider');

class Agent {
  constructor() {
    this.editor = vscode.window.activeTextEditor;
  }

  /**
   * Prompt something to the AI
   * @param {string} input The prompt to be processed
   */
  prompt(input) {
    console.log('prompting', input);
    provider.queryStream(input, (response) => this.consumeStream(response));
  }

  async consumeStream(response) {
    console.log(response);
    await typeImmediately(this.editor, response.response);
  }
}

// Singleton instance of the agent
let agent = null;

/**
 * Get the agent instance
 * @returns {Agent} The agent instance
 */
const getAgent = () => {
  if (!agent) {
    agent = new Agent();
  }
  return agent;
};

module.exports = { getAgent };
