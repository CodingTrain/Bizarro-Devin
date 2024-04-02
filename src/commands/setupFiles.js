const Command = require('../lib/command');
const { createFile } = require('../util/createFile');

class SetupFilesCommand extends Command {
  constructor() {
    super('bizarro-devin.setupFiles');
  }

  async run() {
    // create index.html
    await this.createIndexHtml();
    // create sketch.js && opening it
    await this.createErrorCatcherFile();
    const doc = await createFile('sketch.js');
    await doc.open();
  }

  async createIndexHtml() {
    await createFile(
      'index.html',
      `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <script src="https://cdn.jsdelivr.net/npm/p5@1.9.2/lib/p5.js"></script>
        <script
        src="https://cdn.socket.io/4.7.5/socket.io.min.js"
        integrity="sha384-2huaZvOR9iDzHqslqwpR87isEmrfxqyWOF7hr7BY6KG0+hVKLoEXMPUJw3ynWuhO"
        crossorigin="anonymous"
        ></script>
        <script src="errorCatcher.js"></script>
        <script src="sketch.js"></script>
      </head>
      <body>
      </body>
      </html>`
    );
  }

  async createErrorCatcherFile() {
    await createFile(
      'errorCatcher.js',
      `const socket = io('http://127.0.0.1:4025');

      // Capture all errors, credits to https://github.com/processing/p5.js-web-editor/blob/develop/client%2Futils%2FpreviewEntry.js#L65
      window.onerror = async function (msg, source, lineNumber, columnNo, error) {
          let data;
          if (!error) {
              data = msg;
          } else {
              data = \`\${error.name}: \${error.message}\`;
              // Remove the host from the resolvedLineNo
              const line = \` at \${lineNumber}:\${columnNo}\`;
              data = data.concat(line);
          }
      
          const errorData = {
              msg,
              source,
              lineNumber,
              columnNo,
              error,
              data,
          };
      
          await sendMessage(errorData, 'error');
          return false;
      };
      
      // Send error to backend
      async function sendMessage(data, type) {
          socket.emit('message', {
              type,
              data,
          });
      }
      `
    );
  }
}

module.exports = SetupFilesCommand;
