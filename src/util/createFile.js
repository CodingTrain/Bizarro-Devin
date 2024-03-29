const vscode = require('vscode');

/**
 * The object returned by {@link createFile} function
 * @typedef {Object} document
 * @property {string} path
 * @property {function(): Promise<vscode.TextEditor>} open asyncronous function to open the document
 */

/**
 * Creates a file with the given relative path and optional content.
*
* @param {string} path - The relative path of the file to be created.
* @param {string} [content] - The content to be written to the file. Optional, defaults to an empty string.
* @return {Promise<document>} - A promise that resolves to a {@link document} wtth .path and .open() methods.
*/
async function createFile (path, content = "") {
  const activeFolder = vscode.workspace.workspaceFolders[0];
  const filePath = vscode.Uri.joinPath(activeFolder.uri, path);
  const fileContent = new TextEncoder().encode(content);
  await vscode.workspace.fs.writeFile(filePath, fileContent);
  return {
    path: filePath,
    open: async () => {
      const document = await vscode.workspace.openTextDocument(filePath);
      return await vscode.window.showTextDocument(document);
    }
  }
};

module.exports = { createFile }
