import React, { useState, useEffect } from 'react';

const FALLBACK_TARGETS = [
  { name: 'Viktor Voronin', role: 'Primary Target', threat: 'CRITICAL', color: 'var(--danger)' },
  { name: 'Darius Vance', role: 'Key Associate', threat: 'HIGH (Courier)', color: 'var(--warning)' },
  { name: 'Terminal C Harbor', role: 'Incident Nexus', threat: 'Avionics Seal Breach', color: 'var(--info)' },
];

const FALLBACK_EDGES = [
  { source: 'Viktor Voronin', relation: 'COMMANDS', target: 'Darius Vance', confidence: '95%' },
  { source: 'Viktor Voronin', relation: 'SURVEILLED_AT', target: 'Terminal C Depot', confidence: '96.4%' },
  { source: 'Darius Vance', relation: 'TAMPERED_WITH', target: 'Container TXUS-2291', confidence: '92%' },
  { source: '868MHz Jammer', relation: 'DEPLOYED_NEAR', target: 'Terminal C Depot', confidence: '94%' },
];

const FALLBACK_CASES = [
  { id: 'CASE #CR-2026-0142', title: 'Port Sovereign Infiltration', investigator: 'S/A Marcus Vance', status: 'ACTIVE', badge: 'badge-danger' },
  { id: 'CASE #CR-2026-0089', title: 'Phantom Rail Logistics', investigator: 'S/A Sarah Reyes', status: 'CRITICAL', badge: 'badge-danger' },
  { id: 'CASE #CR-2026-0044', title: 'Nightfall Escrow Laundering', investigator: 'S/A David Torres', status: 'REVIEW', badge: 'badge-warning' },
];

export default function NetworkModal({ onClose }) {
  const [cases, setCases] = useState(FALLBACK_CASES);

  useEffect(() => {
    fetch('/api/cases')
      .then(r => r.json())
      .then(data => {
        if (data?.cases?.length > 0) {
          setCases(data.cases.map(c => ({
            id: c.id,
            title: c.title,
            investigator: c.investigator || 'Unassigned',
            status: (c.status || 'ACTIVE').toUpperCase(),
            badge: c.priority === 'Critical' ? 'badge-danger' : c.status === 'Under Review' ? 'badge-warning' : 'badge-info',
          })));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border-strong)',
        borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '860px',
        maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 24px', borderBottom: '1px solid var(--border)',
          background: 'var(--bg-elevated)',
        }}>
          <div>
            <h3 style={{ fontSize: '1.25rem' }}>CrimeNet Syndicate Nexus Matrix</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Live multi-case relational link analysis & investigative leads
            </p>
          </div>
          <button onClick={onClose} style={{
            fontSize: '1.4rem', color: 'var(--text-muted)', padding: '4px 8px',
          }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Target Summary Cards */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px',
          }}>
            {FALLBACK_TARGETS.map(t => (
              <div key={t.name} style={{
                background: 'var(--bg-elevated)', padding: '14px', borderRadius: 'var(--radius-md)',
                borderLeft: `3px solid ${t.color}`,
              }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t.role}</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '4px' }}>{t.name}</div>
                <div style={{ fontSize: '0.78rem', marginTop: '2px', color: t.color }}>{t.threat}</div>
              </div>
            ))}
          </div>

          {/* Edges Table */}
          <div>
            <h4 style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', color: 'var(--text-secondary)' }}>
              Correlated Graph Edges
            </h4>
            <div style={{
              background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)',
              overflow: 'hidden', border: '1px solid var(--border)',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '10px 14px' }}>Source</th>
                    <th style={{ padding: '10px 14px' }}>Relationship</th>
                    <th style={{ padding: '10px 14px' }}>Target</th>
                    <th style={{ padding: '10px 14px' }}>Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {FALLBACK_EDGES.map((edge, i) => (
                    <tr key={i} style={{ borderBottom: i < FALLBACK_EDGES.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <td style={{ padding: '10px 14px' }}>{edge.source}</td>
                      <td style={{ padding: '10px 14px', color: 'var(--warning)' }}>{edge.relation}</td>
                      <td style={{ padding: '10px 14px' }}>{edge.target}</td>
                      <td style={{ padding: '10px 14px', color: 'var(--success)' }}>{edge.confidence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Case Dockets */}
          <div>
            <h4 style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', color: 'var(--text-secondary)' }}>
              Synchronized Case Dockets
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {cases.map(c => (
                <div key={c.id} style={{
                  background: 'var(--bg-elevated)', padding: '12px 16px', borderRadius: 'var(--radius-md)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{c.id}: {c.title}</span>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                      Lead: {c.investigator}
                    </p>
                  </div>
                  <span className={`badge ${c.badge || 'badge-info'}`}>{c.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
