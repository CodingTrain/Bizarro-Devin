const Diff = require('diff');

function isWhitespace(text) {
  return /^\s*$/.test(text);
}

function isPunctuation(str) {
  return /^[!@#\$%\^&\*\(\)\[\]\{\};:'",.<>\/\?\|\\`~_\-+=]+$/u.test(str);
}

function atLeastNSignificantChars(str, n) {
  // significant characters are non-whitespace and non-punctuation
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (!isWhitespace(str[i]) && !isPunctuation(str[i])) {
      count++;
    }
  }
  return count >= n;
}

/**
 * creates diff between two code snippets
 * @param {string} prev old code
 * @param {string} next new code
 */
function diffCode(prev, next) {
  const diffs = Diff.diffWordsWithSpace(prev, next);

  // collapse consecutive added/removed changes
  const collapsedDiffs = [];
  let currAdded = -1;
  let currRemoved = -1;

  for (let i = 0; i < diffs.length; i++) {
    if (diffs[i].added) {
      if (currAdded === -1) {
        collapsedDiffs.push(diffs[i]);
        currAdded = collapsedDiffs.length - 1;
      } else {
        collapsedDiffs[currAdded].value += diffs[i].value;
        collapsedDiffs[currAdded].count += diffs[i].count;
      }
    } else if (diffs[i].removed) {
      if (currRemoved === -1) {
        collapsedDiffs.push(diffs[i]);
        currRemoved = collapsedDiffs.length - 1;
      } else {
        collapsedDiffs[currRemoved].value += diffs[i].value;
        collapsedDiffs[currRemoved].count += diffs[i].count;
      }
    } else {
      if (!atLeastNSignificantChars(diffs[i].value, 3)) {
        // insignificant substring which is unchanged
        // collapse it with previous added/removed changes
        if (currAdded !== -1 && currRemoved !== -1) {
          collapsedDiffs[currAdded].value += diffs[i].value;
          collapsedDiffs[currAdded].count += diffs[i].count;
          collapsedDiffs[currRemoved].value += diffs[i].value;
          collapsedDiffs[currRemoved].count += diffs[i].count;
        } else {
          collapsedDiffs.push(diffs[i]);
          currAdded = -1;
          currRemoved = -1;
        }
      } else {
        if (
          collapsedDiffs.length > 0 &&
          !collapsedDiffs[collapsedDiffs.length - 1].added &&
          !collapsedDiffs[collapsedDiffs.length - 1].removed
        ) {
          collapsedDiffs[collapsedDiffs.length - 1].value += diffs[i].value;
          collapsedDiffs[collapsedDiffs.length - 1].count += diffs[i].count;
        } else {
          collapsedDiffs.push(diffs[i]);
        }

        currAdded = -1;
        currRemoved = -1;
      }
    }
  }

  return collapsedDiffs;
}

module.exports = {
  diffCode,
};
