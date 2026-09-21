import React, { useState, useRef, useEffect } from 'react';
import CIRAChatWidget from './CIRAChatWidget.jsx';

export default function Hero({ onRunNetwork, onEnterPlatform }) {
  return (
    <section id="top" style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '120px 24px 80px',
      overflow: 'hidden',
    }}>
      {/* Background texture */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212, 165, 90, 0.06), transparent 60%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px', textAlign: 'center', width: '100%' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '6px 14px', borderRadius: '100px',
          background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          marginBottom: '28px',
        }}>
          <span className="status-dot active" />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            SIH 2026 · Cognitive Crime Intelligence
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(3rem, 8vw, 5.5rem)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          lineHeight: 1,
          marginBottom: '20px',
        }}>
          CrimeNet
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          maxWidth: '560px',
          margin: '0 auto 36px',
        }}>
          Using AI to connect crimes, visualize syndicate networks, and give investigators
          a faster path from evidence to arrest.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={onRunNetwork} style={{ padding: '12px 24px' }}>
            Run Network
          </button>
          <a href="#how-we-work" className="btn btn-secondary" style={{ padding: '12px 24px' }}>
            How we work
          </a>
        </div>
      </div>

      {/* CIRA Chat Widget */}
      <div style={{ marginTop: '48px', width: '100%', maxWidth: '640px', position: 'relative', zIndex: 1 }}>
        <CIRAChatWidget />
      </div>

      {/* Utility ticker */}
      <div style={{ marginTop: '48px', position: 'relative', zIndex: 1 }}>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '16px' }}>
          Intelligence Engine Components
        </p>
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {['Case Intelligence Matrix', 'CIRA Neural NLP', 'Syndicate Nexus Graph', 'Forensic Triage'].map(item => (
            <span key={item} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', opacity: 0.7 }}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
