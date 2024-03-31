const player = require('play-sound')();
const fs = require('fs/promises');
const path = require('path');

async function speak(txt) {
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

module.exports = {
  speak,
};
