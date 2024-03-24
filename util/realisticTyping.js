const { sleep } = require('./sleep');

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
};

module.exports = {
    typeRealistically,
};
