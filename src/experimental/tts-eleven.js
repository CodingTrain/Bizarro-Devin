const fs = require('fs');
const config = require('../../config');
const { WaveFile } = require('wavefile');
const { ElevenLabsClient, play } = require('elevenlabs');

const elevenTTS = async (text, filePath) => {
  return new Promise(async (resolve, reject) => {
    const elevenLabs = new ElevenLabsClient({
      apiKey: config.elevenLabs.apiKey,
    });
    const audio = await elevenLabs.generate({
      voice: config.elevenLabs.voiceId,
      text: text,
      model_id: config.elevenLabs.model,
      // output_format: config.elevenLabs.outputFormat,
    });

    await play(audio);

    // fs.writeFileSync(filePath);
    // let wav = new WaveFile();
    // wav.fromScratch(1, config.elevenLabs.sampleRate, 16, audio);
    // fs.writeFileSync(filePath, wav.toBuffer());
    resolve();
  });
};

elevenTTS('Hello, World! I am Matt Parker!', 'parker.wav').then(() => {
  console.log('Done!');
});
