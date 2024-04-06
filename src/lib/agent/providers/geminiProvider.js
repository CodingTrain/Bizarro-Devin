const ModelProvider = require('./genericProvider');
const { prompts } = require('../../../prompt');
const config = require('../../../../config');
const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiProvider extends ModelProvider {
  constructor() {
    super();
    this.genAI = new GoogleGenerativeAI(config.geminiApiToken);
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-pro',
    });

    // Gemini manages its own chat history
    this.chat = this.model.startChat({
      history: [
        {
          role: 'user', // gemini doesn't have a system role
          parts: [{ text: prompts.systemPrompt }],
        },
        {
          role: 'model', // fake response
          parts: [{ text: 'Understood.' }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 2000,
      },
    });
  }

  async query(prompt) {
    this.messageHistory.push({ role: 'user', content: prompt });

    const result = await this.chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();
    this.messageHistory.push({ role: 'assistant', content: text });
    return {
      response: text,
    };
  }

  async queryStream(prompt, process) {
    this.messageHistory.push({ role: 'user', content: prompt });

    const result = await this.chat.sendMessageStream(prompt);
    let fullResponse = '';
    for await (const chunk of result.stream) {
      if (chunk.promptFeedback?.blockReason) {
        // prompt blocked
        this.messageHistory.pop();
        return {
          blocked: true,
          blockReason: chunk.promptFeedback.blockReason,
        };
      }
      const text = chunk.text();
      fullResponse += text;
      await process({ response: text, event: 'output' });
    }
    await process({ response: '', event: 'done' });
    this.messageHistory.push({ role: 'assistant', content: fullResponse });
    return {
      success: true,
    };
  }
}

module.exports = GeminiProvider;
