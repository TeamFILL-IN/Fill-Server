const probe = require('probe-image-size');


const size = async (url) => {
  const result = await probe(url, { rejectUnauthorized: false })
  
  const { width, height } = result

  if ( width > height ) return true
  else return false
}

module.exports = { size };