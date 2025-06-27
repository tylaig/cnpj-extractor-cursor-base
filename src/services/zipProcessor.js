const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');
const csv = require('csv-parser');

/**
 * Extrai arquivos de um ZIP e processa os CSVs encontrados.
 * @param {string} zipPath Caminho do arquivo ZIP
 * @param {function} onRow Callback para cada linha processada
 * @returns {Promise<void>}
 */
async function processZip(zipPath, onRow) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(zipPath)
      .pipe(unzipper.Parse())
      .on('entry', function (entry) {
        const fileName = entry.path;
        if (fileName.endsWith('.csv') || fileName.endsWith('.txt')) {
          entry
            .pipe(csv({ separator: ';' }))
            .on('data', onRow)
            .on('end', () => entry.autodrain());
        } else {
          entry.autodrain();
        }
      })
      .on('close', resolve)
      .on('error', reject);
  });
}

module.exports = { processZip };
