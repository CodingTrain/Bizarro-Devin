const { Server } = require('socket.io');

class SocketServer {
  constructor(agent) {
    this.agent = agent;
    this.io = new Server({
      cors: {
        origin: '*',
      },
    });
  }

  start() {
    this.io.listen(4025);
    this.io.on('connect', (socket) => {
      // When socket connects, register event listener
      socket.on('message', (message) => this.handleIncomingMessage(message));
    });
    console.log('Socket server started');
  }

  handleIncomingMessage(message) {
    this.agent.receiveBrowserMessage(message);
  }

  broadcastReload() {
    this.io.emit('reload');
  }
}

module.exports = {
  SocketServer,
};
