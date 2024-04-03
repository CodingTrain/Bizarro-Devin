const Diff = require('diff');

const oldCode = `
function setup() {
  createCanvas(400, 400);
  stroke(255);
}

function draw() {
  background(51);
  translate(200, height);
  line(0, 0, 0, -100);
}
`;

const newCode = `
function setup() {
  createCanvas(400, 400);
  stroke(255);
}

function draw() {
  background(51);
  translate(200, height);
  branch(100);
}

function branch(len) {
  line(0, 0, 0, -len);
  translate(0, -len);
  if (len > 4) {
    push();
    rotate(PI / 4);
    branch(len * 0.67);
    pop();
    push();
    rotate(-PI / 4);
    branch(len * 0.67);
    pop();
  }
}
`;

const diff = Diff.diffWordsWithSpace(oldCode, newCode);
// console.log(diff.hunks);

console.log(diff);
