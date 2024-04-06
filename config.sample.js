// Create a copy of this file and name it config.js

module.exports = {
  model: 'replicate', // replicate, ollama, openai, gemini
  replicateApiToken: 'your-replicate-api-token-here',
  openAIApiToken: 'your-openai-api-token-here',
  geminiApiToken: 'your-gemini-api-token-here',
  elevenLabs: {
    apiKey: 'your-eleven-labs-api-key-here',
    voiceId: 'your-eleven-labs-voice-id-here',
  },
  tts: 'piper', // say, coqui, piper, elevenlabs
};
