const Command = require('../lib/command');
const { createFile, copyFile, readFile } = require('../util/createFile');
const path = require('path');
const config = require('../../config');
class SetupFilesCommand extends Command {
  constructor() {
    super('bizarro-devin.setupFiles');
  }

  async run() {
    // create index.html and animator.js

    await copyFile(this.getPathToAssetsFolder('index.html'), 'index.html');
    // await copyFile(this.getPathToAssetsFolder('animator.js'), 'animator.js');
    let animator = await readFile(this.getPathToAssetsFolder('animator.js'));
    animator = animator.replace('$$PORT$$', config.socketServerPort);
    await createFile('animator.js', animator);
    await copyFile(
      this.getPathToAssetsFolder('matt-pending.png'),
      'matt-pending.png'
    );
    await copyFile(
      this.getPathToAssetsFolder('matt-thinking.png'),
      'matt-thinking.png'
    );
    await copyFile(
      this.getPathToAssetsFolder('matt-typing.png'),
      'matt-typing.png'
    );

    // create sketch.js && opening it
    const doc = await createFile('sketch.js');
    await doc.open();
  }

  getPathToAssetsFolder(fileName) {
    return path.join(__dirname, '../../', 'assets', fileName);
  }
}

module.exports = SetupFilesCommand;
