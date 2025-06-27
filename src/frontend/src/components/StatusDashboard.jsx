import React, { useEffect, useState } from 'react';

export default function StatusDashboard() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/receita/status')
      .then(res => res.json())
      .then(data => {
        setStatus(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Erro ao buscar status dos arquivos.');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Carregando status...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Status dos Arquivos da Receita Federal</h2>
      <p><b>Total Esperados:</b> {status.totalEsperados}</p>
      <p><b>Presentes:</b> {status.totalPresentes}</p>
      <p><b>Ausentes:</b> {status.totalAusentes}</p>
      <p><b>Divergentes:</b> {status.totalDivergentes}</p>
      <details style={{marginTop:16}}>
        <summary style={{cursor:'pointer'}}>Ver lista de arquivos presentes</summary>
        <ul>{status.presentes.map(f => <li key={f}>{f}</li>)}</ul>
      </details>
      <details style={{marginTop:8}}>
        <summary style={{cursor:'pointer', color:'#F39C12'}}>Ver lista de ausentes</summary>
        <ul>{status.ausentes.map(f => <li key={f}>{f}</li>)}</ul>
      </details>
      {status.divergentes.length > 0 && (
        <details style={{marginTop:8}}>
          <summary style={{cursor:'pointer', color:'#E74C3C'}}>Ver arquivos divergentes</summary>
          <ul>{status.divergentes.map(f => <li key={f}>{f}</li>)}</ul>
        </details>
      )}
    </div>
  );
}
