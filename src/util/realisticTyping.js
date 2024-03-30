const { sleep } = require('./sleep');
const vscode = require('vscode');

const typeImmediately = async (editor, code) => {
  await editor.edit((editBuilder) => {
    editBuilder.insert(editor.selection.active, code);
  });
};

const typeRealistically = async (editor, code, delay = 100) => {
  for (let i = 0; i < code.length; i++) {
    const char = code.charAt(i);
    await editor.edit((editBuilder) => {
      editBuilder.insert(editor.selection.active, char);
    });
    if (char !== ' ') await sleep(delay);
  }
  // Insert newline
  await editor.edit((editBuilder) => {
    editBuilder.insert(editor.selection.active, '\n');
  });

  // Format document
  await vscode.commands.executeCommand('vscode.open', editor.document.uri);
  await vscode.commands.executeCommand('editor.action.formatDocument');
};

module.exports = {
  typeRealistically,
  typeImmediately,
};
