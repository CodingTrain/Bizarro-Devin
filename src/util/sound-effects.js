const player = require('play-sound')();
const { join } = require('path');

let sounds = {
  thinking: join(
    __dirname,
    '../../sounds/ES_Computer Tone 3 - SFX Producer.mp3'
  ),
  typing: join(
    __dirname,
    '../../sounds/ES_Keyboard Typing 3 - SFX Producer.mp3'
  ),
  challenge: join(
    __dirname,
    '../../sounds/ES_Boxing Bell Ring 2 - SFX Producer.mp3'
  ),
};

function playSound(sound) {
  const filepath = sounds[sound];
  return new Promise((resolve, reject) => {
    player.play(filepath, (err) => {
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
  // sounds,
  playSound,
};
