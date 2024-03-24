const vscode = require('vscode');
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Choo choo 🚂!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'bizarro-devin.chooChoo',
    runAIAgent
  );
  context.subscriptions.push(disposable);
}

function deactivate() {}

function pauseAgent(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// TODO: Receive a prompt to get started
async function runAIAgent() {
  // TODO: CREATE index.html and sketch.js
  // Run live server
  // Also, set up the window panes properly

  // get active text editor
  let editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showInformationMessage('Create a text file first!');
    return; // No open text editor
  }
  vscode.commands.executeCommand('livePreview.start');
  let code = `function setup() {\ncreateCanvas(400, 400);\nbackground(255); }
	function draw() { fill(0);\ncircle(mouseX, mouseY, 100); }`;
  for (let i = 0; i < code.length; i++) {
    await pauseAgent(100);
    editor.edit((editBuilder) => {
      editBuilder.insert(editor.selection.active, code.charAt(i));
    });
  }

  formatCurrentDocument(editor);

  // await pauseAgent(3000);

  // editor.edit((editBuilder) => {
  //   editBuilder.insert(
  //     editor.selection.active,
  //     `
  //   );
  // });
}

function formatCurrentDocument(editor) {
  vscode.commands
    .executeCommand("vscode.executeFormatDocumentProvider", editor.document.uri)
    .then(
      (edits) => {
        if (Array.isArray(edits) && edits.length > 0) {
          const edit = new vscode.WorkspaceEdit();
          edit.set(editor.document.uri, edits);
          vscode.workspace.applyEdit(edit).then((success) => {
            if (!success) {
              vscode.window.showErrorMessage("Failed to format document.");
            }
          });
        } else {
          vscode.window.showInformationMessage(
            "No formatting edits were returned."
          );
        }
      },
      (error) => {
        vscode.window.showErrorMessage(
          "An error occurred while formatting document: " + error
        );
      }
    );
}

module.exports = {
  activate,
  deactivate,
};
