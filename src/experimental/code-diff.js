const Diff = require('diff');

// const oldCode = `
// function setup() {
//     createCanvas(400, 400);
// }

// function draw() {
//     background(220);
//     circle(200, 300, 50);
// }
// `;
const oldCode = '';

const newCode = `
function setup() {
    createCanvas(400, 400);
}

function draw() {
    background(220);
    fill(255, 0, 0);
    circle(mouseX, mouseY, 50);
}

function mousePressed() {
    background(220);
}
`;

const diff = Diff.diffChars(oldCode, newCode);
// console.log(diff.hunks);

console.log(diff);
