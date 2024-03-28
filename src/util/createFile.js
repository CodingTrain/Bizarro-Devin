const vscode = require('vscode');

module.exports = {
  createFile: createFile
}

/**
 * Creates a file with the given relative path and optional content.
*
* @param {string} path - The relative path of the file to be created.
* @param {string} [content] - The content to be written to the file. Optional, defaults to an empty string.
* @return {Promise<void>} - A promise that resolves when the file is created successfully.
* @param {boolean} options.show - set true to open file
*/
async function createFile  (path, content = "",options={}) {
  const activeFolder = vscode.workspace.workspaceFolders[0];
  const FilePath = vscode.Uri.joinPath(activeFolder.uri, path);
  const FileContent = new TextEncoder().encode(content);
  await vscode.workspace.fs.writeFile(FilePath, FileContent);
  if (options.show) {
    const document = await vscode.workspace.openTextDocument(FilePath);
    await vscode.window.showTextDocument(document);
  }
};