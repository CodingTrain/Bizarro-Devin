const fs = require('fs');
const config = require('../../config');
const { WaveFile } = require('wavefile');
const { ElevenLabsClient } = require('elevenlabs');

const elevenTTS = async (text, filePath) => {
  return new Promise(async (resolve, reject) => {
    const elevenLabs = new ElevenLabsClient({
      apiKey: config.elevenLabs.apiKey,
    });

    let audioData = [];

    const stream = await elevenLabs.generate({
      stream: true,
      voice: config.elevenLabs.voiceId,
      text: text,
      model_id: config.elevenLabs.model,
      output_format: config.elevenLabs.outputFormat,
    });

    stream.on('data', (chunk) => {
      audioData.push(chunk);
    });

    stream.on('end', () => {
      const audioBuffer = Buffer.concat(audioData);
      let wav = new WaveFile();
      wav.fromScratch(1, config.elevenLabs.sampleRate, '32', audioBuffer);
      fs.writeFileSync(filePath, wav.toBuffer());
      resolve();
    });
  });
};

elevenTTS('Hello, World!', 'parker.wav').then(() => {
  console.log('Done!');
});
