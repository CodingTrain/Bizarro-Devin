const fs = require('fs');
const path = require('path');
const promptFile = path.join(__dirname, 'prompt.txt');

const prompts = {
  startingPrompt: `Write the code for a fractal tree in p5.js`,
  systemPrompt: fs.readFileSync(promptFile, `utf8`),
};

module.exports = {
  prompts,
};
