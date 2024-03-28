const script = [
    {
        type: 'narrate',
        content:
            "First I'm creating the canvas with a size of 640 by 360 pixels.",
    },
    {
        type: 'code',
        content: ['function setup() {', '    createCanvas(640, 360);', '}'],
    },
    {
        type: 'narrate',
        content:
            "Now I'm creating the draw loop which will run continuously. It will call the branch method to start drawing the tree.",
    },
    {
        type: 'code',
        content: [
            'function draw() {',
            '    background(0);',
            '    stroke(255);',
            '    strokeWeight(2);',
            '    translate(width * 0.5, height);',
            '    branch(100);',
            '}',
        ],
    },
    {
        type: 'narrate',
        content:
            'The branch method is a recursive function that draws the tree. It takes a length parameter and draws a line of that length.',
    },
    {
        type: 'code',
        content: [
            'function branch(len) {',
            '    line(0, 0, 0, -len);',
            '    translate(0, -len);',
            '    if (len > 4) {',
            '        push();',
            '        rotate(PI/4);',
            '        branch(len * 0.67);',
            '        pop();',
            '        push();',
            '        rotate(-PI/4);',
            '        branch(len * 0.67);',
            '        pop();',
            '    }',
            '}',
        ],
    },
];

module.exports = {
    script,
};
