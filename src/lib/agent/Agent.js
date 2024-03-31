const { typeRealistically } = require('../../util/realisticTyping');
const vscode = require('vscode');
const { getProvider } = require('./providers/providerInstance');
const { speak, speakSay } = require('../../util/speak');
class Agent {
  constructor() {
    this.editor = vscode.window.activeTextEditor;
    this.provider = getProvider();
    this.currentAction = null; //'SPEAK';

    // Queues for buffering the speed of the AI
    this.actionsQueue = [];

    this.lastCharactersList = '';

    this.processingQueue = false;
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

      // Anything before the action switch is the end of the previous action
      const previousActionContent = this.lastCharactersList.slice(
        0,
        actionSwitchIndex
      );
      this.addIntoQueue(previousAction, previousActionContent);

      // Anything after the action switch is the start of the new action, this should also take into account the length of the action switch message itself
      const newActionContent = this.lastCharactersList.slice(
        actionSwitchIndex + (this.currentAction === 'SPEAK' ? 7 : 8)
      );
      this.addIntoQueue(this.currentAction, newActionContent);

      // Reset the buffer
      this.lastCharactersList = nextIterationCharacters || '';
    } else {
      // If the action hasn't changed, we can just keep adding to the buffer
      this.addIntoQueue(this.currentAction, this.lastCharactersList);

      // Reset the buffer
      this.lastCharactersList = nextIterationCharacters || '';
    }
  }

  addIntoQueue(type, content) {
    this.actionsQueue.push({ type, content });
    if (!this.processingQueue) {
      this.processQueue();
    }
  }

  async processQueue() {
    console.log('Processing queue', this.actionsQueue);
    this.processingQueue = true;
    while (this.actionsQueue.length > 0) {
      const step = this.actionsQueue.shift();

      // If the step is a speaking step, we will grab all the speaking steps until the next editor step and combine them
      // this will sound more natural and less "chunky"
      if (step.type === 'SPEAK') {
        let combinedContent = step.content;
        while (this.actionsQueue.length > 0) {
          const nextStep = this.actionsQueue[0];
          if (nextStep.type === 'SPEAK') {
            combinedContent += nextStep.content;
            this.actionsQueue.shift();
          } else {
            break;
          }
        }
        step.content = combinedContent;
      }
      await this.processAction(step);
    }
    this.processingQueue = false;
  }

  async processAction(step) {
    console.log('Processing', step);
    if (!step.content) return;
    if (step.type === 'EDITOR') {
      await typeRealistically(this.editor, step.content);
    } else if (step.type === 'SPEAK') {
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
