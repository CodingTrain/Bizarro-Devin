/** @abstract */
class State {
  constructor(stateMachine) {
    this.stateMachine = stateMachine;
  }

  activate() {
    if (this.isActive) return;
    this.isActive = true;

    this.onPreActivate();
    this.onActivate();
  }

  deactivate() {
    if (!this.isActive) return;
    this.onPreDeactivate();
    this.onDeactivate();
    this.onLateDeactivate();
    this.isActive = false;
  }

  onPreActivate() {}

  /** @abstract */
  onActivate() {}

  onPreDeactivate() {}

  /** @abstract */
  onDeactivate() {}

  onLateDeactivate() {}
}

module.exports = State;
