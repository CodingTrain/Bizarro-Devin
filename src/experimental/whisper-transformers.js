const wavefile = require('wavefile');
const record = require('node-record-lpcm16');
const fs = require('fs');
const fsp = require('fs/promises');

// transcribe(
//   'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/jfk.wav'
// );

const filename = 'temp-record.wav';
const file = fs.createWriteStream(filename, { encoding: 'binary' });

const recording = record.record({
  sampleRate: 16000,
  verbose: false,
  recordProgram: 'sox',
  // stop recording after 3 seconds of silence?!??!?!
  // silence: '3.0',
});

setTimeout(() => {
  recording.stop();
}, 3000);

recording.stream().pipe(file);

file.on('close', async () => {
  await transcribe(filename);
});

// transcribe(filename);

async function transcribe(url) {
  const TransformersApi = Function('return import("@xenova/transformers")')();
  const { pipeline } = await TransformersApi;
  const whisper = await pipeline(
    'automatic-speech-recognition',
    'Xenova/whisper-tiny.en'
    // other options
    // https://huggingface.co/models?pipeline_tag=automatic-speech-recognition&library=transformers.js
  );
  const audio = await loadAudio(url);
  const output = await whisper(audio);
  console.log(output);
}

async function loadAudio(url) {
  // let buffer = Buffer.from(await fetch(url).then((x) => x.arrayBuffer()));
  // let wav = new wavefile.WaveFile(buffer);
  let buffer = await fsp.readFile(url);
  let wav = new wavefile.WaveFile(buffer);

  wav.toBitDepth('32f'); // Pipeline expects input as a Float32Array
  wav.toSampleRate(16000); // Whisper expects audio with a sampling rate of 16000
  let audioData = wav.getSamples();
  if (Array.isArray(audioData)) {
    if (audioData.length > 1) {
      const SCALING_FACTOR = Math.sqrt(2);
      // Merge channels (into first channel to save memory)
      for (let i = 0; i < audioData[0].length; ++i) {
        audioData[0][i] =
          (SCALING_FACTOR * (audioData[0][i] + audioData[1][i])) / 2;
      }
    }

    // Select first channel
    audioData = audioData[0];
    return audioData;
  }
}
