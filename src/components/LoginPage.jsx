import React, { useState } from 'react';
import { api } from '../services/api.js';

export default function LoginPage({ onLoginSuccess, onBack }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId.trim() || !password.trim()) {
      setError('Both fields are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await api.login(userId, password);
      onLoginSuccess(result);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '24px',
      background: 'var(--bg)',
    }}>
      {/* Back link */}
      <button onClick={onBack} style={{
        position: 'absolute', top: '24px', left: '24px',
        color: 'var(--text-secondary)', fontSize: '0.85rem',
        display: 'flex', alignItems: 'center', gap: '6px',
      }}>
        ← Back to site
      </button>

      <div style={{
        width: '100%', maxWidth: '420px',
        background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)',
        padding: '40px 32px', border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-lg)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: 'var(--bg-elevated)', display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center',
            border: '1px solid var(--border)', marginBottom: '16px',
          }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent)' }}>C</span>
          </div>
          <h1 style={{ fontSize: '1.5rem' }}>CrimeNet AI</h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Investigation Workstation Access
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              USER ID OR EMAIL
            </label>
            <input
              type="text"
              value={userId}
              onChange={e => setUserId(e.target.value)}
              placeholder="agent.vance@crimenet.gov"
              style={{
                width: '100%', padding: '11px 14px',
                background: 'var(--bg)', border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-md)', color: 'var(--text)', fontSize: '0.85rem',
                outline: 'none', transition: 'border-color 150ms',
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%', padding: '11px 14px',
                background: 'var(--bg)', border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-md)', color: 'var(--text)', fontSize: '0.85rem',
                outline: 'none', transition: 'border-color 150ms',
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
            />
          </div>

          {error && (
            <div style={{
              padding: '10px 14px', borderRadius: 'var(--radius-sm)',
              background: 'var(--danger-dim)', color: 'var(--danger)',
              fontSize: '0.78rem',
            }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary"
            style={{ padding: '12px', width: '100%', opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Authenticating...' : 'Access Workstation'}
          </button>
        </form>

        <p style={{
          textAlign: 'center', marginTop: '20px',
          fontSize: '0.75rem', color: 'var(--text-muted)',
        }}>
          Demo mode: any credentials will authenticate.
        </p>
      </div>
    </div>
  );
}
