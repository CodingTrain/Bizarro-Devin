const { setStatusbarText } = require('../../../extension');
const State = require('../../../util/statemachine/State');

class TalkingState extends State {
  onActivate() {
    setStatusbarText('$(mic) Talking...');
    this.stateMachine.webserver.sendStatus('talking'); // state machine is our agent in this case
  }
}

module.exports = TalkingState;
