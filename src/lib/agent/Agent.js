import { speak } from '../../util/speak';

const {
  typeImmediately,
  typeRealistically,
} = require('../../util/realisticTyping');
const vscode = require('vscode');
const { getProvider } = require('./providers/providerInstance');

class Agent {
  constructor() {
    this.editor = vscode.window.activeTextEditor;
    this.provider = getProvider();
    this.currentAction = 'SPEAK';

    // Queues for buffering the speed of the AI
    this.actionsQueue = [];

    this.lastCharactersList = '';
  }

  /**
   * Prompt something to the AI
   * @param {string} input The prompt to be processed
   */
  prompt(input) {
    this.provider.queryStream(input, (response) =>
      this.consumeStream(response)
    );
  }

  async consumeStream(response) {
    const text = response.response;

    // Check if last character of received text is a space, period or newline
    const isEndOfSentence =
      text.slice(-1) === ' ' ||
      text.slice(-1) === '.' ||
      text.slice(-1) === '\n';

    // We will need to store the latest 30 characters to check for the action starts
    this.lastCharactersList += text;
    if (this.lastCharactersList.length < 30) {
      return; // Wait for the buffer to fill up
    }

    let nextIterationCharacters = null;

    // Walk back to the last space, period or newline. This is to prevent cutting off words
    if (!isEndOfSentence) {
      let i = this.lastCharactersList.length - 1;
      while (i >= 0) {
        if (
          this.lastCharactersList[i] === ' ' ||
          this.lastCharactersList[i] === '.' ||
          this.lastCharactersList[i] === '\n'
        ) {
          break;
        }
        i--;
      }

      // If we found a space, period or newline, we can cut off the string there
      if (i >= 0) {
        nextIterationCharacters = this.lastCharactersList.slice(i + 1);
        this.lastCharactersList = this.lastCharactersList.slice(0, i + 1);
      } else {
        // If we didn't find a space, period or newline, we can't cut off the string
        // We will have to wait for the next chunk of text
        return;
      }
    }

    // If we have reached the end of a sentence, we can process the buffer
    let previousAction = this.currentAction;

    // Check if the action has changed
    if (this.lastCharactersList.includes('[SPEAK]')) {
      this.currentAction = 'SPEAK';
    }
    if (this.lastCharactersList.includes('[EDITOR]')) {
      this.currentAction = 'EDITOR';
    }

    if (previousAction !== this.currentAction) {
      // Find the index of the action switch
      const actionSwitchIndex = this.lastCharactersList.lastIndexOf(
        this.currentAction === 'SPEAK' ? '[SPEAK]' : '[EDITOR]'
      );

      // Anything after the action switch is the start of the new action, this should also take into account the length of the action switch message itself
      const newActionContent = this.lastCharactersList.slice(
        actionSwitchIndex + (this.currentAction === 'SPEAK' ? 7 : 8)
      );

      // Anything before the action switch is the end of the previous action
      const previousActionContent = this.lastCharactersList.slice(
        0,
        actionSwitchIndex
      );

      if (previousAction === 'SPEAK') {
        this.actionsQueue.push({
          type: 'narrate',
          content: previousActionContent,
        });
      } else {
        this.actionsQueue.push({
          type: 'code',
          content: previousActionContent,
        });
      }

      if (this.currentAction === 'SPEAK') {
        this.actionsQueue.push({
          type: 'narrate',
          content: newActionContent,
        });
      } else {
        this.actionsQueue.push({
          type: 'code',
          content: newActionContent,
        });
      }

      // Reset the buffer
      this.lastCharactersList = nextIterationCharacters || '';
      return;
    }

    // If the action hasn't changed, we can just keep adding to the buffer
    if (this.currentAction === 'SPEAK') {
      this.actionsQueue.push({
        type: 'narrate',
        content: this.lastCharactersList,
      });
    } else {
      this.actionsQueue.push({
        type: 'code',
        content: this.lastCharactersList,
      });
    }

    // Reset the buffer
    this.lastCharactersList = nextIterationCharacters || '';
  }

  async processStep(step, editor) {
    if (step.type === 'code') {
      await typeRealistically(editor, step.content);
    } else if (step.type === 'narrate') {
      await speak(step.content);
    }
  }
}

// Singleton instance of the agent
let agent = null;

/**
 * Get the agent instance
 * @returns {Agent} The agent instance
 */
const getAgent = () => {
  if (!agent) {
    agent = new Agent();
  }
  return agent;
};

module.exports = { getAgent };
