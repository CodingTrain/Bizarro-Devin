const config = require('../../config');

const model = config.model || 'ollama';

const queryModel = require(`./queryModel.${model}.js`);
console.log(`Using model from ${model}`);

module.exports = queryModel;
