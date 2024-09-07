const fs = require('fs');
const path = require('path');

const promptFile = path.join(__dirname, 'prompt.txt');

const prompts = {
  startingPrompt: `Write the code for a fractal tree in p5.js`,
  systemPrompt: fs.readFileSync(promptFile, `utf8`),
  promptingTemplate:
    'Dan says: {prompt}\nCurrent code in the editor:\n```\n{currentCode}\n```',
  promptingWithContextTemplate:
    'Dan says: {prompt}\nHere is some text from The Nature of Code Book that you can refer to for crafting the style and vocabulary of your response. You can use them but remember, the priority is a concise and snappy response full of evil AI coding hubris.\n{context}\n\nCurrent code in the editor:\n```\n{currentCode}\n```',
};

module.exports = {
  prompts,
};
