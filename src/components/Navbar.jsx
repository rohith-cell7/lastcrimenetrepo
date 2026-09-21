import React, { useState, useEffect } from 'react';

const NAV_LINKS = [
  { href: '#who-we-are', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#how-we-work', label: 'Process' },
  { href: '#why-choose-us', label: 'Why Us' },
  { href: '#faqs', label: 'FAQ' },
];

export default function Navbar({ onEnterPlatform }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 100,
      background: scrolled ? 'rgba(17, 16, 14, 0.85)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      transition: 'all 200ms ease',
    }}>
      <div className="container" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px',
      }}>
        <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '8px',
            background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid var(--border)',
          }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent)' }}>C</span>
          </div>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.01em' }}>
            CrimeNet
          </span>
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div style={{ display: 'flex', gap: '28px' }} className="nav-links-desktop">
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href}
                style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', transition: 'color 150ms' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                {link.label}
              </a>
            ))}
          </div>

          <button className="btn btn-primary" onClick={onEnterPlatform}>
            Enter Platform
          </button>

          <button
            className="nav-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ display: 'none', padding: '8px', color: 'var(--text)' }}
            aria-label="Menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen
                ? <path d="M18 6L6 18M6 6l12 12" />
                : <path d="M3 12h18M3 6h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '8px',
          padding: '12px 24px 20px',
          borderTop: '1px solid var(--border)',
          background: 'var(--bg-surface)',
        }} className="nav-mobile-menu">
          {NAV_LINKS.map(link => (
            <a key={link.href} href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', padding: '8px 0' }}>
              {link.label}
            </a>
          ))}
          <button className="btn btn-primary" onClick={() => { setMobileOpen(false); onEnterPlatform(); }}
            style={{ marginTop: '8px' }}>
            Enter Platform
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .nav-mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
