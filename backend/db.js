const {Pool} = require('pg');
require ('dotenv').config();
console.log(process.env.DB_USER);
const pool = new Pool({
  database: "multiwordle",
  host: process.env.DB_HOST,
  password: "mv!!mv!!38838",
  user: "multiwdev",
  port: process.env.DB_PORT,
});

module.exports = pool;