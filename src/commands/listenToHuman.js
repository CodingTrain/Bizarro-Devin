const { getAgent } = require('../lib/agent/Agent');
const wavefile = require('wavefile');
const record = require('node-record-lpcm16');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const Command = require('../lib/command');
const { setStatusbarText } = require('../extension');

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

class ListenToHumanCommand extends Command {
  constructor() {
    super('bizarro-devin.listenToHuman');
    this.listening = false;
    this.recording = null;
    this.filename = 'temp-record.wav';
  }

  async run() {
    if (!this.listening) {
      this.startListening();
    } else {
      this.stopListening();
    }
  }

  startListening() {
    const file = fs.createWriteStream(
      path.join(__dirname, '../../', this.filename),
      { encoding: 'binary' }
    );
    this.recording = record.record({
      sampleRate: 16000,
      verbose: false,
      recordProgram: 'sox',
    });
    this.recording.stream().pipe(file);
    setStatusbarText('$(unmute) Currently listening');
    this.listening = true;
  }

  async stopListening() {
    this.recording.stop();
    const agent = getAgent();
    agent.webserver.sendStatus('thinking');

    // this.statusBarItem.text = '$(mute) Not listening';
    setStatusbarText('$(loading~spin) Transcribing...');
    let output = await transcribe(
      path.join(__dirname, '../../', this.filename)
    );
    this.listening = false;
    const startingPrompt = output.text;
    agent.prompt(startingPrompt);
  }
}

async function transcribe(url) {
  const whisper = await MyTranscriptionPipeline.getInstance();
  const audio = await read_audio(url);
  const output = await whisper(audio);
  console.log(`Transcribed:`, output);
  return output;
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
