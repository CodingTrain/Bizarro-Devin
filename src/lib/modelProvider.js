const config = require('../../config');

const model = config.model || 'ollama';

const QueryModelProvider = require(`./queryModel.${model}.js`);
console.log(`Using model from ${model}`);

const provider = new QueryModelProvider();

class ModelProvider {
  constructor() {
    /**
     * History of messages sent to the model
     * @type {Array<{ role: string; content: string; }>}
     */
    this.messageHistory = [];
  }
  /**
   * Query the model with a prompt and return the response
   * @param {string} prompt Prompt to send to the model
   */
  async query(prompt) {
    throw new Error('Not implemented');
  }
  /**
   * Query the model with a prompt and stream the response
   * @param {string} prompt Prompt to send to the model
   * @param {function} process Function to process the response
   */
  queryStream(prompt, process) {
    throw new Error('Not implemented');
  }
}

module.exports = { ModelProvider, provider };
