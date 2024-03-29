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
      const doc = await createFile('sketch.js');
      await doc.open();
    }
    
    async createIndexHtml() {
      await createFile('index.html', 
      `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <script src="https://cdn.jsdelivr.net/npm/p5@1.9.2/lib/p5.js"></script>
        <script src="sketch.js"></script>
      </head>
      <body>
      </body>
      </html>`);
    }
}

module.exports = SetupFilesCommand;