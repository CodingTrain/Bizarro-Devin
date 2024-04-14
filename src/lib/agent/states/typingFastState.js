const { setStatusbarText } = require('../../../extension');
const State = require('../../../util/statemachine/State');
const { playSound, stopSound } = require('../../../util/sound-effects');

class TypingFastState extends State {
  onActivate() {
    setStatusbarText('$(record-keys) Typing code...');
    this.stateMachine.webserver.sendStatus('typing'); // state machine is our agent in this case
    playSound('typing-fast', true);
  }

  onDeactivate() {
    stopSound();
  }
}

module.exports = TypingFastState;
