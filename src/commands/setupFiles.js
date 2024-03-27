const Command = require('../lib/command');
const { createFile } = require('../util/createFile');

class setupFilesCommand extends Command {
  constructor() {
      super('bizarro-devin.setupFiles');
  }

  // TODO: Receive a prompt to get started
  async run() {
      await this.createIndexHtml();
      await this.createSketchJs();
  }

  async createIndexHtml() {
    await createFile('index.html', 
    `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>
    <body>
      
    </body>
    </html>`);
  } 
    
  async createSketchJs() {
    await createFile('sketch.js',"",{show : true});
  } 
}

module.exports = setupFilesCommand;