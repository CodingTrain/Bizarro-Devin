const { setStatusbarText } = require('../../../extension');
const State = require('../../../util/statemachine/State');
const { playSound } = require('../../../util/sound-effects');

class ThinkingState extends State {
  onActivate() {
    setStatusbarText('$(loading~spin) waiting for chunks...');
    this.stateMachine.webserver.sendStatus('thinking'); // state machine is our agent in this case
    playSound('thinking');
  }
}

module.exports = ThinkingState;
