const fs = require('fs');
const path = require('path');
const vscode = require('vscode');

class CommandLoader {
    /**
     * @param {vscode.ExtensionContext} context
     */
    constructor(context) {
        this.context = context;
    }

    load(loadingPath) {
        const files = fs.readdirSync(path.join(__dirname, '../', loadingPath));
        for (const file of files) {
            const CommandClass = require(path.join(
                __dirname,
                '../',
                loadingPath,
                file
            ));
            const command = new CommandClass();
            command.load();

            const vscodeCommand = vscode.commands.registerCommand(
                command.id,
                () => command.run() // Supplying the run method directly will make the "this" context from the command class not what we expect it to be
            );
            this.context.subscriptions.push(vscodeCommand);

            console.log('[Command Loader] Loaded command:', command.id);
        }
    }
}

module.exports = CommandLoader;
