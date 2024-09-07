const Command = require('../lib/command');
const {
  createFile,
  copyFile,
  readFile,
  copyFolder,
} = require('../util/createFile');
const path = require('path');
const config = require('../../config');
class SetupFilesCommand extends Command {
  constructor() {
    super('bizarro-devin.setupFiles');
  }

  async run() {
    // create index.html and animator.js

    await copyFile(this.getPathToAssetsFolder('index.html'), 'index.html');

    // Animator requires replacing the port placeholder
    let animator = await readFile(this.getPathToAssetsFolder('animator.js'));
    animator = animator.replace('$$PORT$$', config.socketServerPort);
    await createFile('animator.js', animator);

    // Copy assets
    await copyFolder(this.getPathToAssetsFolder('animations'), 'animations');
    await copyFile(this.getPathToAssetsFolder('data.js'), 'data.js');

    // create sketch.js && opening it
    const doc = await createFile('sketch.js');
    await doc.open();
  }

  getPathToAssetsFolder(fileName) {
    return path.join(__dirname, '../../', 'assets', fileName);
  }
}

module.exports = SetupFilesCommand;
