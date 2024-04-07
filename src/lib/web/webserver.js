const { Server } = require('socket.io');

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
    this.io.listen(4025);
    this.io.on('connection', (socket) => {
      socket.emit('status', this.status); // Send the current status to the client
    });
    console.log('Socket server started');
  }

  sendStatus(status) {
    this.status = status;
    this.io.emit('status', status);
  }

  sendCaption(caption) {
    this.io.emit('caption', caption);
  }
}

module.exports = {
  SocketServer,
};
