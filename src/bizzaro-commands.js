import vscode from 'vscode';

import { speak } from './util/speak.js';
import { sleep } from './util/sleep.js';

import { script } from './script.js';

import createFile from './util/createFile.js';
import { typeRealistically } from './util/realisticTyping.js';


export async function setupP5js() {
  await createFiles();
  await setupLayout();
  await runAIAgent();
}


export async function setupLayout() {
  // TODO: CREATE index.html and sketch.js
  // Run live server
  // Also, set up the window panes properly

  // get active text editor
  let editor = vscode.window.activeTextEditor;
  if (!editor) {
      vscode.window.showInformationMessage('Create a text file first!');
      return; // No open text editor
  }

  // Open live preview
  await vscode.commands.executeCommand('livePreview.start');

  // Wait a second for the window to at least open
  while (vscode.window.tabGroups.all.length < 2) {
      await sleep(50);
  }

  // Toggle row layout
  await vscode.commands.executeCommand(
      'workbench.action.toggleEditorGroupLayout'
  );

  // Set this tab as our active tab again (weird workaround to make sure the next command works)
  await vscode.commands.executeCommand('vscode.open', editor.document.uri);

  // Move code editor to the bottom
  await vscode.commands.executeCommand(
      'workbench.action.moveActiveEditorGroupDown'
  );
}
// TODO: Receive a prompt to get started
export async function runAIAgent() {
  let editor = vscode.window.activeTextEditor;
  if (!editor) {
      vscode.window.showInformationMessage('Create a text file first!');
      return; // No open text editor
  }

  // Iterate through each step
  for (const step of script) {
      await processStep(step, editor);
  }
  async function processStep(step, editor) {
    if (step.type === 'code') {
        await typeRealistically(editor, step.content.join('\n')); // Join the array of strings into a single string separated by newlines, more clear in terms of formatting than the template literal
    } else if (step.type === 'narrate') {
        await speak(step.content);
    }
  }
}


export async function createFiles() {
  await createIndexHtml();
  await createSketchJs();
}

const createIndexHtml = async() => await createFile('index.html', 
`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  
</body>
</html>`);
const createSketchJs = async() => await createFile('sketch.js',"",{show : true});