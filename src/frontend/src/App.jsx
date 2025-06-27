import React, { useState, useRef } from 'react';
import StatusDashboard from './components/StatusDashboard';
import SyncButton from './components/SyncButton';
import LogsPanel from './components/LogsPanel';
import ProgressBar from './components/ProgressBar';

export default function App() {
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('aguardando');
  const [taskId, setTaskId] = useState(null);
  const pollingRef = useRef(null);

  const handleLog = (msg) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const startPolling = (id) => {
    setTaskId(id);
    setLogs([]);
    setProgress(0);
    setStatus('processando');
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(async () => {
      const res = await fetch(`/api/receita/sync/status/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProgress(data.progress);
        setStatus(data.status);
        setLogs(data.log.map(l => `[${new Date().toLocaleTimeString()}] ${l}`));
        if (data.status === 'finalizado' || data.status === 'erro') {
          clearInterval(pollingRef.current);
        }
      }
    }, 1500);
  };

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001', padding: 32 }}>
      <h1 style={{ color: '#1B4F72', marginBottom: 24 }}>CNPJ Extractor Dashboard</h1>
      <StatusDashboard />
      <SyncButton onLog={handleLog} onStartSync={startPolling} />
      <ProgressBar progress={progress} status={status} />
      <LogsPanel logs={logs} />
    </div>
  );
}
