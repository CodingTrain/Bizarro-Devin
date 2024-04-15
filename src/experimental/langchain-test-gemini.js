const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { TextLoader } = require('langchain/document_loaders/fs/text');
const { DirectoryLoader } = require('langchain/document_loaders/fs/directory');

const {
  createStuffDocumentsChain,
} = require('langchain/chains/combine_documents');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { MemoryVectorStore } = require('langchain/vectorstores/memory');
const { createRetrievalChain } = require('langchain/chains/retrieval');
const { GoogleGenerativeAIEmbeddings } = require('@langchain/google-genai');

const config = require('../../config');
const prompts = require('../prompt');

const safetySettings = [
  {
    category: 'HARM_CATEGORY_HARASSMENT',
    threshold: 'BLOCK_ONLY_HIGH',
  },
  {
    category: 'HARM_CATEGORY_HATE_SPEECH',
    threshold: 'BLOCK_ONLY_HIGH',
  },
  {
    category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
    threshold: 'BLOCK_ONLY_HIGH',
  },
  {
    category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
    threshold: 'BLOCK_ONLY_HIGH',
  },
];

const model = new ChatGoogleGenerativeAI({
  apiKey: config.geminiApiToken,
  modelName: 'gemini-pro',
  maxOutputTokens: 2048,
  safetySettings,
});

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: config.geminiApiToken,
  modelName: 'embedding-001', // 768 dimensions
  //taskType: TaskType.RETRIEVAL_DOCUMENT,
  //title: "Document title",
});

go();

console.log(prompts);

async function go() {
  const prompt = ChatPromptTemplate.fromTemplate(
    `${prompts.systemPrompt}. In addition, you might use the vocucabulary, language, and style of the following context:
  {context}
  Now answer this: {input}`
  );

  const chain = await createStuffDocumentsChain({
    llm: model,
    prompt,
  });
  // const dir = 'transcripts';
  // const files = fs.readdirSync(dir);

  // for (const file of files) {
  //   if (path.extname(file) === '.txt') {
  //     const filePath = path.join(dir, file);
  //     const loader = new TextLoader(filePath);
  //     const docs = await loader.load();
  //   }
  // }

  // const loader = new TextLoader('transcripts/_-AfhLQfb6w.txt');
  // const docs = await loader.load();

  const loader = new DirectoryLoader('transcripts', {
    '.txt': (path) => new TextLoader(path),
  });
  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 20,
  });
  const splitDocs = await splitter.splitDocuments(docs);

  const vectorstore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings
  );
  const retriever = vectorstore.asRetriever({ k: 2 });
  const retrievalChain = await createRetrievalChain({
    combineDocsChain: chain,
    retriever,
  });
  const response = await retrievalChain.invoke({
    input:
      'Hi MattGPT! Please introduce yourself for the audience here at the Bell House, Brooklyn. Tell us what you are here to do.',
  });

  console.log(response);
}
