const State = require('./State');

class StateMachine extends State {
  constructor() {
    super();
    this.states = [];

    /** @type {State} */
    this.activeState = null;
  }

  /**
   * Add a state to the state machine
   * @param {State} state
   */
  addState(state) {
    if (!(state instanceof State)) {
      throw new Error('StateMachine: State must be an instance of State');
    }

    state.stateMachine = this;
    this.states.push(state);
  }

  /**
   * Switch the active state to a new state
   * @param {String} stateName The name of the state to go to
   */
  goToState(stateName) {
    const state = this.states.find(
      (s) =>
        s.constructor.name.toLowerCase().replace('state', '') ===
        stateName.toLowerCase()
    );
    if (!state) throw new Error(`StateMachine: State ${stateName} not found`);

    // Ignore if we are already in this state
    if (this.activeState === state) return;

    if (this.activeState !== null) {
      this.activeState.deactivate();
    }

    this.activeState = state;
    this.activeState.activate();
  }
}

module.exports = StateMachine;
