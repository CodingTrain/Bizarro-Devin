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

function scrollToBottom(editor) {
  // Scroll to bottom of document where it's typing
  const position = new vscode.Position(
    editor.document.lineCount - 1,
    editor.selection.start.character
  );

  editor.revealRange(
    new vscode.Range(position, position),
    vscode.TextEditorRevealType.Default
  );
}

/**
 * Apply diffs to the editor
 * @param {vscode.TextEditor} editor
 * @param {Diff.Change[]} diffs
 */
async function applyDiffs(editor, diffs) {
  // move cursor to start of document
  const position = new vscode.Position(0, 0);
  editor.selection = new vscode.Selection(position, position);

  const move = (/** @type {vscode.Position} */ position, value) => {
    let deltaLine = (value.match(/\n/g) || []).length;
    if (deltaLine === 0) return position.translate(0, value.length);
    let charPos = value.split('\n').pop().length;
    return position.translate(deltaLine).with({ character: charPos });
  };

  for (const diff of diffs) {
    console.log(diff);
    if (diff.added) {
      await typeRealistically(editor, diff.value);
    } else if (diff.removed) {
      // delete diff.count characters
      const position = editor.selection.active;
      const newPosition = move(position, diff.value);
      const range = new vscode.Range(position, newPosition);
      await sleep(10 * diff.count);
      await editor.edit((editBuilder) => {
        editBuilder.delete(range);
      });
    } else {
      // shift cursor to end of diff
      const position = editor.selection.active;
      const newPosition = move(position, diff.value);
      await sleep(10 * diff.count);
      editor.selection = new vscode.Selection(newPosition, newPosition);
    }

    await sleep(100);
  }
}

module.exports = {
  typeRealistically,
  typeImmediately,
  applyDiffs,
};
