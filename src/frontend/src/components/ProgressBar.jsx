import React from 'react';

export default function ProgressBar({ progress = 0, status = 'aguardando' }) {
  let color = '#1B4F72';
  if (status === 'finalizado') color = '#27AE60';
  if (status === 'erro') color = '#E74C3C';
  return (
    <div style={{margin:'16px 0'}}>
      <div style={{background:'#eee',borderRadius:6,height:24,overflow:'hidden'}}>
        <div style={{width:`${progress}%`,background:color,height:24,transition:'width 0.5s'}}></div>
      </div>
      <div style={{marginTop:4,fontSize:14}}>
        Status: <b>{status}</b> | Progresso: <b>{progress}%</b>
      </div>
    </div>
  );
}
