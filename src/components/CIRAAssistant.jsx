import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api.js';

function processCiraFallback(query, caseId) {
  const q = (query || '').toLowerCase().trim();

  if (['hi', 'hello', 'hey', 'greetings'].some(g => q === g || q.startsWith(g + ' '))) {
    return `Hello! I'm CIRA, your investigation copilot for ${caseId}. What would you like to look into today?`;
  }
  if (q.includes('who are you') || q.includes('what can you do')) {
    return "I'm CIRA (CrimeNet Intelligence & Reasoning Assistant). You can chat with me about case strategy, examine suspect ties, audit wiretaps, or brainstorm next steps.";
  }
  if (q.includes('viktor') || q.includes('voronin')) {
    return "Viktor Voronin is the CRITICAL priority target. He commands field operations and is linked to Darius Vance for logistics. Financial flows route through Elena Rostova's escrow channels.";
  }
  if (q.includes('suspect') || q.includes('who are the')) {
    return "Primary suspects in this case:\n• Viktor Voronin — Syndicate Head (CRITICAL)\n• Darius Vance — Logistics Courier (HIGH)\n• Elena Rostova — Financial Escrow (MEDIUM)";
  }
  if (q.includes('summar') || q.includes('overview')) {
    return `Case ${caseId} involves cross-border syndicate activity. Key evidence includes microwave tap intercepts, CCTV footage, and financial ledger analysis. The syndicate graph has 7 nodes and 6 verified edges.`;
  }
  return `That's an interesting point regarding "${query}". Looking across our active intelligence records, we can trace connection paths between targets, audit wiretap transcripts, or review case timelines. How would you like to proceed?`;
}

export default function CIRAAssistant() {
  const [messages, setMessages] = useState([
    { sender: 'assistant', text: "Hello Agent. I am CIRA, your Criminal Intelligence & Reasoning Assistant. How may I assist your inquiry? You can ask about suspects, case summaries, or evidence analysis." }
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
      const result = await api.sendCiraChatMessage('CASE #CR-2026-0142', { message: query });
      reply = result?.message || processCiraFallback(query, 'CASE #CR-2026-0142');
    } catch (err) {
      reply = processCiraFallback(query, 'CASE #CR-2026-0142');
    }

    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { sender: 'assistant', text: reply }]);
    }, 400 + Math.random() * 500);
  };

  const SUGGESTIONS = [
    'Summarize this case',
    'Who are the primary suspects?',
    'What evidence do we have?',
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{
        display: 'flex', flexDirection: 'column',
        height: 'calc(100vh - 200px)', minHeight: '400px',
        background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)',
        overflow: 'hidden', border: '1px solid var(--border)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px', borderBottom: '1px solid var(--border)',
          background: 'var(--bg-elevated)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="status-dot active" />
            <div>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>CIRA Assistant</span>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Case-aware investigation copilot</p>
            </div>
          </div>
          <span className="badge badge-success">Online</span>
        </div>

        {/* Messages */}
        <div ref={scrollRef} style={{
          flex: 1, padding: '20px', overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: '12px',
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex', width: '100%',
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            }}>
              <div style={{
                padding: '12px 16px', maxWidth: '80%',
                fontSize: '0.85rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
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
                padding: '12px 16px', borderRadius: '14px 14px 14px 4px',
                background: 'var(--bg-elevated)', fontSize: '0.8rem',
                color: 'var(--text-muted)', fontStyle: 'italic',
              }}>
                CIRA analyzing...
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div style={{ padding: '0 20px 12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => setInput(s)} style={{
                padding: '6px 12px', borderRadius: '100px',
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                fontSize: '0.75rem', color: 'var(--text-secondary)',
              }}>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} style={{
          display: 'flex', gap: '8px', padding: '16px 20px',
          borderTop: '1px solid var(--border)', background: 'var(--bg-elevated)',
        }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about suspects, evidence, case strategy..."
            style={{
              flex: 1, padding: '12px 16px', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-strong)', background: 'var(--bg)',
              color: 'var(--text)', fontSize: '0.85rem', outline: 'none',
            }}
            onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onBlur={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '12px 20px' }}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
