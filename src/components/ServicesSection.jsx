import React from 'react';

const SERVICES = [
  {
    number: '01',
    title: 'Analyze',
    tags: ['Workflow Audit', 'Data Mapping', 'Insights'],
    description: 'We ingest and parse unstructured incident documents, microwave intercepts, and call records to isolate entities and link syndicates automatically.',
  },
  {
    number: '02',
    title: 'Build & Link',
    tags: ['Syndicate Nexus', 'Graph Topology', 'Entity Resolution'],
    description: 'We synthesize disparate law enforcement dockets into unified relationship graphs exposing hidden crime bosses and logistics corridors.',
  },
];

export default function ServicesSection() {
  return (
    <section className="section" id="services" style={{ background: 'var(--bg-surface)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="section-label">Services</span>
          <h2 className="section-title" style={{ margin: '16px auto 0' }}>
            Digital Databases, AI Overview, Detailed Visual Reports
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {SERVICES.map(service => (
            <div key={service.number} style={{
              background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)',
              padding: '28px 25px 30px', border: '1px solid var(--border)',
              transition: 'border-color 200ms',
            }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <h3 style={{ fontSize: '1.75rem' }}>{service.title}</h3>
                  <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>{service.number}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {service.tags.map(tag => (
                    <span key={tag} className="badge badge-neutral">{tag}</span>
                  ))}
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
