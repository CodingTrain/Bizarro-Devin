const player = require('play-sound')();
const fs = require('fs');

speak('hello');

async function speak(txt) {
  // tts-server --model_name tts_models/en/ljspeech/vits
  const response = await fetch(
    `http://localhost:5002/api/tts?text=${txt}&speaker_id=&style_wav=&language_id=`
  );
  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();
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
