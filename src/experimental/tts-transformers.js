const player = require('play-sound')();
const fs = require('fs');

speak('hello');

async function speak(txt) {
  const TransformersApi = Function('return import("@xenova/transformers")')();
  const { pipeline } = await TransformersApi;

  const synthesizer = await pipeline('text-to-speech', 'Xenova/mms-tts-eng', {
    quantized: false,
  });

  const output = await synthesizer(txt);
  const arrayBuffer = Buffer.from(output.audio.buffer);
  const buffer = Buffer.from(arrayBuffer);

  const tempFilePath = 'temp_audio.wav';
  fs.writeFileSync(tempFilePath, buffer);
  player.play(tempFilePath, (err) => {
    if (err) {
      console.error('Failed to play:', err);
    } else {
      console.log('Audio playback finished.');
      fs.unlinkSync(tempFilePath);
    }
  });
}
