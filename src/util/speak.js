const player = require('play-sound')();
const fs = require('fs/promises');
const path = require('path');
const say = require('say');
const config = require('../../config');
const Speaker = require('speaker');
const { ElevenLabsClient, play: playElevenLabs } = require('elevenlabs');
const playHT = require('playht');

async function speakCoqui(txt) {
  // tts-server --model_name tts_models/en/ljspeech/vits
  const response = await fetch(
    `http://localhost:5002/api/tts?text=${txt}&speaker_id=&style_wav=&language_id=`
  );
  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const tempFilePath = path.join(__dirname, '../../', 'temp_audio.wav');
  await fs.writeFile(tempFilePath, buffer);
  await play(tempFilePath);
}

async function speakPiper(txt) {
  // python3 -m piper.http_server --model en_GB-alan-medium.onnx --port 5001
  const response = await fetch(`http://127.0.0.1:5001/?text=${txt}`);
  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const tempFilePath = path.join(__dirname, '../../', 'temp_audio.wav');
  await fs.writeFile(tempFilePath, buffer);
  await play(tempFilePath);
}

function play(tempFilePath) {
  return new Promise((resolve, reject) => {
    player.play(tempFilePath, (err) => {
      if (err) {
        console.error('Failed to play:', err);
        reject(err);
      } else {
        // console.log('Audio playback finished.');
        // Hanging on this, not sure why
        // fs.unlinkSync(tempFilePath);
        resolve();
      }
    });
  });
}

const speakSay = async (text) => {
  return new Promise((resolve) => {
    say.speak(text, null, 1, (err) => {
      if (err) {
        console.error(err);
        resolve(); // If we reject here we'd have to still capture the rejection in the caller, but it's not like we are going to actually do something with the error anyways
      }
      resolve();
    });
  });
};

const speakElevenLabs = async (text) => {
  return new Promise(async (resolve) => {
    const speaker = new Speaker({
      channels: 1,
      bitDepth: 16,
      sampleRate: config.elevenLabs.sampleRate,
    });

    const elevenLabs = new ElevenLabsClient({
      apiKey: config.elevenLabs.apiKey,
    });
    const stream = await elevenLabs.generate({
      stream: true,
      voice: config.elevenLabs.voiceId,
      text: text,
      model_id: config.elevenLabs.model,
      output_format: config.elevenLabs.outputFormat,
    });

    stream.pipe(speaker);
    speaker.on('close', () => resolve());
  });
};

const speakElevenLabsSync = async (text, onStartTalking) => {
  return new Promise(async (resolve, reject) => {
    const elevenLabs = new ElevenLabsClient({
      apiKey: config.elevenLabs.apiKey,
    });
    const audio = await elevenLabs.generate({
      voice: config.elevenLabs.voiceId,
      text: text,
      model_id: config.elevenLabs.model,
    });

    onStartTalking();
    await playElevenLabs(audio);
    resolve();
  });
};

const speakPlayht = async (text) => {
  return new Promise(async (resolve) => {
    playHT.init({
      apiKey: config.playHT.secret,
      userId: config.playHT.userId,
    });

    const streamingOptions = {
      voiceEngine: 'PlayHT2.0-turbo',
      voiceId:
        's3://voice-cloning-zero-shot/d6c00308-54a8-4e18-83d0-855892508cd8/original/manifest.json',
      sampleRate: 44100,
      outputFormat: 'wav',
      speed: 1,
    };

    const stream = await playHT.stream(text, streamingOptions);
    const speaker = new Speaker({
      channels: 1,
      bitDepth: 16,
      sampleRate: 44100,
    });
    stream.pipe(speaker);
    stream.on('end', () => resolve());
  });
};

const speakFunctions = {
  coqui: speakCoqui,
  piper: speakPiper,
  say: speakSay,
  elevenlabs: speakElevenLabs,
  elevenlabsSync: speakElevenLabsSync,
  playht: speakPlayht,
};

const speak = speakFunctions[config.tts];

module.exports = {
  speak,
};
