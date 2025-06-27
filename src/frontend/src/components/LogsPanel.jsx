import React from 'react';

export default function LogsPanel({ logs }) {
  return (
    <div style={{background:'#F8F9FA',border:'1px solid #ddd',borderRadius:6,padding:16,marginTop:16,maxHeight:200,overflowY:'auto',fontFamily:'monospace',fontSize:14}}>
      <b>Logs:</b>
      <pre style={{whiteSpace:'pre-wrap'}}>{logs.join('\n')}</pre>
    </div>
  );
}
