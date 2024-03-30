const ModelProvider = require('./agent/providers/genericProvider');
const Replicate = require('replicate');
const config = require('../../config');

class ReplicateProvider extends ModelProvider {
  constructor() {
    super();
    this.replicate = new Replicate({
      auth: config.replicateApiToken,
    });
  }

  async query(prompt) {
    this.messageHistory.push({ role: 'user', content: prompt });
    const output = await this.replicate.run('meta/llama-2-7b-chat', {
      input: this.createPrompt(),
    });
    this.messageHistory.push({ role: 'assistant', content: output.join('') });
    return { response: output.join('') };
  }

  async queryStream(prompt, process) {
    this.messageHistory.push({ role: 'user', content: prompt });
    const stream = this.replicate.stream('meta/llama-2-7b-chat', {
      input: this.createPrompt(),
    });
    let fullResponse = '';
    while (true) {
      const { value } = await stream.next();
      if (value.event == 'done') break;
      await process({ response: value.data });
      fullResponse += value.data;
    }
    this.messageHistory.push({ role: 'assistant', content: fullResponse });
  }

  createPrompt() {
    const formattedPrompt = this.messageHistory
      .map((msg) => {
        msg.role == 'user' ? `[INST] ${msg.content} [/INST]` : msg.content;
      })
      .join('\n');

    return {
      prompt: formattedPrompt,
      prompt_template: `{prompt}`,
    };
  }
}
module.exports = ReplicateProvider;
