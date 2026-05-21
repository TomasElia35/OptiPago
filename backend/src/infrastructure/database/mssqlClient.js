const sql = require('mssql/msnodesqlv8');
require('dotenv').config();

const config = {
  connectionString: 'Driver={SQL Server};Server=localhost;Database=optipago;Trusted_Connection=yes;'
};

let pool;

async function getPool() {
  if (!pool) {
    try {
      pool = await sql.connect(config);
      console.log('Connected to SQL Server');
    } catch (err) {
      console.error('Database connection failed:', err);
      throw err;
    }
  }
  return pool;
}

module.exports = {
  getPool,
  sql,
};
