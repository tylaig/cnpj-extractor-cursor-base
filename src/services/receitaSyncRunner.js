const { updateSyncTask, appendLog } = require('./syncTaskService');
const { checkArquivosReceita, ARQUIVOS_ESPERADOS } = require('./receitaFileChecker');
const path = require('path');
const fs = require('fs');
const unzipper = require('unzipper');
const csv = require('csv-parser');
const pool = require('../config/db');

async function truncateTables(taskId) {
  try {
    await appendLog(taskId, 'Truncando tabelas principais...');
    // Adicione todas as tabelas relevantes aqui
    await pool.query('TRUNCATE empresas RESTART IDENTITY CASCADE');
    await pool.query('TRUNCATE estabelecimentos RESTART IDENTITY CASCADE');
    await pool.query('TRUNCATE socios RESTART IDENTITY CASCADE');
    await pool.query('TRUNCATE cnaes RESTART IDENTITY CASCADE');
    await pool.query('TRUNCATE naturezas RESTART IDENTITY CASCADE');
    await pool.query('TRUNCATE municipios RESTART IDENTITY CASCADE');
    await pool.query('TRUNCATE motivos RESTART IDENTITY CASCADE');
    await pool.query('TRUNCATE paises RESTART IDENTITY CASCADE');
    await pool.query('TRUNCATE qualificacoes RESTART IDENTITY CASCADE');
    await pool.query('TRUNCATE simples RESTART IDENTITY CASCADE');
    await appendLog(taskId, 'Tabelas truncadas com sucesso.');
  } catch (err) {
    await appendLog(taskId, 'Erro ao truncar tabelas: ' + err.message);
    throw err;
  }
}

async function processEmpresasZip(taskId, zipPath, tableName) {
  await appendLog(taskId, `Extraindo e processando ${zipPath}...`);
  let total = 0;
  let inseridos = 0;
  let erros = 0;
  const BATCH_SIZE = 10000;
  let batch = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(zipPath)
      .pipe(unzipper.Parse())
      .on('entry', function (entry) {
        if (entry.path.endsWith('.csv') || entry.path.endsWith('.txt')) {
          entry
            .pipe(csv({ separator: ';' }))
            .on('data', async (row) => {
              total++;
              // Exemplo: ajuste os campos conforme o layout real
              const cnpj = (row.cnpj || '').replace(/\D/g, '');
              const razao_social = row.razao_social || '';
              if (!cnpj || !razao_social) {
                erros++;
                return;
              }
              batch.push([cnpj, razao_social]);
              if (batch.length >= BATCH_SIZE) {
                try {
                  await pool.query('INSERT INTO empresas (cnpj, razao_social) VALUES ' + batch.map((_,i)=>`($${i*2+1},$${i*2+2})`).join(', '), batch.flat());
                  inseridos += batch.length;
                  await updateSyncTask(taskId, { progress: Math.min(99, Math.floor((inseridos/total)*100)) });
                  await appendLog(taskId, `Inseridos ${inseridos} registros até agora...`);
                  batch = [];
                } catch (err) {
                  erros += batch.length;
                  await appendLog(taskId, `Erro ao inserir lote: ${err.message}`);
                  batch = [];
                }
              }
            })
            .on('end', async () => {
              if (batch.length > 0) {
                try {
                  await pool.query('INSERT INTO empresas (cnpj, razao_social) VALUES ' + batch.map((_,i)=>`($${i*2+1},$${i*2+2})`).join(', '), batch.flat());
                  inseridos += batch.length;
                } catch (err) {
                  erros += batch.length;
                  await appendLog(taskId, `Erro ao inserir lote final: ${err.message}`);
                }
              }
              await appendLog(taskId, `Processamento de ${zipPath} finalizado. Total: ${total}, Inseridos: ${inseridos}, Erros: ${erros}`);
              resolve();
            });
        } else {
          entry.autodrain();
        }
      })
      .on('error', reject);
  });
}

async function runReceitaSync(taskId, pastaArquivos) {
  try {
    await updateSyncTask(taskId, { status: 'processando', progress: 0 });
    await appendLog(taskId, 'Iniciando sincronização...');
    const statusArquivos = checkArquivosReceita(pastaArquivos);
    if (statusArquivos.totalAusentes > 0) {
      await updateSyncTask(taskId, { status: 'erro', progress: 0 });
      await appendLog(taskId, 'Arquivos ausentes: ' + statusArquivos.ausentes.join(', '));
      return;
    }
    await appendLog(taskId, 'Todos os arquivos necessários estão presentes.');
    await appendLog(taskId, 'Limpando banco de dados...');
    await truncateTables(taskId);
    await updateSyncTask(taskId, { progress: 5 });

    // Processar todos os arquivos EmpresasX.zip
    for (let i = 0; i <= 9; i++) {
      const zipPath = path.join(pastaArquivos, `Empresas${i}.zip`);
      await processEmpresasZip(taskId, zipPath, 'empresas');
      await updateSyncTask(taskId, { progress: 5 + (i+1)*5 });
    }
    // TODO: Expandir para os demais arquivos (Estabelecimentos, Socios, etc)

    await updateSyncTask(taskId, { progress: 100, status: 'finalizado', finished_at: new Date() });
    await appendLog(taskId, 'Sincronização concluída com sucesso!');
  } catch (err) {
    await updateSyncTask(taskId, { status: 'erro' });
    await appendLog(taskId, 'Erro durante a sincronização: ' + err.message);
  }
}

module.exports = { runReceitaSync };
