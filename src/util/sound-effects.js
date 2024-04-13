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

let currentSound = null;
let looping = false;

function playSound(sound) {
  const filepath = sounds[sound];
  return new Promise((resolve, reject) => {
    function startSound() {
      currentSound = player.play(filepath, (err) => {
        if (err) {
          console.error('Failed to play:', err);
          reject(err);
        } else {
          if (looping) {
            startSound();
          } else {
            // Hanging on this, not sure why
            // fs.unlinkSync(tempFilePath);
            resolve();
          }
        }
      });
    }
    startSound();
  });
}

function stopSound() {
  if (currentSound && looping) {
    currentSound.kill();
    looping = false;
  }
}

module.exports = {
  // sounds,
  playSound,
  stopSound,
};
