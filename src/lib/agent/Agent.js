const { typeImmediately } = require('../../util/realisticTyping');
const vscode = require('vscode');
const { getProvider } = require('./providers/providerInstance');

class Agent {
  constructor() {
    this.editor = vscode.window.activeTextEditor;
    this.provider = getProvider();
  }

  /**
   * Prompt something to the AI
   * @param {string} input The prompt to be processed
   */
  prompt(input) {
    console.log('prompting', input);
    this.provider.queryStream(input, (response) =>
      this.consumeStream(response)
    );
    console.log(this.provider.messageHistory);
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
