import React, { useState, useEffect } from 'react';
import { useCIRA } from '../context/CIRAContext.jsx';
import { api } from '../services/api.js';
import EvidencePanel from './EvidencePanel.jsx';

export default function CaseDetail() {
  const { activeCase, openDashboard } = useCIRA();
  const [caseData, setCaseData] = useState(null);
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!activeCase) return;
    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        const detail = await api.getCase(activeCase.id);
        if (!cancelled) {
          setCaseData(detail);
          setEvidence(detail.evidence || []);
        }
      } catch (e) {
        if (!cancelled) setCaseData(activeCase);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [activeCase]);

  if (!activeCase) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <p style={{ color: 'var(--text-muted)' }}>No case selected.</p>
        <button className="btn btn-secondary" onClick={openDashboard} style={{ marginTop: '12px' }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (loading) {
    return <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>Loading case detail...</p>;
  }

  const c = caseData || activeCase;

  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'evidence', label: 'Evidence' },
    { id: 'timeline', label: 'Timeline' },
  ];

  return (
    <div>
      {/* Back button */}
      <button onClick={openDashboard} style={{
        color: 'var(--text-secondary)', fontSize: '0.82rem',
        display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px',
      }}>
        ← All Cases
      </button>

      {/* Case header */}
      <div style={{
        background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)',
        padding: '24px 28px', border: '1px solid var(--border)', marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{c.id}</span>
          <span className={`badge ${c.priority === 'Critical' ? 'badge-danger' : c.priority === 'High' ? 'badge-warning' : 'badge-info'}`}>
            {c.priority}
          </span>
          <span className={`badge ${c.status === 'Active' || c.status === 'Critical' ? 'badge-success' : 'badge-warning'}`}>
            {c.status}
          </span>
        </div>
        <h2 style={{ fontSize: '1.4rem' }}>{c.title}</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.6 }}>
          {c.description}
        </p>
        <div style={{ display: 'flex', gap: '24px', marginTop: '16px', fontSize: '0.78rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
          <span>Investigator: {c.investigator}</span>
          <span>Reference: {c.reference_no}</span>
          <span>Opened: {c.created_date}</span>
          <span>Last Updated: {c.last_updated}</span>
        </div>
        {c.tags && c.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', marginTop: '12px', flexWrap: 'wrap' }}>
            {c.tags.map(tag => (
              <span key={tag} className="badge badge-neutral">{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', borderBottom: '1px solid var(--border)' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 16px', fontSize: '0.82rem', fontWeight: 500,
              color: activeTab === tab.id ? 'var(--text)' : 'var(--text-secondary)',
              borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
              transition: 'all 150ms',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Evidence Items</p>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 700, marginTop: '4px' }}>
              {c.evidence_count || evidence.length || 0}
            </p>
          </div>
          <div style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Entities Tracked</p>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 700, marginTop: '4px' }}>
              {c.entity_count || 0}
            </p>
          </div>
          <div style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Investigation Status</p>
            <p style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '8px' }}>
              {c.investigation_status || c.status}
            </p>
          </div>
        </div>
      )}

      {activeTab === 'evidence' && <EvidencePanel evidence={evidence} caseId={c.id} />}

      {activeTab === 'timeline' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {(c.timeline || [
            { date: c.created_date, event: `Case opened: ${c.title}`, author: c.investigator },
            { date: c.last_updated, event: 'Automated intelligence cross-reference completed', author: 'CIRA Engine' },
          ]).map((item, i) => (
            <div key={i} style={{
              display: 'flex', gap: '16px', alignItems: 'flex-start',
              background: 'var(--bg-surface)', padding: '16px 20px', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
            }}>
              <div style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: 'var(--accent)', marginTop: '4px', flexShrink: 0,
              }} />
              <div>
                <p style={{ fontSize: '0.82rem', fontWeight: 500 }}>{item.event}</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {item.date} · {item.author}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
