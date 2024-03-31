// const { getAgent } = require('../lib/agent/Agent');

const wavefile = require('wavefile');
const record = require('node-record-lpcm16');
const fs = require('fs');
const fsp = require('fs/promises');

// const vscode = require('vscode');
const Command = require('../lib/command');

class MyTranscriptionPipeline {
  static task = 'automatic-speech-recognition';

  // other options
  // https://huggingface.co/models?pipeline_tag=automatic-speech-recognition&library=transformers.js
  static model = 'Xenova/whisper-tiny.en';
  static quantized = false;

  static instance = null;

  static async getInstance() {
    if (!this.instance) {
      // Dynamically import the Transformers.js library
      let { pipeline, env } = await import('@xenova/transformers');

      this.instance = pipeline(this.task, this.model, {
        quantized: this.quantized,
      });
    }

    return this.instance;
  }
}

let recording = undefined;

class ListenToHumanCommand extends Command {
  constructor() {
    super('bizarro-devin.listenToHuman');
    this.listening = false;
  }

  async run() {
    console.log(__dirname);
    const filename = 'temp-record.wav';
    if (!this.listening) {
      const file = fs.createWriteStream(filename, { encoding: 'binary' });
      recording = record.record({
        sampleRate: 16000,
        verbose: false,
        recordProgram: 'sox',
      });
      recording.stream().pipe(file);
      console.log('starting listening');
      this.listening = true;
      setTimeout(() => {
        recording.stop();
        console.log('stopped listening');
      }, 3000);
    } else {
      console.log('stopping listening');
      recording.stop();
      this.listening = false;
      //transcribe(filename);
    }
  }
}

async function transcribe(url) {
  const whisper = await MyTranscriptionPipeline.getInstance();
  const audio = await read_audio(url);
  const start = performance.now();
  const output = await whisper(audio);
  const end = performance.now();
  console.log(`Transcription took ${Math.round(end - start) / 1000} seconds.`);
  console.log(output);
}
async function read_audio(file) {
  let buffer = await fsp.readFile(file);
  let wav = new wavefile.WaveFile(buffer);

  wav.toBitDepth('32f');
  wav.toSampleRate(16000);
  let audioData = wav.getSamples();

  if (Array.isArray(audioData)) {
    // Stereo
    const SCALING_FACTOR = Math.sqrt(2);
    for (let i = 0; i < audioData[0].length; ++i) {
      audioData[0][i] =
        (SCALING_FACTOR * (audioData[0][i] + audioData[1][i])) / 2;
    }
    audioData = audioData[0]; // Use the merged channel
    return audioData;
  } else {
    // Mono
    return audioData;
  }
}

module.exports = ListenToHumanCommand;
