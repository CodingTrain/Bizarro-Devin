// Create a copy of this file and name it config.js

module.exports = {
  model: 'replicate', // replicate, ollama, openai, gemini
  replicateApiToken: 'your-replicate-api-token-here',
  openAIApiToken: 'your-openai-api-token-here',
  geminiApiToken: 'your-gemini-api-token-here',
  elevenLabs: {
    apiKey: 'your-eleven-labs-api-key-here',
    voiceId: 'your-eleven-labs-voice-id-here',
    model: 'eleven_turbo_v2',
    outputFormat: 'pcm_16000',
    sampleRate: 16000,
  },
  playHT: {
    secret: 'your-playht-secret-here',
    userId: 'your-playht-user-id-here',
  },
  tts: 'piper', // say, coqui, piper, elevenlabs
};
