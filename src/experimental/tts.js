const { spawn } = require('child_process');

test();

async function test() {
  const TransformersApi = Function('return import("@xenova/transformers")')();
  const { pipeline } = await TransformersApi;

  const synthesizer = await pipeline('text-to-speech', 'Xenova/mms-tts-eng', {
    quantized: false,
  });

  const output = await synthesizer('Hello, I am bizarro Devin the AI Agent!');

  const ffplay = spawn(
    'ffplay',
    [
      '-nodisp',
      '-autoexit',
      '-f',
      'f32le',
      '-ar',
      String(output.sampling_rate),
      '-ac',
      '1',
      '-i',
      '-',
    ],
    { stdio: ['pipe', 'ignore', 'ignore'] }
  );

  const buffer = Buffer.from(output.audio.buffer);
  ffplay.stdin.write(buffer);
  ffplay.stdin.end();

  ffplay.on('exit', (code, signal) => {
    console.log('Finished.');
  });
}
