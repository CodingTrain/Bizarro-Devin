const StateMachine = require('../../util/statemachine/StateMachine');
const { SocketServer } = require('../web/webserver');
const { applyDiffs } = require('../../util/realisticTyping');
const vscode = require('vscode');
const { Provider } = require('./providers/providerInstance');
const { speak } = require('../../util/speak');
const Diff = require('diff');
const { query: queryForContext } = require('../../util/semantic-retrieval');
const { playSound } = require('../../util/sound-effects');

// States
const IdleState = require('./states/IdleState');
const PromptingState = require('./states/promptingState');
const WritingState = require('./states/writingState');
const ThinkingState = require('./states/thinkingState');
const TalkingState = require('./states/talkingState');

class Agent extends StateMachine {
  constructor() {
    super();

    // Registering states
    this.addState(new IdleState(this));
    this.addState(new PromptingState(this));
    this.addState(new WritingState(this));
    this.addState(new ThinkingState(this));
    this.addState(new TalkingState(this));

    this.provider = new Provider();
    this.currentAction = 'SPEAK';

    // Queues for buffering the speed of the AI
    this.actionsQueue = [];
    this.lastCharactersList = '';
    this.processingQueue = false;
    this.promptingTemplate =
      'Dan says: {prompt}\nCurrent code in the editor:\n```\n{currentCode}\n```';
    this.promptingWithContextTemplate =
      'Dan says: {prompt}\nAdditional context you can use from most relevant to less relevant:\n{context}\n\nCurrent code in the editor:\n```\n{currentCode}\n```';
    this.isStreaming = false;
    this.includeContextFromEmbeddings = true;

    this.webserver = new SocketServer();
    this.webserver.start();
  }

  /**
   * Prompt something to the AI
   * @param {string} input The prompt to be processed
   */
  async prompt(input) {
    if (this.isStreaming || this.actionsQueue.length > 0) {
      return vscode.window.showErrorMessage(
        'Please wait for the current prompt to finish processing before sending another one.'
      );
    }
    const editor = vscode.window.visibleTextEditors[0];

    let prompt;
    if (this.includeContextFromEmbeddings) {
      // Get context form embeddings
      const context = await queryForContext(input);
      prompt = this.promptingWithContextTemplate
        .replace('{prompt}', input)
        .replace(
          '{context}',
          context.map((item) => `- ${item.text}`).join('\n')
        )
        .replace('{currentCode}', editor.document.getText());
    } else {
      prompt = this.promptingTemplate
        .replace('{prompt}', input)
        .replace('{currentCode}', editor.document.getText());
    }

    console.log('Prompting', prompt);

    this.isStreaming = true;
    this.goToState('prompting');

    this.provider
      .queryStream(prompt, (response) => this.consumeStream(response))
      .then((out) => {
        this.isStreaming = false;

        // If there are still chunks in our queue, try to process them
        if (!this.processingQueue && this.actionsQueue.length > 0) {
          this.processQueue();
        }

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

    // Make sure we have enough characters to process the next action
    if (this.lastCharactersList.length < 30 && event !== 'done') {
      return;
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
      // The chance of this actually happening is very low but we should account for it.
      // It could in theory still break if there are 3 or more ``` in a single chunk of text
      // or if there are multiple ``` in the final chunk sent. This is a very rare edge case so we just ignore it
      if (this.lastCharactersList.split('```').length > 2) {
        const cutOffIndex = this.lastCharactersList.lastIndexOf('```');
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
      // If the action hasn't changed, we can just keep adding into the queue of our current action
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

      // If the step is a speaking step, we have to make sure that the upcoming speaking steps are the whole chunk of text.
      // We can do this by combining all the speaking steps until the next editor step and combining them. Unless the final step is
      // a speaking step and the stream is finished in which case we can just process until the final speaking step.
      if (step.type === 'SPEAK') {
        let combinedContent = step.content;
        let hasFoundEditingStep = false;
        while (this.actionsQueue.length > 0) {
          const nextStep = this.actionsQueue[0];
          if (nextStep.type === 'SPEAK') {
            combinedContent += nextStep.content;
            this.actionsQueue.shift();
          } else {
            hasFoundEditingStep = true;
            break;
          }
        }

        // If we haven't found a editing step and we are still streaming text, we need to wait for the next chunk of text
        if (!hasFoundEditingStep && this.isStreaming) {
          this.actionsQueue.unshift({
            type: 'SPEAK',
            content: combinedContent,
          });
          this.goToState('thinking'); // Let the user know we are still processing
          break;
        }

        step.content = combinedContent;
      }

      // Same idea as the speaking steps, combine all until the next speaking step unless the stream has ended.
      if (step.type === 'EDITOR') {
        let combinedContent = step.content;
        let hasFoundSpeakingStep = false;
        while (this.actionsQueue.length > 0) {
          const nextStep = this.actionsQueue[0];
          if (nextStep.type === 'EDITOR') {
            combinedContent += nextStep.content;
            this.actionsQueue.shift();
          } else {
            hasFoundSpeakingStep = true;
            break;
          }
        }

        // If we haven't found a speaking step and we are still streaming code, we need to wait for the next chunk of code
        if (!hasFoundSpeakingStep && this.isStreaming) {
          this.actionsQueue.unshift({
            type: 'EDITOR',
            content: combinedContent,
          });
          this.goToState('thinking'); // Let the user know we are still processing
          break;
        }

        step.content = combinedContent;
      }

      await this.processAction(step);
    }
    this.processingQueue = false;

    // If we have reached the end of the queue and are no longer streaming, we can let the user know
    // that the agent is idle, we cannot always send this because we might break the loop if we are waiting for a next chunk
    // in which case we are thinking, not idle
    if (!this.isStreaming) {
      this.goToState('idle');
    }
  }

  async processAction(step) {
    console.log('Processing', step);
    if (!step.content) return;
    if (step.type === 'EDITOR') {
      playSound('typing');
      const editor = vscode.window.visibleTextEditors[0];
      const currentEditorCode = editor.document
        .getText()
        .replace(/\r\n/g, '\n');
      const diffs = Diff.diffWordsWithSpace(currentEditorCode, step.content);

      this.goToState('writing');
      await applyDiffs(editor, diffs);
    } else if (step.type === 'SPEAK') {
      let content = step.content.trim();
      if (!content) return;

      if (speak.length === 2) {
        // It supports a callback function that gets called when it actually starts talking
        await speak(content, () => {
          this.goToState('talking');
          this.webserver.sendCaption({ status: 'start', content: content });
        });
      } else {
        this.goToState('talking');
        this.webserver.sendCaption({ status: 'start', content: content });
        await speak(content);
      }

      this.webserver.sendCaption({ status: 'end' });
    }
    this.previousAction = step.type;
  }

  async refresh() {
    this.provider = new Provider();

    const editor = vscode.window.visibleTextEditors[0];
    editor.edit((editBuilder) => {
      editBuilder.delete(
        new vscode.Range(
          new vscode.Position(0, 0),
          new vscode.Position(editor.document.lineCount, 0)
        )
      );
    });
  }

  onActivate() {
    this.goToState('idle');
  }
}

// Singleton instance of the agent
let agent = new Agent();
agent.activate();

/**
 * Get the agent instance
 * @returns {Agent} The agent instance
 */
const getAgent = () => {
  return agent; // To avoid breaking everything i'm just doing this.
};

module.exports = { getAgent };
