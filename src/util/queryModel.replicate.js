const Replicate = require('replicate');
const config = require('../../config');

const replicate = new Replicate({
  auth: config.replicateApiToken,
});

async function query(prompt) {
  const output = await replicate.run('meta/llama-2-7b-chat', {
    input: { prompt },
  });
  return { response: output.join('') };
}

async function queryStream(prompt, process) {
  const stream = replicate.stream('meta/llama-2-7b-chat', {
    input: { prompt },
  });
  while (true) {
    const { value } = await stream.next();
    if (value.event == 'done') break;
    process(value.data);
  }
}

module.exports = {
  query,
  queryStream,
};
