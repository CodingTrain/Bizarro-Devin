const ModelProvider = require('./genericProvider');

class OllamaProvider extends ModelProvider {
  constructor() {
    super();
  }

  async query(prompt) {
    const url = 'http://127.0.0.1:11434/api/generate';
    const data = {
      model: 'llama2',
      messages: [
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
    this.messageHistory.push({ role: 'assistant', content: json.response });
    return json;
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
  queryStream(prompt, process) {
    /// TODO: Implement message history
    const url = 'http://127.0.0.1:11434/api/generate';
    const data = {
      model: 'llama2',
      prompt,
    };
    this.streamResponse(url, data, process);
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
              const json = JSON.parse(chunk);
              await process(json);
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
