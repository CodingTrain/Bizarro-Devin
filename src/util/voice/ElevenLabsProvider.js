const Speaker = require('speaker');
const Websocket = require('ws');
const config = require('../../../config');

class ElevenLabsProvider {
  constructor() {
    this.ws = new Websocket(
      `wss://api.elevenlabs.io/v1/text-to-speech/${config.elevenLabs.voiceId}/stream-input?model_id=${config.elevenLabs.model}&output_format=${config.elevenLabs.outputFormat}`
    );
    this.audioFinished = false;

    // Register websocket events
    this.ws.on('open', () => {
      console.log('Connected to ElevenLabs');

      // Send BOS message
      this.send({
        text: ' ',
        xi_api_key: config.elevenLabs.apiKey,
      });
    });
    this.ws.on('message', (message) => this.onMessage(JSON.parse(message)));
    this.ws.on('error', (error) => console.log(`Websocket error: ${error}`));
    this.ws.on('close', (event) => {
      if (event.wasClean) {
        console.log(
          `Connection closed cleanly, code=${event.code}, reason=${event.reason}`
        );
      } else {
        console.log(
          `Connection died, code=${event.code}, reason=${event.reason}`
        );
      }

      this.audioFinished = true;
      this.speaker && this.speaker.end();
    });
  }

  onMessage(data) {
    console.log('[WS] Received data: ' + JSON.stringify(data));
    if (data.audio) {
      const chunk = atob(data.audio);
      this.speaker.write(chunk);
    }
  }

  send(data) {
    console.log('[WS] Sending data: ' + JSON.stringify(data));
    this.ws.send(JSON.stringify(data));
  }

  async waitAudioFinished() {
    return new Promise((resolve) => {
      this.ws.on('close', () => resolve());
    });
  }

  async startSpeaking() {
    return new Promise((resolve) => {
      this.audioFinished = false;

      // Create a new speaker instance
      this.speaker = new Speaker({
        channels: 1,
        bitDepth: 16,
        sampleRate: 16000,
      });

      this.ws.on('open', () => resolve());
    });
  }

  stopSpeaking() {
    this.send({
      text: '',
      flush: true,
    });
  }

  async sendChunk(text) {
    this.send({
      text,
    });
  }
}

module.exports = {
  ElevenLabsProvider,
};
