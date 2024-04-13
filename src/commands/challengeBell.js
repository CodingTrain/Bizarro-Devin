const Command = require('../lib/command');
const { playSound } = require('../util/sound-effects');

class ChallengeBell extends Command {
  constructor() {
    super('bizarro-devin.challengeBell');
  }

  async run() {
    playSound('challenge', false);
  }
}

module.exports = ChallengeBell;
