const probe = require('probe-image-size');

const size = async (url) => {
  try {
    const result = await probe(url, { rejectUnauthorized: false });
    console.log(result);
    const { width, height } = result;

    if (width >= height) return true;
    else return false;
  } catch (err) {
    return true;
  }
};

module.exports = { size };
