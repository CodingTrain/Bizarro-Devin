async function streamResponse(url, data, process) {
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
    let stream = new ReadableStream({
      async start(controller) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = new TextDecoder('utf-8').decode(value);
          try {
            const json = JSON.parse(chunk);
            process(json);
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

function queryStream(prompt, process) {
  const url = 'http://127.0.0.1:11434/api/generate';
  const data = {
    model: 'llama2',
    prompt,
  };
  streamResponse(url, data, process);
}

async function getResponse(url, data, process) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    console.log(response);
    // const json = await response.json();
    // console.log(json);
  } catch (error) {
    console.error('Failed to fetch:', error);
  }
}

function query(prompt) {
  const url = 'http://127.0.0.1:11434/api/generate';
  const data = {
    model: 'llama2',
    messages: [
      {
        role: 'user',
        content: 'why is the sky blue?',
      },
    ],
    stream: 'false',
  };
  getResponse(url, data, process);
}

query('Why is the sky blue?', (json) => {
  console.log(json.response);
});
