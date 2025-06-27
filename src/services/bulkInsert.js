const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

/**
 * Gera um arquivo CSV temporário a partir de um array de objetos.
 * @param {Array} rows
 * @param {string[]} columns
 * @returns {Promise<string>} Caminho do arquivo CSV gerado
 */
async function generateTempCSV(rows, columns) {
  const tempPath = path.join(__dirname, '../../', `temp_empresas_${Date.now()}.csv`);
  const writeStream = fs.createWriteStream(tempPath);
  for (const row of rows) {
    const line = columns.map(col => (row[col] || '').toString().replace(/;/g, ',')).join(';') + '\n';
    writeStream.write(line);
  }
  writeStream.end();
  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => resolve(tempPath));
    writeStream.on('error', reject);
  });
}

/**
 * Executa COPY no PostgreSQL a partir de um arquivo CSV.
 * @param {string} filePath
 * @param {string[]} columns
 * @returns {Promise<void>}
 */
async function copyToPostgres(filePath, columns) {
  const client = await pool.connect();
  try {
    const tableCols = columns.join(',');
    const sql = `COPY empresas(${tableCols}) FROM '${filePath.replace(/\\/g, '/')}' DELIMITER ';' CSV`;
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
    fs.unlink(filePath, () => {});
  }
}

module.exports = { generateTempCSV, copyToPostgres };
