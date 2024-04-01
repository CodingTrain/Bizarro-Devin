const config = require('../../config');
const { getProvider } = require('../lib/agent/providers/providerInstance');

const provider = getProvider();
testReplicate();

async function testReplicate() {
  await provider.query('Who are you?', console.log);
  await provider.queryStream('Can you code a fractal tree?', console.log);
}
// const replicate = new Replicate({
//   auth: config.replicateApiToken,
// });

// async function query(prompt) {
//   const output = await replicate.run('meta/llama-2-7b-chat', {
//     input: { prompt },
//   });
//   return output;
// }

// async function queryStream(prompt, process) {
//   const stream = replicate.stream('meta/llama-2-7b-chat', {
//     input: { prompt },
//   });
//   while (true) {
//     const { value } = await stream.next();
//     if (value.event == 'done') break;
//     process({
//       response: value.data, // fake modifying schema to match ollama
//     });
//   }
// }

// query('Why is the sky blue?').then(console.log).catch(console.error);

// queryStream('Why is the sky blue?', (json) => {
//   console.log(json);
// });
