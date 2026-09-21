import React from 'react';

const STEPS = [
  {
    number: '01',
    title: 'Discovery & Ingestion',
    description: 'We index raw evidence logs, FIR reports, and sensor streams into structured case entities.',
  },
  {
    number: '02',
    title: 'Correlation & Graphing',
    description: 'Cross-case algorithm clusters shared phone numbers, vehicle registrations, and modus operandi.',
  },
  {
    number: '03',
    title: 'Actionable Leads',
    description: 'Generate explainable tactical recommendations and arrest warrant intelligence dossiers.',
  },
];

export default function ProcessSection() {
  return (
    <section className="section" id="how-we-work">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span className="section-label">How we work</span>
          <h2 className="section-title" style={{ margin: '16px auto 0' }}>
            Getting real results without the guesswork.
          </h2>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px',
        }} className="process-grid">
          {STEPS.map(step => (
            <div key={step.number} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '16px', textAlign: 'center',
            }}>
              <div style={{
                width: '100%', height: '200px', borderRadius: 'var(--radius-lg)',
                background: 'var(--bg-surface)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', position: 'relative',
              }}>
                <span style={{
                  fontFamily: 'var(--font-serif)', fontSize: '5rem',
                  fontWeight: 700, color: 'var(--text-muted)', opacity: 0.4,
                }}>
                  {step.number}
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>{step.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '280px' }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .process-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
