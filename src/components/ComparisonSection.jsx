import React from 'react';

const WITH_CRIMENET = [
  'Real-Time Multi-Case Correlation',
  'Autonomous Entity Resolution',
  'Explainable Tactical Leads',
  'Interactive Graph & Wiretap Analysis',
];

const WITHOUT = [
  'Siloed Paper Dockets & Excel Sheets',
  'Missed Cross-Border Syndicate Links',
  'Months to Extract Phone Call Patterns',
  'Cases Cold Due to Lack of Traced Clues',
];

export default function ComparisonSection() {
  return (
    <section className="section" id="why-choose-us" style={{ background: 'var(--bg-surface)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="section-label">Why Choose CrimeNet</span>
          <h2 className="section-title" style={{ margin: '16px auto 0' }}>
            This is what makes our crime matrix different.
          </h2>
        </div>

        <div style={{
          display: 'flex', gap: '14px', maxWidth: '910px', margin: '0 auto',
          background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)',
          padding: '5px', border: '1px solid var(--border)',
        }} className="comparison-container">
          {/* With CrimeNet */}
          <div style={{
            flex: 1, borderRadius: 'var(--radius-md)', padding: '28px',
            display: 'flex', flexDirection: 'column', gap: '24px',
          }}>
            <h3 style={{ fontSize: '1.5rem' }}>With CrimeNet AI</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {WITH_CRIMENET.map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: 'var(--success)', fontSize: '0.9rem', marginTop: '1px' }}>✓</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Without */}
          <div style={{
            flex: 1, borderRadius: 'var(--radius-md)', padding: '28px',
            display: 'flex', flexDirection: 'column', gap: '24px',
            background: 'var(--bg-surface)',
          }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>Manual Police Methods</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {WITHOUT.map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: 'var(--danger)', fontSize: '0.9rem', marginTop: '1px' }}>✕</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .comparison-container { flex-direction: column !important; }
        }
      `}</style>
    </section>
  );
}
