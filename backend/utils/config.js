require('dotenv').config();

const { PORT } = process.env;
const { API_URL } = process.env;

module.exports = {
  API_URL,
  PORT,
};
