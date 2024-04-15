const { OpenAI, ChatOpenAI, OpenAIEmbeddings } = require('@langchain/openai');
// const { TextLoader } = require('langchain/document_loaders/fs/text');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { HNSWLib } = require('langchain/vectorstores/hnswlib');

const fs = require('fs');

const config = require('../../config');

const chatModel = new ChatOpenAI({
  openAIApiKey: config.openAIApiToken,
});

const model = new OpenAI({
  openAIApiKey: config.openAIApiToken,
});

const embeddings = new OllamaEmbeddings({
  openAIApiKey: config.openAIApiToken,
});

testChat();

async function testChat() {
  //   const loader = new TextLoader('transcripts/example.txt');
  //   const docs = await loader.load();

  const text = fs.readFileSync('transcripts/example.txt', 'utf8');
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
  const docs = await textSplitter.createDocuments([text]);

  const vectorStore = await HNSWLib.fromDocuments(docs, embeddings());

  // Initialize a retriever wrapper around the vector store
  const retriever = vectorStore.asRetriever();

  const references = await retriever.getRelevantDocuments(
    'what is a raindobw?'
  );
  console.log(references);

  //const response = await chatModel.invoke('How are you?');
  //console.log(response);
}
