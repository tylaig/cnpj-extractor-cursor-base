const { updateSyncTask, appendLog } = require('./syncTaskService');
const { checkArquivosReceita, ARQUIVOS_ESPERADOS } = require('./receitaFileChecker');
const path = require('path');

async function runReceitaSync(taskId, pastaArquivos) {
  try {
    await updateSyncTask(taskId, { status: 'processando', progress: 0 });
    await appendLog(taskId, 'Iniciando sincronização...');

    // 1. Verificar arquivos
    const statusArquivos = checkArquivosReceita(pastaArquivos);
    if (statusArquivos.totalAusentes > 0) {
      await updateSyncTask(taskId, { status: 'erro', progress: 0 });
      await appendLog(taskId, 'Arquivos ausentes: ' + statusArquivos.ausentes.join(', '));
      return;
    }
    await appendLog(taskId, 'Todos os arquivos necessários estão presentes.');

    // 2. Limpar banco (exemplo: TRUNCATE)
    await appendLog(taskId, 'Limpando banco de dados...');
    // TODO: Implementar truncamento/drop das tabelas
    await updateSyncTask(taskId, { progress: 5 });

    // 3. Processar arquivos (exemplo de loop)
    let progresso = 5;
    const passo = Math.floor(90 / ARQUIVOS_ESPERADOS.length);
    for (let i = 0; i < ARQUIVOS_ESPERADOS.length; i++) {
      const nome = ARQUIVOS_ESPERADOS[i];
      await appendLog(taskId, `Processando ${nome}...`);
      // TODO: Extrair, validar, gerar CSV e fazer COPY para o banco
      progresso += passo;
      await updateSyncTask(taskId, { progress: progresso });
    }

    // 4. Finalizar
    await updateSyncTask(taskId, { status: 'finalizado', progress: 100, finished_at: new Date() });
    await appendLog(taskId, 'Sincronização concluída com sucesso!');
  } catch (err) {
    await updateSyncTask(taskId, { status: 'erro' });
    await appendLog(taskId, 'Erro durante a sincronização: ' + err.message);
  }
}

module.exports = { runReceitaSync };
