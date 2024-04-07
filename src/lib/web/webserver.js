const { Server } = require('socket.io');
const config = require('../../../config');

class SocketServer {
  constructor(agent) {
    this.status = 'pending';
    this.agent = agent;
    this.io = new Server({
      cors: {
        origin: '*',
      },
    });
  }

  start() {
    this.io.listen(config.socketServerPort);
    this.io.on('connection', (socket) => {
      socket.emit('status', this.status); // Send the current status to the client
    });
    console.log('🚀 Socket server started on port ' + config.socketServerPort);
  }

  sendStatus(status) {
    this.status = status;
    this.io.emit('status', status);
  }

  sendCaption(caption) {
    if (config.showSubtitles) this.io.emit('caption', caption);
  }
}

module.exports = {
  SocketServer,
};
