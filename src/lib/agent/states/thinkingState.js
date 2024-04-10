const { setStatusbarText } = require('../../../extension');
const State = require('../../../util/statemachine/state');

class ThinkingState extends State {
  onActivate() {
    setStatusbarText('$(loading~spin) waiting for chunks...');
    this.stateMachine.webserver.sendStatus('thinking'); // state machine is our agent in this case
  }
}

module.exports = ThinkingState;
