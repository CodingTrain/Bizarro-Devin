const ModelProvider = require('./genericProvider');
const { prompts } = require('../../../prompt');

class OllamaProvider extends ModelProvider {
  constructor() {
    super();
  }

  async query(prompt) {
    const url = 'http://127.0.0.1:11434/api/chat';
    const data = {
      model: 'llama2:70b',
      messages: [
        {
          role: 'system',
          content: prompts.systemPrompt,
        },
        ...this.messageHistory,
        {
          role: 'user',
          content: prompt,
        },
      ],
      stream: 'false',
    };
    this.messageHistory.push({ role: 'user', content: prompt });

    const response = await this.getResponse(url, data);
    const json = await response.json();
    this.messageHistory.push({
      role: 'assistant',
      content: json.message.content,
    });
    return {
      response: json.message.content,
    };
  }
  async getResponse(url, data) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response;
    } catch (error) {
      console.error('Failed to fetch:', error);
    }
  }
  async queryStream(prompt, process) {
    return new Promise((resolve) => {
      const url = 'http://127.0.0.1:11434/api/chat';
      this.messageHistory.push({ role: 'user', content: prompt });
      const data = {
        model: 'llama2:70b',
        messages: [
          {
            role: 'system',
            content: prompts.systemPrompt,
          },
          ...this.messageHistory,
        ],
      };
      let fullResponse = '';
      this.streamResponse(url, data, async (response) => {
        await process({
          response: response.message.content,
          event: response.done ? 'done' : 'output',
        });
        fullResponse += response.message.content;
        if (response.done) {
          this.messageHistory.push({
            role: 'assistant',
            content: fullResponse,
          });
          resolve({ success: true });
        }
      });
    });
  }
  async streamResponse(url, data, process) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const reader = response.body.getReader();
      new ReadableStream({
        async start(controller) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = new TextDecoder('utf-8').decode(value);
            try {
              // sometimes chunk can contain multiple JSON objects (ndjson)
              chunk.split('\n').forEach((jsonStr) => {
                if (jsonStr) {
                  const json = JSON.parse(jsonStr);
                  process(json);
                }
              });
            } catch (error) {
              console.error('Error parsing chunk to JSON', error);
            }
            controller.enqueue(value);
          }
          controller.close();
          reader.releaseLock();
        },
      });
    } catch (error) {
      console.error('Failed to fetch:', error);
    }
  }
}

module.exports = OllamaProvider;
