const { SocketServer } = require('../web/webserver');
const { typeRealistically } = require('../../util/realisticTyping');
const vscode = require('vscode');
const { getProvider } = require('./providers/providerInstance');
const { speak } = require('../../util/speak');

class Agent {
  constructor() {
    this.provider = getProvider();
    this.currentAction = 'SPEAK';

    // Queues for buffering the speed of the AI
    this.actionsQueue = [];
    this.lastCharactersList = '';
    this.processingQueue = false;
    this.isNewPrompt = false;
    this.promptingTemplate =
      'Dan says: {prompt}\nCurrent code in the editor:\n```\n{currentCode}\n```';
    this.errorPromptingTemplate =
      'It appears like you have made some errors in the code. Please fix them. The errors are as follows:\n{errors}\nCurrent code in the editor:\n```\n{currentCode}\n```';
    this.isStreaming = false;

    this.receivedErrorList = [];
    this.ignoreErrors = false;

    this.webserver = new SocketServer(this);
    this.webserver.start();
  }

  /**
   * Prompt something to the AI
   * @param {string} input The prompt to be processed
   */
  prompt(input) {
    if (this.isStreaming || this.actionsQueue.length > 0) {
      return vscode.window.showErrorMessage(
        'Please wait for the current prompt to finish processing before sending another one.'
      );
    }

    const editor = vscode.window.activeTextEditor;
    const prompt = this.promptingTemplate
      .replace('{prompt}', input)
      .replace('{currentCode}', editor.document.getText());

    this.processPrompt(prompt);
  }

  processPrompt(prompt) {
    this.isNewPrompt = true;
    this.isStreaming = true;
    this.provider
      .queryStream(prompt, (response) => this.consumeStream(response))
      .then((out) => {
        this.isStreaming = false;
        this.receivedErrorList = []; // Reset the error list
        if (out.blocked) {
          vscode.window.showErrorMessage(`Prompt blocked: ${out.blockReason}`);
        }
      });
  }

  consumeStream(response) {
    const text = response.response;
    const event = response.event;

    // Check if last character of received text is a space, period or newline
    const isEndOfSentence = [' ', '.', '\n'].includes(text.slice(-1));

    // We will need to store the latest 30 characters to check for the action starts
    this.lastCharactersList += text;

    // if (event === 'done') {
    //   // If the stream is done, we need to process the remaining buffer
    //   this.addIntoQueue(this.currentAction, this.lastCharactersList);
    //   this.lastCharactersList = '';
    //   return;
    // }

    if (this.lastCharactersList.length < 30 && event !== 'done') {
      return; // Wait for the buffer to fill up
    }

    let nextIterationCharacters = null;

    // Walk back to the last space, period or newline. This is to prevent cutting off words
    if (!isEndOfSentence && event !== 'done') {
      let i = this.lastCharactersList.length - 1;
      while (i >= 0) {
        if ([' ', '.', '\n'].includes(this.lastCharactersList[i])) {
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

      // If current batch of characters has multiple ```, then we can cut off the string early, so as to only process one ``` at a time
      if (this.lastCharactersList.split('```').length > 2) {
        const cutOffIndex = this.lastCharactersList.indexOf('```');
        nextIterationCharacters =
          this.lastCharactersList.slice(cutOffIndex) + nextIterationCharacters;
        this.lastCharactersList = this.lastCharactersList.slice(0, cutOffIndex);
      }
    }

    // If we have reached the end of a sentence, we can process the buffer
    let previousAction = this.currentAction;

    // Check if the action has changed
    if (this.lastCharactersList.includes('```')) {
      this.currentAction = previousAction === 'SPEAK' ? 'EDITOR' : 'SPEAK';
    }

    if (previousAction !== this.currentAction) {
      // Find the index of the action switch
      const actionSwitchIndex = this.lastCharactersList.lastIndexOf('```');

      // Anything before the action switch is the end of the previous action
      const previousActionContent = this.lastCharactersList.slice(
        0,
        actionSwitchIndex
      );
      this.addIntoQueue(previousAction, previousActionContent);

      // Anything after the action switch is the start of the new action, this should also take into account the length of the action switch message itself
      const newActionContent = this.lastCharactersList.slice(
        actionSwitchIndex + 3
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
    // console.log('Processing queue', this.actionsQueue);
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
    if (!this.isStreaming) {
      this.webserver.broadcastReload(); // Trigger a browser reload for the errors to appear
    }
  }

  async processAction(step) {
    console.log('Processing', step);
    if (!step.content) return;
    if (step.type === 'EDITOR') {
      const editor = vscode.window.activeTextEditor;
      if (this.isNewPrompt) {
        // Wipe the current editor
        await editor.edit((editBuilder) => {
          editBuilder.delete(
            new vscode.Range(
              new vscode.Position(0, 0),
              new vscode.Position(
                editor.document.lineCount + 1,
                editor.document.lineAt(
                  editor.document.lineCount - 1
                ).text.length
              )
            )
          );
        });
        this.isNewPrompt = false;
      }

      await typeRealistically(editor, step.content);
    } else if (step.type === 'SPEAK') {
      await speak(step.content);
    }
  }

  async receiveBrowserMessage(message) {
    // If the AI is still streaming a response, we want to ignore all incoming messages.
    // This is because we cannot be certain the code is in a 'finished' state as it can still be writing code.
    if (this.isStreaming || this.actionsQueue.length > 0 || this.ignoreErrors) {
      return;
    }

    // Add formatted message to the error list
    if (message.type === 'error') {
      this.receivedErrorList.push(
        `${message.data.msg} at line ${message.data.lineNumber} and column ${message.data.columnNo}`
      );
    }

    console.log('Received error!');
    // Schedule a timeout if there isn't one, replace the existing timeout if there is one
    if (this.errorTimeout) {
      console.log('Cleared previous timeout');
      clearTimeout(this.errorTimeout);
    }

    this.errorTimeout = setTimeout(() => {
      this.triggerErrorResponse();
    }, 1000);
    console.log('Set new timeout with id ' + this.errorTimeout);
  }

  async triggerErrorResponse() {
    // Supply a prompt to the AI to respond to the errors
    const prompt = this.errorPromptingTemplate
      .replace(
        '{errors}',
        this.receivedErrorList.map((error) => '- ' + error).join('\n')
      )
      .replace(
        '{currentCode}',
        vscode.window.activeTextEditor.document.getText()
      );
    console.log('Triggering error response!', prompt);

    this.processPrompt(prompt);
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
