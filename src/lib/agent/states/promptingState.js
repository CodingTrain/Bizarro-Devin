const { setStatusbarText } = require('../../../extension');
const State = require('../../../util/statemachine/state');

class PromptingState extends State {
  onActivate() {
    setStatusbarText('$(loading~spin) Prompting model...');
    this.stateMachine.webserver.sendStatus('thinking'); // state machine is our agent in this case
  }
}

module.exports = PromptingState;
