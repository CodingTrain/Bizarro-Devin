const sleep = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

module.exports = {
  sleep,
};
