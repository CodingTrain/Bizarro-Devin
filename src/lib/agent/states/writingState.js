const { setStatusbarText } = require('../../../extension');
const State = require('../../../util/statemachine/state');

class WritingState extends State {
  onActivate() {
    setStatusbarText('$(record-keys) Writing code...');
    this.stateMachine.webserver.sendStatus('writing'); // state machine is our agent in this case
  }
}

module.exports = WritingState;
