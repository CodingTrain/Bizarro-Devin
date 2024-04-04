const { sleep } = require('./sleep');
const vscode = require('vscode');

const delays = {
  typeCharacter: 50,
  deleteRange: 200,
  moveCursor: 100,
  applyDiff: 100,
};

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
const typeRealistically = async (
  editor,
  code,
  delay = delays.typeCharacter
) => {
  for (let i = 0; i < code.length; i++) {
    const char = code.charAt(i);
    await editor.edit((editBuilder) => {
      editBuilder.insert(editor.selection.active, char);
    });
    if (char !== ' ') await sleep(delay);

    scrollToCursor(editor);
  }

  // // Insert newline
  // await editor.edit((editBuilder) => {
  //   editBuilder.insert(editor.selection.active, '\n');
  // });

  // // Format document
  // await vscode.commands.executeCommand('vscode.open', editor.document.uri);
  // await vscode.commands.executeCommand('editor.action.formatDocument');
};

function scrollToCursor(editor) {
  // Scroll to cursor
  editor.revealRange(editor.selection);
}

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
    if (diff.added) {
      await typeRealistically(editor, diff.value);
    } else if (diff.removed) {
      // delete characters
      const position = editor.selection.active;
      const newPosition = move(position, diff.value);
      const range = new vscode.Range(position, newPosition);
      editor.selection = new vscode.Selection(position, newPosition);
      scrollToCursor(editor);
      await sleep(delays.deleteRange);
      await editor.edit((editBuilder) => {
        editBuilder.delete(range);
      });
      scrollToCursor(editor);
    } else {
      // shift cursor to end of diff

      // don't bother moving cursor to end of document
      if (diff == diffs.at(-1)) continue;
      const position = editor.selection.active;
      const newPosition = move(position, diff.value);
      if (diff !== diffs[0]) await sleep(delays.moveCursor);
      editor.selection = new vscode.Selection(newPosition, newPosition);
      scrollToCursor(editor);
    }

    await sleep(delays.applyDiff);
  }
}

module.exports = {
  typeRealistically,
  typeImmediately,
  applyDiffs,
};
