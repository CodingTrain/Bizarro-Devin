const { sleep } = require('./sleep');
const vscode = require('vscode');
const { getAgent } = require('../lib/agent/Agent');

const delays = {
  typeCharacter: 50,
  typePunctuation: 150,
  deleteRange: 200,
  moveCursor: 100,
  applyDiff: 100,
};

// Lower values = faster!! (0.25 is 4x speed)
// Maybe we have a toggle button for fast vs. regular?
let speedFactor = 1.0;

function noise(val = 10) {
  return Math.random() * val - val / 2;
}

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
  delay = delays.typeCharacter * speedFactor
) => {
  const agent = getAgent();
  if (!agent.speed) {
    speedFactor = 1;
  } else {
    speedFactor = 0.25;
  }

  for (let i = 0; i < code.length; i++) {
    const char = code.charAt(i);

    await editor.edit((editBuilder) => {
      editBuilder.insert(editor.selection.active, char);
    });

    const isPunctuation = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/;
    if (isPunctuation.test(char))
      await sleep(delays.typePunctuation * speedFactor + noise());
    else if (char !== ' ') await sleep(delay * speedFactor + noise());

    scrollToCursor(editor);
  }
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
      await sleep(delays.deleteRange * speedFactor + noise());
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
      if (diff !== diffs[0])
        await sleep(delays.moveCursor * speedFactor + noise());
      editor.selection = new vscode.Selection(newPosition, newPosition);
      scrollToCursor(editor);
    }

    await sleep(delays.applyDiff * speedFactor + noise());
  }
}

module.exports = {
  typeRealistically,
  typeImmediately,
  applyDiffs,
};
