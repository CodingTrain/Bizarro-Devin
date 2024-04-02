const { getProvider } = require('../lib/agent/providers/providerInstance');
const inquirer = require('inquirer');

const provider = getProvider();
testReplicateStream();

async function testReplicateStream() {
  while (true) {
    const { prompt } = await inquirer.prompt([
      {
        type: 'input',
        name: 'prompt',
        message: 'Enter a prompt',
      },
    ]);

    await provider.queryStream(prompt, (thing) => {
      process.stdout.write(thing.response);
    });
    console.log();
  }
}
