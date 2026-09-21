import React, { useState, useRef, useEffect } from 'react';

function processCiraQuery(query) {
  const q = (query || '').toLowerCase().trim();

  if (q.includes('viktor') || q.includes('voronin')) {
    return "Viktor Voronin is flagged as CRITICAL in Case #CR-2026-0142. Biometric and telecommunications intercepts confirm his presence at Harbor Terminal C during the avionics seal breach. He is linked directly to Darius Vance and suspected of directing regional logistics.";
  }
  if (q.includes('vance') || q.includes('darius')) {
    return "Darius Vance is identified as an active field operative for the Apex Syndicate. Registered driver of Black SUV (VIN: 7829-K) spotted leaving Harbor Terminal C at 04:22 UTC. Microwave tap indicates incoming tactical orders from Voronin.";
  }
  if (q.includes('case') || q.includes('investigation') || q.includes('open') || q.includes('status')) {
    return "Active Taskforce Cases:\n• CASE #CR-2026-0142: Port Sovereign Infiltration (High Priority)\n• CASE #CR-2026-0089: Phantom Rail Logistics (Critical Priority)\n• CASE #CR-2026-0044: Nightfall Escrow Laundering (Medium Priority)";
  }
  if (q.includes('port') || q.includes('terminal') || q.includes('harbor') || q.includes('container')) {
    return "Incident analysis for Harbor Terminal C: Seal breach detected on Container TXUS-2291 containing high-precision avionics hardware. Optical analysis confirmed security cameras were disrupted using an 868MHz RF jammer. Viktor Voronin and Darius Vance are primary persons of interest.";
  }
  if (q.includes('network') || q.includes('syndicate') || q.includes('graph') || q.includes('nexus')) {
    return "Syndicate Graph active: 7 verified nodes and 6 cross-case edges. Core nexus isolates Viktor Voronin commanding field distribution while offshore liquidity routes through Nightfall escrow channels.";
  }
  if (q.includes('evidence') || q.includes('call') || q.includes('cctv') || q.includes('tap')) {
    return "Chain of custody currently tracks 3 validated forensic items:\n• [Call Records] Call_Record_Microwave_Tap.csv\n• [Documents] FIR_Customs_Port_Report.pdf\n• [Images] CCTV_Terminal_C_Frame_0418.jpg";
  }
  return `CrimeNet CIRA Cognitive Matrix online. Query processed: "${query}". You can ask about suspect profiles (Viktor Voronin, Darius Vance), check active case dockets, request incident forensics, or examine the syndicate network graph.`;
}

export default function CIRAChatWidget() {
  const [messages, setMessages] = useState([
    { sender: 'assistant', text: "Greetings, Investigator. I am the CrimeNet CIRA reasoning assistant. Ask me about active cases, suspect dossiers, or forensic evidence." }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const query = input.trim();
    if (!query) return;

    setMessages(prev => [...prev, { sender: 'user', text: query }]);
    setInput('');
    setTyping(true);

    let reply;
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (res.ok) {
        const data = await res.json();
        reply = data.response || 'Intelligence processed.';
      } else {
        reply = processCiraQuery(query);
      }
    } catch (err) {
      reply = processCiraQuery(query);
    }

    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { sender: 'assistant', text: reply }]);
    }, 400 + Math.random() * 600);
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      width: '100%', height: '340px',
      background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)',
      overflow: 'hidden', border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-md)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', borderBottom: '1px solid var(--border)',
        background: 'var(--bg-elevated)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="status-dot active" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>CIRA Intelligence Assistant</span>
        </div>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Live</span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{
        flex: 1, padding: '16px', overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: '10px',
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex', width: '100%',
            justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
          }}>
            <div style={{
              padding: '10px 14px', maxWidth: '85%',
              fontSize: '0.8rem', lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              borderRadius: msg.sender === 'user'
                ? '14px 14px 4px 14px'
                : '14px 14px 14px 4px',
              background: msg.sender === 'user' ? 'var(--accent)' : 'var(--bg-elevated)',
              color: msg.sender === 'user' ? 'var(--bg)' : 'var(--text)',
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {typing && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '10px 14px', borderRadius: '14px 14px 14px 4px',
              background: 'var(--bg-elevated)', fontSize: '0.75rem',
              color: 'var(--text-muted)', fontStyle: 'italic',
            }}>
              CIRA analyzing intelligence matrix...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} style={{
        display: 'flex', gap: '8px', padding: '12px',
        borderTop: '1px solid var(--border)', background: 'var(--bg-elevated)',
      }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Query active cases, evidence, or persons of interest..."
          style={{
            flex: 1, padding: '10px 14px', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-strong)', background: 'var(--bg)',
            color: 'var(--text)', fontSize: '0.8rem', outline: 'none',
            transition: 'border-color 150ms',
          }}
          onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
          onBlur={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
        />
        <button type="submit" className="btn btn-primary" style={{ padding: '10px 18px' }}>
          Send
        </button>
      </form>
    </div>
  );
}
