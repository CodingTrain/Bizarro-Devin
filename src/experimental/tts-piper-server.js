const player = require('play-sound')();
const fs = require('fs');

speak(`Hello! I'm MattGPT, ready to battle with Dan Shiffman!`);

async function speak(txt) {
  // python3 -m piper.http_server --model en_GB-alan-medium.onnx --port 5001
  const response = await fetch(`http://127.0.0.1:5001/?text=${txt}`);
  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const tempFilePath = 'temp_audio.wav';
  fs.writeFileSync(tempFilePath, buffer);
  player.play(tempFilePath, (err) => {
    if (err) {
      console.error('Failed to play:', err);
    } else {
      console.log('Audio playback finished.');
      //fs.unlinkSync(tempFilePath);
    }
  });
}
