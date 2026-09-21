import React from 'react';

const STATS = [
  { value: '~750,000', label: 'Cases closed annually', location: 'India' },
  { value: '30,000+', label: 'Prosecutions collapsed', location: 'United Kingdom' },
  { value: 'Dropping', label: 'Clearance rates', location: 'United States' },
];

export default function AboutSection({ onRunNetwork }) {
  return (
    <section className="section" id="who-we-are">
      <div className="container">
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px',
          alignItems: 'flex-end',
        }} className="about-grid">
          {/* Left */}
          <div>
            <span className="section-label">How it works</span>
            <h2 className="section-title">
              Built to create databases and visual systems to analyze crimes from reports.
            </h2>
            <div style={{ marginTop: '28px' }}>
              <button className="btn btn-primary" onClick={onRunNetwork}>
                Run Network
              </button>
            </div>
          </div>

          {/* Right - Stats card */}
          <div style={{
            background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)',
            padding: '28px', border: '1px solid var(--border)',
          }}>
            <div style={{ marginBottom: '24px' }}>
              <span style={{
                fontFamily: 'var(--font-serif)', fontSize: '3.5rem',
                fontWeight: 700, color: 'var(--accent)', lineHeight: 1,
              }}>
                750,000+
              </span>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '8px' }}>
                Cases Unsolved
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                approx 23% of all Indian Penal Code (IPC) cases
              </p>
            </div>

            <p style={{
              fontSize: '0.82rem', color: 'var(--text-secondary)',
              lineHeight: 1.6, marginBottom: '20px',
            }}>
              Roughly 750,000 police cases are closed annually because of "lack of evidence,"
              "untraced leads," or "no clue."
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {STATS.map((stat, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: i < STATS.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <span style={{ fontSize: '0.85rem' }}>{stat.value} {stat.label}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{stat.location}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </section>
  );
}
