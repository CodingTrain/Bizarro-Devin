const vscode = require('vscode');

const Command = require('../lib/command');
const {
  typeRealistically,
  typeImmediately,
} = require('../util/realisticTyping');
const { speak } = require('../util/speak');

// const { script } = require('../script');
const { prompts } = require('../prompt');

class RunAIAgentCommand extends Command {
  constructor() {
    super('bizarro-devin.runAIAgent');
  }

  // TODO: Receive a prompt to get started
  async run() {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showInformationMessage('Create a text file first!');
      return;
    }

    const startingPrompt = prompts.startingPrompt;
    query(startingPrompt, async (response) => {
      console.log(response);
      typeImmediately(editor, response.response);
    });
  }

  async processStep(step, editor) {
    if (step.type === 'code') {
      // Join the array of strings into a single string separated by newlines, more clear in terms of formatting than the template literal
      await typeRealistically(editor, step.content);
      // await typeRealistically(editor, step.content.join('\n'));
    } else if (step.type === 'narrate') {
      await speak(step.content);
    }
  }
}

function query(prompt, process) {
  const url = 'http://127.0.0.1:11434/api/generate';
  const data = {
    model: 'llama2',
    prompt,
  };
  streamResponse(url, data, process);
}

async function streamResponse(url, data, process) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const reader = response.body.getReader();
    let stream = new ReadableStream({
      async start(controller) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = new TextDecoder('utf-8').decode(value);
          try {
            const json = JSON.parse(chunk);
            process(json);
          } catch (error) {
            console.error('Error parsing chunk to JSON', error);
          }
          controller.enqueue(value);
        }
        controller.close();
        reader.releaseLock();
      },
    });
  } catch (error) {
    console.error('Failed to fetch:', error);
  }
}

module.exports = RunAIAgentCommand;
