const { setStatusbarText } = require('../../../extension');
const State = require('../../../util/statemachine/State');
const { playSound, stopSound } = require('../../../util/sound-effects');

class ThinkingState extends State {
  onActivate() {
    setStatusbarText('$(loading~spin) waiting for chunks...');
    this.stateMachine.webserver.sendStatus('thinking'); // state machine is our agent in this case
    playSound('thinking', true);
  }

  onDeactivate() {
    stopSound();
  }
}

module.exports = ThinkingState;
