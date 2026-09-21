import React, { useState } from 'react';
import { api } from '../services/api.js';

export default function EvidencePanel({ evidence: initialEvidence, caseId }) {
  const [evidence, setEvidence] = useState(initialEvidence || []);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadName, setUploadName] = useState('');
  const [uploadType, setUploadType] = useState('Documents');
  const [uploadSource, setUploadSource] = useState('');
  const [uploadNotes, setUploadNotes] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadName.trim()) return;

    setUploading(true);
    try {
      const newEv = await api.uploadEvidence(caseId, {
        name: uploadName,
        type: uploadType,
        category: uploadType,
        source: uploadSource || 'Investigator Direct Upload',
        notes: uploadNotes,
      });
      if (newEv) {
        setEvidence(prev => [newEv, ...prev]);
      }
      setUploadOpen(false);
      setUploadName('');
      setUploadSource('');
      setUploadNotes('');
    } catch (err) {
      console.warn('Upload failed', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {evidence.length} evidence item{evidence.length !== 1 ? 's' : ''} in chain of custody
        </p>
        <button className="btn btn-secondary" onClick={() => setUploadOpen(!uploadOpen)}>
          {uploadOpen ? 'Cancel' : '+ Upload Evidence'}
        </button>
      </div>

      {/* Upload form */}
      {uploadOpen && (
        <form onSubmit={handleUpload} style={{
          background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)',
          padding: '20px', border: '1px solid var(--border)', marginBottom: '16px',
          display: 'flex', flexDirection: 'column', gap: '12px',
        }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="File name (e.g. Wiretap_Log.csv)"
              value={uploadName}
              onChange={e => setUploadName(e.target.value)}
              required
              style={{
                flex: 1, minWidth: '200px', padding: '10px 14px',
                background: 'var(--bg)', border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-md)', color: 'var(--text)', fontSize: '0.82rem', outline: 'none',
              }}
            />
            <select
              value={uploadType}
              onChange={e => setUploadType(e.target.value)}
              style={{
                padding: '10px 14px', background: 'var(--bg)',
                border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)',
                color: 'var(--text)', fontSize: '0.82rem', outline: 'none',
              }}
            >
              <option>Documents</option>
              <option>Call Records</option>
              <option>Images</option>
              <option>Financial Records</option>
              <option>Technical</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Source (e.g. Customs Intercept)"
            value={uploadSource}
            onChange={e => setUploadSource(e.target.value)}
            style={{
              padding: '10px 14px', background: 'var(--bg)',
              border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)',
              color: 'var(--text)', fontSize: '0.82rem', outline: 'none',
            }}
          />
          <textarea
            rows={2}
            placeholder="Notes about this evidence..."
            value={uploadNotes}
            onChange={e => setUploadNotes(e.target.value)}
            style={{
              padding: '10px 14px', background: 'var(--bg)',
              border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)',
              color: 'var(--text)', fontSize: '0.82rem', outline: 'none', resize: 'vertical',
            }}
          />
          <button type="submit" disabled={uploading} className="btn btn-primary">
            {uploading ? 'Uploading...' : 'Submit Evidence'}
          </button>
        </form>
      )}

      {/* Evidence list */}
      {evidence.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>
          No evidence items yet. Upload to begin chain of custody.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {evidence.map(ev => (
            <div key={ev.id} style={{
              background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)',
              padding: '16px 20px', border: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span className="badge badge-neutral">{ev.type || ev.category}</span>
                    <span className="badge badge-success">{ev.status || ev.processing_state || 'Verified'}</span>
                  </div>
                  <p style={{ fontSize: '0.88rem', fontWeight: 600 }}>{ev.name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Source: {ev.source} · {ev.file_size || 'Unknown size'} · {ev.upload_date}
                  </p>
                  {ev.notes && (
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.5 }}>
                      {ev.notes}
                    </p>
                  )}
                  {ev.entities && ev.entities.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                      {ev.entities.map((ent, i) => (
                        <span key={i} style={{
                          fontSize: '0.7rem', padding: '3px 8px', borderRadius: 'var(--radius-sm)',
                          background: 'var(--bg-elevated)', color: 'var(--text-secondary)',
                        }}>
                          {ent.name} ({ent.type})
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
