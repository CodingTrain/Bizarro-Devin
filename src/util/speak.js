const player = require('play-sound')();
const fs = require('fs/promises');
const path = require('path');
const say = require('say');
const config = require('../../config');

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

const speakFunctions = {
  coqui: speakCoqui,
  piper: speakPiper,
  say: speakSay,
};

const speak = speakFunctions[config.tts];

module.exports = {
  speak,
};
