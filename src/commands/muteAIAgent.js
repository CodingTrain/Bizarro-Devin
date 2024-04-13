const Command = require('../lib/command');
const vscode = require('vscode');
const { toggleMuted, stopSound } = require('../util/sound-effects');

class MuteAIAgentCommand extends Command {
  constructor() {
    super('bizarro-devin.muteAIAgent');
  }

  load(context) {
    // Include context status item
    this.contextStatusItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      -999
    );
    this.contextStatusItem.text = '$(unmute) Sounds enabled';
    this.contextStatusItem.show();
    context.subscriptions.push(this.contextStatusItem);
  }

  async run() {
    const mutedValue = toggleMuted();
    this.contextStatusItem.text = mutedValue
      ? '$(mute) Sounds disabled'
      : '$(unmute) Sounds enabled';
    stopSound();
  }
}

module.exports = MuteAIAgentCommand;
