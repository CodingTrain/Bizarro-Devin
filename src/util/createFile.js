const vscode = require('vscode');

/**
 * The object returned by {@link createFile} function
 * @typedef {Object} document
 * @property {string} path
 * @property {function(): Promise<vscode.TextEditor>} open asyncronous function to open the document
 */

/**
 * Reads file content from the given source path
 * @param {string} source Source file path
 * @returns File content
 */
async function readFile(source) {
  const sourcePath = vscode.Uri.file(source);
  const fileContent = await vscode.workspace.fs.readFile(sourcePath);
  return new TextDecoder().decode(fileContent);
}

/**
 * Creates a file with the given relative path and optional content.
 *
 * @param {string} path - The relative path of the file to be created.
 * @param {string} [content] - The content to be written to the file. Optional, defaults to an empty string.
 * @return {Promise<document>} - A promise that resolves to a {@link document} wtth .path and .open() methods.
 */
async function createFile(path, content = '') {
  const activeFolder = vscode.workspace.workspaceFolders[0];
  const filePath = vscode.Uri.joinPath(activeFolder.uri, path);
  const fileContent = new TextEncoder().encode(content);
  await vscode.workspace.fs.writeFile(filePath, fileContent);
  return {
    path: filePath,
    open: async () => {
      const document = await vscode.workspace.openTextDocument(filePath);
      return await vscode.window.showTextDocument(document);
    },
  };
}

/**
 * Copies a file from the given source path to the given relative destination path
 *
 * @param {string} source - The path of the file to be copied
 * @param {string} path - The relative destination path of the file to be copied.
 * @return {Promise<document>} - A promise that resolves to a {@link document} wtth .path and .open() methods.
 */
async function copyFile(source, path) {
  const activeFolder = vscode.workspace.workspaceFolders[0];
  const filePath = vscode.Uri.joinPath(activeFolder.uri, path);
  const sourcePath = vscode.Uri.file(source);
  await vscode.workspace.fs.copy(sourcePath, filePath, {
    overwrite: true,
  });
  return {
    path: filePath,
    open: async () => {
      const document = await vscode.workspace.openTextDocument(filePath);
      return await vscode.window.showTextDocument(document);
    },
  };
}
/**
 * Copies a folder from the given source path to the given relative destination path
 *
 * @param {string} source - The path of the folder to be copied
 * @param {string} path - The relative destination path of the folder to be copied.
 * @return {Promise<void>} - A promise that resolves when the folder is copied.
 */
async function copyFolder(source, path) {
  const activeFolder = vscode.workspace.workspaceFolders[0];
  const folderPath = vscode.Uri.joinPath(activeFolder.uri, path);
  const sourcePath = vscode.Uri.file(source);
  await vscode.workspace.fs.copy(sourcePath, folderPath, {
    overwrite: true,
  });
}

module.exports = { createFile, copyFile, readFile, copyFolder };
