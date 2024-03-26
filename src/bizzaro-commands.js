import vscode from 'vscode';

import { typeRealistically } from './util/realisticTyping.js';
import { speak } from './util/speak.js';
import { sleep } from './util/sleep.js';

import { script } from './script.js';

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
}


export async function createFiles() {
  const activeFolder = vscode.workspace.workspaceFolders?.[0];
  if (!activeFolder) {
    vscode.window.showInformationMessage('Open a folder first!');
    return;
  }

  const indexHtmlPath = vscode.Uri.joinPath(activeFolder.uri, 'index.html');
  const indexHtmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  
</body>
</html>`;

  await vscode.workspace.fs.writeFile(indexHtmlPath, new TextEncoder().encode(indexHtmlContent));
}


async function processStep(step, editor) {
  if (step.type === 'code') {
      await typeRealistically(editor, step.content.join('\n')); // Join the array of strings into a single string separated by newlines, more clear in terms of formatting than the template literal
  } else if (step.type === 'narrate') {
      await speak(step.content);
  }
}