import React, { useState } from 'react';

const FAQS = [
  {
    question: 'How does CrimeNet ingest disparate evidence?',
    answer: 'The system supports call detail records (CSV), FIR incident PDFs, and optical CCTV footage, running neural named-entity recognition to map people, vehicles, and locations.',
  },
  {
    question: 'What is the setup time for field deployment?',
    answer: 'The local intelligence backend runs as a standalone self-contained service with instant zero-configuration deployment across law enforcement cloud environments.',
  },
  {
    question: 'Is the data stored securely and case-isolated?',
    answer: 'Yes. All intelligence artifacts are strictly partitioned by case ID. Queries for one docket will never leak entities or edges from another. The graph database enforces row-level isolation.',
  },
  {
    question: 'Can CrimeNet connect crimes across jurisdictions?',
    answer: 'Absolutely. Cross-case algorithm clusters shared phone numbers, vehicle registrations, and modus operandi to expose hidden syndicate links that span multiple jurisdictions.',
  },
];

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div style={{
      background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)',
      padding: '22px 24px', border: '1px solid var(--border)',
      transition: 'border-color 200ms',
    }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
      <button onClick={onToggle} style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        width: '100%', textAlign: 'left',
      }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>
          {faq.question}
        </span>
        <span style={{
          fontSize: '1.2rem', color: 'var(--text-muted)',
          transition: 'transform 200ms', transform: isOpen ? 'rotate(45deg)' : 'none',
        }}>+</span>
      </button>
      {isOpen && (
        <p style={{
          marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)',
          lineHeight: 1.6,
        }}>
          {faq.answer}
        </p>
      )}
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="section" id="faqs">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="section-label">FAQ's</span>
          <h2 className="section-title" style={{ margin: '16px auto 0' }}>
            Answers To What You're Wondering About.
          </h2>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {FAQS.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
