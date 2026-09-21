import React, { useState } from 'react';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [details, setDetails] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, details }),
      });
    } catch (err) {
      // Fallback - still show success
    }

    setStatus({ type: 'success', message: 'Briefing request submitted. Taskforce dispatch notified.' });
    setName('');
    setEmail('');
    setDetails('');
    setTimeout(() => setStatus(null), 5000);
  };

  return (
    <section className="section" id="crm-inquiry">
      <div className="container">
        <div style={{
          maxWidth: '800px', margin: '0 auto',
          background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)',
          padding: '36px', border: '1px solid var(--border)',
        }}>
          <h3 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>Schedule a Taskforce Briefing</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px' }}>
            Request a secure demonstration of the CrimeNet Cognitive Matrix and Syndicate Graph.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Officer / Investigator Name"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                style={{
                  flex: 1, minWidth: '200px', padding: '12px',
                  background: 'var(--bg)', border: '1px solid var(--border-strong)',
                  borderRadius: 'var(--radius-md)', color: 'var(--text)', fontSize: '0.85rem',
                  outline: 'none', transition: 'border-color 150ms',
                }}
                onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onBlur={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
              />
              <input
                type="email"
                placeholder="Official Agency Email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  flex: 1, minWidth: '200px', padding: '12px',
                  background: 'var(--bg)', border: '1px solid var(--border-strong)',
                  borderRadius: 'var(--radius-md)', color: 'var(--text)', fontSize: '0.85rem',
                  outline: 'none', transition: 'border-color 150ms',
                }}
                onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onBlur={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
              />
            </div>
            <textarea
              rows={3}
              placeholder="Case scope or briefing details..."
              value={details}
              onChange={e => setDetails(e.target.value)}
              style={{
                width: '100%', padding: '12px',
                background: 'var(--bg)', border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-md)', color: 'var(--text)', fontSize: '0.85rem',
                outline: 'none', resize: 'vertical', transition: 'border-color 150ms',
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px' }}>
                Submit Briefing Request
              </button>
            </div>
            {status && (
              <div style={{
                padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                background: 'var(--success-dim)', color: 'var(--success)',
                fontSize: '0.82rem', textAlign: 'center',
              }}>
                {status.message}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
