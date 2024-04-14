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
  'typing-fast': join(__dirname, '../../sounds/faster_typing.mp3'),
  challenge: join(
    __dirname,
    '../../sounds/ES_Boxing Bell Ring 2 - SFX Producer.mp3'
  ),
};

let currentSound = null;
let looping = false;
let muted = false;

function playSound(sound, loop = false) {
  if (muted) return Promise.resolve();

  const filepath = sounds[sound];
  looping = loop;
  return new Promise((resolve, reject) => {
    function startSound() {
      currentSound = player.play(filepath, (err) => {
        if (err) {
          console.error('Failed to play:', err);
          reject(err);
        } else {
          if (looping && !muted) {
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

function toggleMuted() {
  muted = !muted;
  return muted;
}

module.exports = {
  // sounds,
  playSound,
  stopSound,
  toggleMuted,
};
