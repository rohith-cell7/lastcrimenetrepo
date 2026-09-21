import React, { useState } from 'react';
import { useCIRA } from '../context/CIRAContext.jsx';
import CaseList from './CaseList.jsx';
import CaseDetail from './CaseDetail.jsx';
import CIRAAssistant from './CIRAAssistant.jsx';
import CreateCaseModal from './CreateCaseModal.jsx';
import { api } from '../services/api.js';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'cases', label: 'Case Dockets' },
  { id: 'evidence', label: 'Evidence Vault' },
  { id: 'cira', label: 'CIRA Assistant' },
];

export default function InvestigationWorkstation({ currentUser, onLogout }) {
  const { activeView, setActiveView, openDashboard } = useCIRA();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const user = currentUser?.user || {};
  const fullName = user.full_name || 'Investigator';
  const initials = fullName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px', flexShrink: 0,
        background: 'var(--bg-surface)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 50,
      }} className="ws-sidebar">
        {/* Logo */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'var(--bg-elevated)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)',
          }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 700, color: 'var(--accent)' }}>C</span>
          </div>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 600 }}>CrimeNet</span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveView(item.id); openDashboard(); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 14px', borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem', fontWeight: 500,
                color: activeView === item.id ? 'var(--text)' : 'var(--text-secondary)',
                background: activeView === item.id ? 'var(--bg-elevated)' : 'transparent',
                transition: 'all 150ms',
                textAlign: 'left', width: '100%',
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* User + Logout */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '8px', borderRadius: 'var(--radius-md)', marginBottom: '8px',
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'var(--bg-elevated)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)',
            }}>
              {initials}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: '0.78rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fullName}</p>
              <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{user.role || 'Analyst'}</p>
            </div>
          </div>
          <button onClick={onLogout} style={{
            width: '100%', padding: '8px', borderRadius: 'var(--radius-md)',
            fontSize: '0.78rem', color: 'var(--text-secondary)',
            transition: 'color 150ms',
          }} onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile sidebar toggle */}
      <button onClick={() => setMobileNavOpen(!mobileNavOpen)} style={{
        position: 'fixed', top: '12px', left: '12px', zIndex: 60,
        display: 'none', padding: '8px', color: 'var(--text)',
      }} className="ws-mobile-toggle">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>

      {/* Main content */}
      <main style={{
        flex: 1, marginLeft: '240px', padding: '32px',
        minHeight: '100vh',
      }} className="ws-main">
        {/* Top bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '24px',
        }}>
          <div>
            <h1 style={{ fontSize: '1.5rem' }}>
              {activeView === 'case-detail' ? 'Case Detail' : NAV_ITEMS.find(n => n.id === activeView)?.label || 'Dashboard'}
            </h1>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            + New Case
          </button>
        </div>

        {/* Content area */}
        {activeView === 'case-detail' ? (
          <CaseDetail />
        ) : activeView === 'cira' ? (
          <CIRAAssistant />
        ) : (
          <CaseList />
        )}
      </main>

      {/* Create case modal */}
      {showCreateModal && <CreateCaseModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />}

      {/* Mobile overlay */}
      {mobileNavOpen && (
        <div onClick={() => setMobileNavOpen(false)} style={{
          position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.5)',
          display: 'none',
        }} className="ws-mobile-overlay" />
      )}

      <style>{`
        @media (max-width: 768px) {
          .ws-sidebar { transform: translateX(${mobileNavOpen ? '0' : '-100%'}); transition: transform 200ms; }
          .ws-main { margin-left: 0 !important; padding: 60px 16px 32px !important; }
          .ws-mobile-toggle { display: block !important; }
          .ws-mobile-overlay { display: ${mobileNavOpen ? 'block' : 'none'} !important; }
        }
      `}</style>
    </div>
  );
}
