// Create a copy of this file and name it config.js

module.exports = {
  model: 'openai', // replicate, ollama, openai, gemini
  socketServerPort: 11434, // Port for the socket server
  tts: 'piper', // say, coqui, piper, elevenlabs, elevenlabsSync, playht
  showSubtitles: false, // show subtitles of what is being said
  ollamaModel: 'llama2:70b', // model to use with ollama provider (only used if model is ollama)
  replicateApiToken: 'your-replicate-api-token-here',
  openAIApiToken: 'your-openai-api-token-here',
  geminiApiToken: 'your-gemini-api-token-here',
  elevenLabs: {
    apiKey: 'your-eleven-labs-api-key-here',
    voiceId: 'your-eleven-labs-voice-id-here',
    model: 'eleven_turbo_v2',
    outputFormat: 'pcm_16000',
    sampleRate: 16000,
    voiceSettings: {
      stability: 30, // default is 50
      similarity_boost: 80, // default is 80
    },
  },
  playHT: {
    secret: 'your-playht-secret-here',
    userId: 'your-playht-user-id-here',
  },
};
