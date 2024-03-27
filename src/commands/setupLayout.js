const vscode = require('vscode');

const Command = require('../lib/command');
const { sleep } = require('../util/sleep');

class SetupLayoutCommand extends Command {
    constructor() {
        super('bizarro-devin.setupLayout');
    }

    async run() {
        // Run live server
        // Also, set up the window panes properly

        // get active text editor
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('Create a text file first!');
            return; // No open text editor
        }

        // Open live preview
        await vscode.commands.executeCommand('livePreview.start');

        // Wait a second for the window to at least open
        while (vscode.window.tabGroups.all.length < 2) {
            await sleep(50);
        }

        // Toggle row layout
        await vscode.commands.executeCommand(
            'workbench.action.toggleEditorGroupLayout'
        );

        // Set this tab as our active tab again (weird workaround to make sure the next command works)
        await vscode.commands.executeCommand(
            'vscode.open',
            editor.document.uri
        );

        // Move code editor to the bottom
        await vscode.commands.executeCommand(
            'workbench.action.moveActiveEditorGroupDown'
        );
    }
}

module.exports = SetupLayoutCommand;
