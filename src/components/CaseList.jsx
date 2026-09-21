import React, { useState, useEffect } from 'react';
import { useCIRA } from '../context/CIRAContext.jsx';

function priorityBadge(priority) {
  const p = (priority || '').toLowerCase();
  if (p === 'critical') return 'badge-danger';
  if (p === 'high') return 'badge-warning';
  if (p === 'medium') return 'badge-info';
  return 'badge-neutral';
}

function statusBadge(status) {
  const s = (status || '').toLowerCase();
  if (s === 'active' || s === 'critical') return 'badge-success';
  if (s === 'under review') return 'badge-warning';
  return 'badge-neutral';
}

export default function CaseList() {
  const { cases, loadingCases, openCaseWorkspace, refreshCases } = useCIRA();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  useEffect(() => {
    refreshCases();
  }, [refreshCases]);

  const filtered = cases.filter(c => {
    const matchSearch = !search ||
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.id?.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchPriority = priorityFilter === 'ALL' || c.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  return (
    <div>
      {/* Filters */}
      <div style={{
        display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap',
      }}>
        <input
          type="text"
          placeholder="Search cases..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: '200px', padding: '10px 14px',
            background: 'var(--bg-surface)', border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-md)', color: 'var(--text)', fontSize: '0.85rem', outline: 'none',
          }}
          onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
          onBlur={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{
            padding: '10px 14px', background: 'var(--bg-surface)',
            border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)',
            color: 'var(--text)', fontSize: '0.85rem', outline: 'none',
          }}
        >
          <option value="ALL">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Critical">Critical</option>
          <option value="Under Review">Under Review</option>
        </select>
        <select
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value)}
          style={{
            padding: '10px 14px', background: 'var(--bg-surface)',
            border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)',
            color: 'var(--text)', fontSize: '0.85rem', outline: 'none',
          }}
        >
          <option value="ALL">All Priorities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Stats row */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '12px', marginBottom: '24px',
      }}>
        <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Cases</p>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, marginTop: '4px' }}>{cases.length}</p>
        </div>
        <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Critical</p>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, marginTop: '4px', color: 'var(--danger)' }}>
            {cases.filter(c => c.priority === 'Critical').length}
          </p>
        </div>
        <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active</p>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, marginTop: '4px', color: 'var(--success)' }}>
            {cases.filter(c => c.status === 'Active' || c.status === 'Critical').length}
          </p>
        </div>
      </div>

      {/* Case cards */}
      {loadingCases ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>Loading case dockets...</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No cases match your filters.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(c => (
            <div
              key={c.id}
              onClick={() => openCaseWorkspace(c)}
              style={{
                background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)',
                padding: '20px 24px', border: '1px solid var(--border)',
                cursor: 'pointer', transition: 'all 150ms',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.background = 'var(--bg-elevated)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-surface)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{c.id}</span>
                    <span className={`badge ${priorityBadge(c.priority)}`}>{c.priority}</span>
                    <span className={`badge ${statusBadge(c.status)}`}>{c.status}</span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem' }}>{c.title}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.5 }}>
                    {c.description?.slice(0, 140)}{c.description?.length > 140 ? '...' : ''}
                  </p>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    <span>Investigator: {c.investigator}</span>
                    <span>Evidence: {c.evidence_count || 0}</span>
                    <span>Entities: {c.entity_count || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
