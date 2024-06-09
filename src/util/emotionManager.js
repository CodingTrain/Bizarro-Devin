module.exports = class EmotionManager {
  constructor(agent, alignment) {
    console.log(agent);
    this.agent = agent;
    this.alignment = alignment;
  }

  async prepare() {
    const { pipeline } = await import('@xenova/transformers');
    this.pipeline = pipeline;

    // Extract the sentences from the alignment
    this.sentences = [];
    let currentSentence = { text: '', start: 0, end: 0 };

    for (let i = 0; i < this.alignment.characters.length; i++) {
      const character = this.alignment.characters[i];
      if (character === '.' || character === '?' || character === '!') {
        currentSentence.text += character;
        currentSentence.text = currentSentence.text.trim();
        currentSentence.end = this.alignment.character_end_times_seconds[i];
        this.sentences.push(currentSentence);
        currentSentence = {
          text: '',
          start: this.alignment.character_end_times_seconds[i],
          end: this.alignment.character_end_times_seconds[i],
        };
      } else {
        currentSentence.text += character;
        currentSentence.end = this.alignment.character_end_times_seconds[i];
      }
    }

    console.log(this.sentences);

    // Now we can analyze the sentiment of each sentence
    const sentiments = [];
    for (const sentence of this.sentences) {
      const sentiment = await this.analyzeSentiment(sentence);
      console.log('Sentence:', sentence.text);
      console.log('Sentiment:', sentiment[0].label);
      sentiments.push(sentiment);
    }
  }

  async start() {
    // Wait until first word is spoken
    await new Promise((resolve) =>
      setTimeout(resolve, this.sentences[0].start * 1000)
    );

    for (const sentence of this.sentences) {
      console.log('Speaking:', sentence.text);
      this.agent.webserver.sendCaption({
        status: 'start',
        content: sentence.text,
      });

      // Wait until the scentence is finished
      await new Promise((resolve) =>
        setTimeout(resolve, (sentence.end - sentence.start) * 1000)
      );
    }
  }

  async analyzeSentiment(sentence) {
    const sentimentAnalyzer = await this.pipeline(
      'text-classification',
      'Xenova/robertuito-sentiment-analysis'
    );
    const output = await sentimentAnalyzer(sentence.text);
    return output;
  }
};
