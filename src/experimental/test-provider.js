const { getProvider } = require('../lib/agent/providers/providerInstance');
const inquirer = require('inquirer');

const provider = getProvider();
testReplicateStream();

async function testReplicateStream() {
  let codeSnippet = '';

  const promptTemplate =
    'Dan says: {prompt}\nCurrent code in the editor:\n```\n{currentCode}\n```';

  while (true) {
    const { input } = await inquirer.prompt([
      {
        type: 'input',
        name: 'input',
        message: 'Enter a prompt',
      },
    ]);

    let fullResponse = '';

    const prompt = promptTemplate
      .replace('{prompt}', input)
      .replace('{currentCode}', codeSnippet);

    await provider.queryStream(prompt, (thing) => {
      fullResponse += thing.response;
      process.stdout.write(thing.response);
    });
    codeSnippet = getFinalCodeSnippet(fullResponse);
    console.log();
  }
}

function getFinalCodeSnippet(fullResponse) {
  let numTicks = fullResponse.split('```').length - 1;
  if (numTicks < 2) {
    return '';
  }
  // code snippet exists between last two ``` in the response
  let codeSnippet = fullResponse.split('```')[numTicks - 1];
  return codeSnippet;
}
