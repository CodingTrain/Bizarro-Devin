const config = require('../../config');
const ModelProvider = require('./genericProvider');
const model = config.model || 'ollama';

const QueryModelProvider = require(`./${model}Provider.js`);
console.log(`Using model from ${model}`);

/** @type {ModelProvider} */
let provider = null;

function getProvider() {
  if (!provider) {
    provider = new QueryModelProvider();
  }
  return provider;
}

module.exports = { getProvider };
