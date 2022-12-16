const { ImgurClient } = require("imgur");
require('dotenv').config()

const client = new ImgurClient({ clientId: process.env.IMGUR_CLIENT_ID });

const uploadImg = async (url, title, comments) => {
  const response = await client.upload({
    image: url,
    title: title,
    description: comments,
  });
  return response.data
};

module.exports = {uploadImg}
