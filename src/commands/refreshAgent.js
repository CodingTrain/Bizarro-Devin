const Command = require('../lib/command');
const { getAgent } = require('../lib/agent/Agent');

class RefreshAgentCommand extends Command {
  constructor() {
    super('bizarro-devin.refreshAgent');
  }

  async run() {
    const agent = getAgent();
    await agent.refresh();
  }
}

module.exports = RefreshAgentCommand;
