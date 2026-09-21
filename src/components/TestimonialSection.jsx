import React from 'react';

export default function TestimonialSection() {
  return (
    <section className="section" id="reviews">
      <div className="container">
        <div style={{
          display: 'flex', justifyContent: 'center',
        }}>
          <div style={{
            maxWidth: '800px', width: '100%',
            background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)',
            padding: '40px 36px', border: '1px solid var(--border)',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            minHeight: '400px',
          }}>
            <blockquote style={{
              fontFamily: 'var(--font-serif)', fontSize: '1.5rem',
              lineHeight: 1.4, color: 'var(--text)',
            }}>
              "There are numerous such cases where NAFIS and AI intelligence has been of great help
              in simplifying even the most complex cases... 7.50 lakh criminal cases are closed
              annually due to lack of evidence."
            </blockquote>

            <div style={{ marginTop: '32px' }}>
              <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Amit Shah</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Union Home Minister, speaking at the NCRB All India Fingerprint & Crime Conference
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
