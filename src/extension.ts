// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import vscode from 'vscode';
import * as COMMANDS from './bizzaro-commands.js';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "bizarro-devin" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	for (const [key, value] of Object.entries(COMMANDS)) { //key is the name of the exported function, value is the function
		console.log("registering command: ", key, value);
		context.subscriptions.push(vscode.commands.registerCommand( "bizarro-devin." + key , value ));
	}
}

// This method is called when your extension is deactivated
export function deactivate() {}
