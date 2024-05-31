const fs = require('fs');
const path = require('path');

const promptFile = path.join(__dirname, 'prompt.txt');

const prompts = {
  startingPrompt: `Write the code for a fractal tree in p5.js`,
  systemPrompt: fs.readFileSync(promptFile, `utf8`),
  promptingTemplate:
    'Dan says: {prompt}\nCurrent code in the editor:\n```\n{currentCode}\n```',
  promptingWithContextTemplate:
    'Dan says: {prompt}\nHere are some things that real Matt Parker has said that you should use as a model for crafting the style and vocabulary of your response. You can use them but remember, the priority is a concise and snappy response full of puns.\n{context}\n\nCurrent code in the editor:\n```\n{currentCode}\n```\nRemember, your response should be no longer than just a few sentences and full of puns.',
};

module.exports = {
  prompts,
};
