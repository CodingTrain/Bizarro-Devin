const { setStatusbarText } = require('../../../extension');
const State = require('../../../util/statemachine/state');

class IdleState extends State {
  onActivate() {
    setStatusbarText('$(circle-slash) Awaiting input');
    this.stateMachine.webserver.sendStatus('pending'); // state machine is our agent in this case
  }
}

module.exports = IdleState;
