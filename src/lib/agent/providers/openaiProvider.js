const ModelProvider = require('./genericProvider');
const { prompts } = require('../../../prompt');
const config = require('../../../../config');
const OpenAI = require('openai');

class OpenAIProvider extends ModelProvider {
  constructor() {
    super();
    this.openai = new OpenAI({ apiKey: config.openAIApiToken });
  }

  async query(prompt) {
    this.messageHistory.push({ role: 'user', content: prompt });
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: prompts.systemPrompt,
        },
        ...this.messageHistory,
      ],
    });

    this.messageHistory.push({
      role: 'assistant',
      content: response.choices[0]?.delta?.content,
    });
    return {
      response: response.choices[0]?.delta?.content,
    };
  }

  async queryStream(prompt, process) {
    this.messageHistory.push({ role: 'user', content: prompt });
    const stream = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: prompts.systemPrompt,
        },
        ...this.messageHistory,
      ],
      stream: true,
    });

    let fullResponse = '';
    for await (const chunk of stream) {
      if (chunk.choices[0].finish_reason === 'stop') {
        await process({ response: '', event: 'done' });
        this.messageHistory.push({ role: 'assistant', content: fullResponse });
      } else {
        await process({
          response: chunk.choices[0]?.delta?.content,
          event: 'output',
        });
        fullResponse += chunk.choices[0]?.delta?.content;
      }
    }
  }
}

module.exports = OpenAIProvider;
