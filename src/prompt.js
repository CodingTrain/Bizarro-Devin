const fs = require('fs');
const path = require('path');

const promptFile = path.join(__dirname, 'prompt.txt');

const fractalTestFile = path.join(
  __dirname,
  '../transcripts/noc-8-fractals.md'
);
// const fractalTest = fs.readFileSync(fractalTestFile, `utf8`);

const prompts = {
  startingPrompt: `Write the code for a fractal tree in p5.js`,
  systemPrompt: fs.readFileSync(promptFile, `utf8`),
  promptingTemplate:
    'Dan says: {prompt}\nCurrent code in the editor:\n```\n{currentCode}\n```',
  promptingWithContextTemplate:
    // 'Here is Chapter 8 from the Nature of Code that you can use as a reference for your fractal tutorial: /' +
    // fractalTest +
    // +'\n\n' +
    fs.readFileSync(promptFile, `utf8`) +
    '\n\nDan says: {prompt}\n\nCurrent code in the editor:\n```\n{currentCode}\n```\n Remember, do not use any code comments, instead explain the code you are writing! And also, remember your personality, train puns and dad jokes are encouraged! Finally, remember you need to provide ALL of the code always, not just the new code you are writing!',
  // promptingWithContextTemplate:
  //   'Dan says: {prompt}\nHere are some things that real Dan Shiffman has said that you should use as a model for crafting the style and vocabulary of your response.\n{context}\n\nCurrent code in the editor:\n```\n{currentCode}\n```\nRemember, your response should be no longer than just a few sentences.',
};

module.exports = {
  prompts,
};
