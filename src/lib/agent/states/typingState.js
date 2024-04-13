const { setStatusbarText } = require('../../../extension');
const State = require('../../../util/statemachine/State');
const { playSound } = require('../../../util/sound-effects');

class TypingState extends State {
  onActivate() {
    setStatusbarText('$(record-keys) Typing code...');
    this.stateMachine.webserver.sendStatus('typing'); // state machine is our agent in this case
    playSound('typing');
  }
}

module.exports = TypingState;
