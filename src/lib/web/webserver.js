const { getAgent } = require('../agent/Agent');
const { Server } = require('socket.io');

class SocketServer {
  constructor() {
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
    const agent = getAgent();
    agent.receiveBrowserMessage(message);
  }

  broadcastReload() {
    this.io.emit('reload');
  }
}

// Singleton instance of the webserver
let webserver = null;

/**
 * Get the agent instance
 * @returns {SocketServer} The agent instance
 */
const getWebserver = () => {
  if (!webserver) {
    webserver = new SocketServer();
  }
  return webserver;
};

module.exports = {
  getWebserver,
};
