import vscode from 'vscode';
const activeFolder = vscode.workspace.workspaceFolders?.[0];
export async function createIndexHtml() {
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
  const scetchJsPath = vscode.Uri.joinPath(activeFolder.uri, 'sketch.js');
  const sketchJsContent = '';
  await vscode.workspace.fs.writeFile(scetchJsPath, new TextEncoder().encode(sketchJsContent));
}