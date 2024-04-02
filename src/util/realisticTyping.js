const { sleep } = require('./sleep');
const vscode = require('vscode');

const typeImmediately = async (editor, code) => {
  await editor.edit((editBuilder) => {
    editBuilder.insert(editor.selection.active, code);
  });
};

/**
 *
 * @param {vscode.TextEditor} editor
 * @param {*} code
 * @param {*} delay
 */
const typeRealistically = async (editor, code, delay = 50) => {
  for (let i = 0; i < code.length; i++) {
    const char = code.charAt(i);
    await editor.edit((editBuilder) => {
      editBuilder.insert(editor.selection.active, char);
    });
    if (char !== ' ') await sleep(delay);

    scrollToBottom(editor);
  }


  // // Insert newline
  // await editor.edit((editBuilder) => {
  //   editBuilder.insert(editor.selection.active, '\n');
  // });

  // // Format document
  // await vscode.commands.executeCommand('vscode.open', editor.document.uri);
  // await vscode.commands.executeCommand('editor.action.formatDocument');
};

const scrollToBottom = (editor) => {
  // Scroll to bottom of document where it's typing
  const position = new vscode.Position(
    editor.document.lineCount - 2,
    editor.selection.start.character
  );

  editor.revealRange(
    new vscode.Range(position, position),
    vscode.TextEditorRevealType.Default
  );
}

module.exports = {
  typeRealistically,
  typeImmediately,
};
