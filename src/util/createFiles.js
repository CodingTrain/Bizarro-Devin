import vscode from 'vscode';
const activeFolder = vscode.workspace.workspaceFolders?.[0];

/**
 * Creates a file with the given relative path and optional content.
 *
 * @param {string} path - The relative path of the file to be created.
 * @param {string} [content] - The content to be written to the file. Optional, defaults to an empty string.
 * @return {Promise<void>} - A promise that resolves when the file is created successfully.
 */
export async function createFile(path, content = "") {
  const FilePath = vscode.Uri.joinPath(activeFolder.uri, path);
  const FileContent = new TextEncoder().encode(content);
  await vscode.workspace.fs.writeFile(FilePath, FileContent);
}





export async function createIndexHtml() {
  if (!activeFolder) {
    vscode.window.showInformationMessage('Open a folder first!');
    return;
  }
  const indexHtmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  
</body>
</html>`;

  await createFile('index.html', indexHtmlContent);
}

export async function createSketchJs() {
  await createFile('sketch.js');
}
