const player = require('play-sound')();
const fs = require('fs');
const wavefile = require('wavefile');

speak('hello, my name is Dan, how are you doing?');

async function speak(txt) {
  const TransformersApi = Function('return import("@xenova/transformers")')();
  const { pipeline } = await TransformersApi;

  // const synthesizer = await pipeline('text-to-speech', 'Xenova/mms-tts-eng', {
  //   quantized: false,
  // });

  const synthesizer = await pipeline('text-to-speech', 'Xenova/speecht5_tts', {
    quantized: false,
  });
  // const speaker_embeddings =
  ('https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/speaker_embeddings.bin');

  const speaker_embeddings =
    'https://huggingface.co/datasets/Xenova/cmu-arctic-xvectors-extracted/resolve/main/cmu_us_awb_arctic-wav-arctic_a0001.bin';

  const start = performance.now();
  const output = await synthesizer(txt, { speaker_embeddings });
  const end = performance.now();
  console.log(`Synthesizer took ${Math.round(end - start) / 1000} seconds.`);
  const wav = new wavefile.WaveFile();
  wav.fromScratch(1, output.sampling_rate, '32f', output.audio);
  const tempFilePath = 'temp_audio.wav';
  fs.writeFileSync(tempFilePath, wav.toBuffer());
  player.play(tempFilePath, (err) => {
    if (err) {
      console.error('Failed to play:', err);
    } else {
      console.log('Audio playback finished.');
      fs.unlinkSync(tempFilePath);
    }
  });
}
