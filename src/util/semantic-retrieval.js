const { join } = require('path');
const { readFileSync } = require('fs');

// Load the embeddings
const embeddings = JSON.parse(
  readFileSync(join(__dirname, '../../embeddings.json'))
);

// Calculate embeddings
const getEmbeddings = async (prompt) => {
  // Load the embeddings model, have to do some cursed stuff because transformers is an ESM module
  const TransformersApi = Function('return import("@xenova/transformers")')();
  const { pipeline } = await TransformersApi;

  const extractor = await pipeline(
    'feature-extraction',
    'Xenova/bge-small-en-v1.5'
  );

  return await extractor(prompt, {
    pooling: 'mean',
    normalize: true,
  }).then((output) => output.data);
};

const dotProduct = (vecA, vecB) =>
  vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
const magnitude = (vec) =>
  Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));

const cosineSimilarity = (vecA, vecB) => {
  const numerator = dotProduct(vecA, vecB);
  const denominator = magnitude(vecA) * magnitude(vecB);
  return numerator / denominator;
};

/**
 * Query the embeddings model with a prompt
 * @param {string} prompt The prompt to query with
 * @returns {Array<{ embedding: Array<number>; text: string; }>} The top 5 results
 */
const query = async (prompt) => {
  // Calculate embeddings for our prompt
  const promptEmbeddings = await getEmbeddings(prompt);

  // Get similarities for all the scentences
  const similarities = embeddings.map((embedding) =>
    cosineSimilarity(embedding.embedding, promptEmbeddings)
  );

  // Map to the indexes and sort them according to their similarity, high to low
  const sortedIndices = similarities
    .map((_, i) => i)
    .sort((a, b) => similarities[b] - similarities[a]);

  // Get the top 5 results
  const topResults = sortedIndices.slice(0, 10).map((i) => embeddings[i]);

  // Return results
  return topResults;
};

module.exports = { query };
