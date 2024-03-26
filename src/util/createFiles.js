import vscode from 'vscode';
export async function createIndexHtml() {
  const activeFolder = vscode.workspace.workspaceFolders?.[0];
  if (!activeFolder) {
    vscode.window.showInformationMessage('Open a folder first!');
    return;
  }

  const indexHtmlPath = vscode.Uri.joinPath(activeFolder.uri, 'index.html');
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

  await vscode.workspace.fs.writeFile(indexHtmlPath, new TextEncoder().encode(indexHtmlContent));
}

export async function createSketchJs() {
  await vscode.workspace.fs.writeFile(indexHtmlPath, new TextEncoder().encode(indexHtmlContent));
}