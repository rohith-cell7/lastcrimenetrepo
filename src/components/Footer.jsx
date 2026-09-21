import React from 'react';

const NAV_LINKS = [
  { href: '#top', label: 'Home' },
  { href: '#who-we-are', label: 'Who we are' },
  { href: '#how-we-work', label: 'Process' },
  { href: '#services', label: 'Services' },
];

const COMPANY_LINKS = [
  { href: '#reviews', label: 'Reviews' },
  { href: '#why-choose-us', label: 'Why us?' },
  { href: '#faqs', label: 'FAQ' },
];

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '60px 0 40px',
    }}>
      <div className="container">
        <div style={{
          display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap',
          gap: '40px', marginBottom: '32px',
        }} className="footer-cols">
          <div>
            <p style={{ fontWeight: 600, marginBottom: '12px', fontSize: '0.9rem' }}>Navigate</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {NAV_LINKS.map(link => (
                <a key={link.href} href={link.href}
                  style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', transition: 'color 150ms' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontWeight: 600, marginBottom: '12px', fontSize: '0.9rem' }}>Company</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {COMPANY_LINKS.map(link => (
                <a key={link.href} href={link.href}
                  style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', transition: 'color 150ms' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px',
          paddingTop: '20px', borderTop: '1px solid var(--border)',
          fontSize: '0.78rem', color: 'var(--text-muted)',
        }}>
          <p>© 2026 CrimeNet AI. All rights reserved.</p>
          <p>Autonomous Threat Matrix & Crime Intelligence</p>
        </div>
      </div>
    </footer>
  );
}
