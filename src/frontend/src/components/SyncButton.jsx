import React, { useState } from 'react';

export default function SyncButton({ onLog, onStartSync }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleSync = async () => {
    setLoading(true);
    setSuccess(null);
    setError(null);
    onLog && onLog('Iniciando sincronização...');
    try {
      const res = await fetch('/api/receita/sync', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.task_id) {
        onStartSync && onStartSync(data.task_id);
        setSuccess('Sincronização iniciada!');
      } else {
        setError(data.error || 'Erro desconhecido.');
        onLog && onLog(data.log || 'Erro durante a sincronização.');
      }
    } catch (err) {
      setError('Erro de conexão com o backend.');
      onLog && onLog('Erro de conexão com o backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{margin:'24px 0'}}>
      <button onClick={handleSync} disabled={loading} style={{background:'#28B463',color:'#fff',padding:'12px 32px',border:'none',borderRadius:6,fontSize:18,cursor:'pointer'}}>
        {loading ? 'Sincronizando...' : 'Sincronizar Base'}
      </button>
      {success && <div style={{color:'#27AE60',marginTop:8}}>{success}</div>}
      {error && <div style={{color:'#E74C3C',marginTop:8}}>{error}</div>}
    </div>
  );
}
