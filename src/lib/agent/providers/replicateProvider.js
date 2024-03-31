const ModelProvider = require('./genericProvider');
const Replicate = require('replicate');
const config = require('../../../../config');
const { prompts } = require('../../../prompt');

class ReplicateProvider extends ModelProvider {
  constructor() {
    super();
    this.replicate = new Replicate({
      auth: config.replicateApiToken,
    });
  }

  async query(prompt) {
    this.messageHistory.push({ role: 'user', content: prompt });
    const output = await this.replicate.run('meta/llama-2-70b-chat', {
      input: this.createPrompt(),
    });
    this.messageHistory.push({ role: 'assistant', content: output.join('') });
    return { response: output.join('') };
  }

  async queryStream(prompt, process) {
    this.messageHistory.push({ role: 'user', content: prompt });
    const stream = this.replicate.stream('meta/llama-2-70b-chat', {
      input: this.createPrompt(),
    });
    let fullResponse = '';
    while (true) {
      const { value, done } = await stream.next();
      if (done) {
        throw new Error('Stream ended unexpectedly');
      }
      if (value.event == 'done') break;
      await process({ response: value.data, event: value.event });
      fullResponse += value.data;
    }
    this.messageHistory.push({ role: 'assistant', content: fullResponse });
  }

  createPrompt() {
    const formattedPrompt = this.messageHistory
      .map((msg) => {
        return msg.role == 'user'
          ? `[INST] ${msg.content} [/INST]`
          : msg.content;
      })
      .join('\n');
    return {
      prompt: formattedPrompt,
      prompt_template: `[INST]<<SYS>>\n{system_prompt}\n<</SYS>>[/INST]\n\n{prompt}`,
      max_new_tokens: 2000,
      system_prompt: prompts.systemPrompt,
    };
  }
}
module.exports = ReplicateProvider;
