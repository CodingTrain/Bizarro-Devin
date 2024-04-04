const config = require('../../../../config');
const ModelProvider = require('./genericProvider');
const model = config.model || 'ollama';

/** @type {typeof ModelProvider} */
const QueryModelProvider = require(`./${model}Provider.js`);
console.log(`Using model from ${model}`);

module.exports = { Provider: QueryModelProvider };
