const express = require('express');
const path = require('path');
const { createSyncTask, getSyncTask } = require('../../services/syncTaskService');
const { runReceitaSync } = require('../../services/receitaSyncRunner');
const router = express.Router();

// Inicia a sincronização
router.post('/', async (req, res) => {
  const pasta = path.join(__dirname, '../../../arquivos-receita');
  const taskId = await createSyncTask();
  res.json({ task_id: taskId });
  // Executa em background
  runReceitaSync(taskId, pasta);
});

// Consulta status da sincronização
router.get('/status/:taskId', async (req, res) => {
  const task = await getSyncTask(req.params.taskId);
  if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });
  // Log como array de linhas
  const logArr = (task.log || '').split('\n').filter(Boolean);
  res.json({
    task_id: task.id,
    status: task.status,
    progress: task.progress,
    log: logArr,
    started_at: task.started_at,
    finished_at: task.finished_at
  });
});

module.exports = router;
