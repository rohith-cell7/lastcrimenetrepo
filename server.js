import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory data store with demo seed from crimilast
let cases = [
  {
    id: 'CASE #CR-2026-0142',
    title: 'Organized Network Infiltration (Port Sovereign)',
    case_type: 'Organized Syndicate',
    status: 'Active',
    priority: 'High',
    created_date: '2026-09-14 08:30 UTC',
    last_updated: '2026-09-18 11:42 UTC',
    investigator: 'Special Agent Marcus Vance',
    reference_no: 'DOJ-FED-8841-B',
    tags: ['Port Security', 'Crypto Laundering', 'Apex Syndicate', 'Avionics Smuggling'],
    description: 'Cross-border taskforce investigation into the synchronized heist of avionics hardware at Harbor Terminal C, darknet escrow channels, and perimeter surveillance disruption.',
    evidence_count: 5,
    entity_count: 8,
    investigation_status: 'Active Surveillance / Wiretap Active'
  },
  {
    id: 'CASE #CR-2026-0089',
    title: 'Phantom Rail Logistics & Cyber Diversion',
    case_type: 'Cyber Warfare',
    status: 'Critical',
    priority: 'Critical',
    created_date: '2026-09-10 14:15 UTC',
    last_updated: '2026-09-18 09:20 UTC',
    investigator: 'Special Agent Sarah Reyes',
    reference_no: 'DOT-FRAUD-9912-X',
    tags: ['SCADA Bypass', 'Freight Rail', 'GhostNet', 'Interception'],
    description: 'Technical probe into automated SCADA track switcher manipulation along Sector 2 industrial rail corridor.',
    evidence_count: 2,
    entity_count: 4,
    investigation_status: 'Forensic Extraction Ongoing'
  },
  {
    id: 'CASE #CR-2026-0044',
    title: 'Nightfall Escrow Laundering & Syndicate Mesh',
    case_type: 'Financial Fraud',
    status: 'Under Review',
    priority: 'Medium',
    created_date: '2026-09-02 11:00 UTC',
    last_updated: '2026-09-17 18:40 UTC',
    investigator: 'Special Agent David Torres',
    reference_no: 'FINCEN-SAR-3310-F',
    tags: ['FinCEN', 'Tether', 'Tumbler', 'Darknet'],
    description: 'Multi-jurisdictional financial tracking of offshore liquidity drained via flash-loan exploits into decentralized tumbler addresses.',
    evidence_count: 2,
    entity_count: 5,
    investigation_status: 'Asset Freeze Pending'
  }
];

let evidenceRecords = [
  {
    id: 'EV-0182',
    name: 'Call_Record_Microwave_Tap.csv',
    type: 'Call Records',
    case_id: 'CASE #CR-2026-0142',
    upload_date: '2026-09-18 03:22 UTC',
    file_size: '248 KB',
    source: 'Customs Microwave Tap (Sector 4)',
    status: 'Verified',
    entities: [
      { name: 'Viktor Voronin', type: 'Person', confidence: 0.98, role: 'Syndicate Lieutenant' },
      { name: 'Darius Vance', type: 'Person', confidence: 0.94, role: 'Logistics Facilitator' },
      { name: '868MHz Jammer Frequency', type: 'Technical', confidence: 0.96, role: 'Interference Tool' }
    ],
    notes: 'Intercept transcript points to terminal warehouse exchange scheduled at midnight.'
  },
  {
    id: 'EV-0183',
    name: 'FIR_Customs_Port_Report.pdf',
    type: 'Documents',
    case_id: 'CASE #CR-2026-0142',
    upload_date: '2026-09-18 04:45 UTC',
    file_size: '1.8 MB',
    source: 'Port Authority Incident Desk',
    status: 'Verified',
    entities: [
      { name: 'Terminal C Harbor Depot', type: 'Location', confidence: 0.99 },
      { name: 'Container TXUS-2291', type: 'Evidence', confidence: 0.95 }
    ],
    notes: 'Physical security seal breach confirmed on container TXUS-2291 containing navigation gear.'
  },
  {
    id: 'EV-0184',
    name: 'CCTV_Terminal_C_Frame_0418.jpg',
    type: 'Images',
    case_id: 'CASE #CR-2026-0142',
    upload_date: '2026-09-18 05:10 UTC',
    file_size: '3.4 MB',
    source: 'Port Authority CCTV Feed 04',
    status: 'Verified',
    entities: [
      { name: 'Viktor Voronin', type: 'Person', confidence: 0.964 },
      { name: 'Black SUV (VIN: 7829-K)', type: 'Vehicle', confidence: 0.91 }
    ],
    notes: 'Neural facial feature vector verified against international criminal registry.'
  }
];

let crimeGraph = {
  nodes: [
    { id: 'vance', label: 'Darius Vance', type: 'suspect', threat: 'HIGH', role: 'Logistics Courier' },
    { id: 'voronin', label: 'Viktor Voronin', type: 'suspect', threat: 'CRITICAL', role: 'Syndicate Head' },
    { id: 'elena', label: 'Elena Rostova', type: 'suspect', threat: 'MEDIUM', role: 'Financial Escrow' },
    { id: 'terminal_c', label: 'Terminal C Harbor Depot', type: 'location', threat: 'HIGH' },
    { id: 'container_txus', label: 'Container TXUS-2291', type: 'evidence', threat: 'CRITICAL' },
    { id: 'suv_black', label: 'Black SUV (VIN: 7829-K)', type: 'vehicle', threat: 'HIGH' },
    { id: 'jammer', label: '868MHz RF Jammer', type: 'telecom', threat: 'MEDIUM' }
  ],
  edges: [
    { source: 'voronin', target: 'vance', relationship: 'COMMANDS', weight: 0.95 },
    { source: 'voronin', target: 'terminal_c', relationship: 'SURVEILLED_AT', weight: 0.96 },
    { source: 'vance', target: 'container_txus', relationship: 'TAMPERED_WITH', weight: 0.92 },
    { source: 'vance', target: 'suv_black', relationship: 'DRIVES', weight: 0.89 },
    { source: 'voronin', target: 'elena', relationship: 'FUNDED_VIA', weight: 0.88 },
    { source: 'jammer', target: 'terminal_c', relationship: 'DEPLOYED_NEAR', weight: 0.94 }
  ]
};

let leads = [
  {
    id: 'LEAD-901',
    case_id: 'CASE #CR-2026-0142',
    title: 'Monitor Harbor Gate 4 Off-Hours Movement',
    priority: 'HIGH',
    rationale: 'Microwave tap intercept logs 868MHz frequency burst 12 minutes prior to security camera signal drop.',
    recommended_action: 'Dispatch field surveillance unit to Sector 4 and subpoena gate telematics.'
  },
  {
    id: 'LEAD-902',
    case_id: 'CASE #CR-2026-0089',
    title: 'Cross-Reference SCADA Terminal 2 Switch Logs',
    priority: 'CRITICAL',
    rationale: 'GhostNet script identified injecting unauthorized track junction overrides.',
    recommended_action: 'Perform offline firmware hash audit on railway control relays.'
  }
];

let inquiries = [];

// ==================== CIRA REASONING ENGINE ====================
function processCiraQuery(query) {
  const q = (query || '').toLowerCase().trim();

  // Suspect lookup
  if (q.includes('viktor') || q.includes('voronin')) {
    return {
      reply: "Viktor Voronin is currently flagged as CRITICAL priority in Case #CR-2026-0142. Biometric and telecommunications intercepts confirm his presence at Harbor Terminal C during the avionics seal breach. He is linked directly to Darius Vance and suspected of directing regional logistics.",
      intent: 'SUSPECT_INQUIRY',
      entities: ['Viktor Voronin', 'Darius Vance', 'Terminal C Harbor Depot'],
      leads: ['Subpoena cell tower records covering Harbor Gate 4']
    };
  }

  if (q.includes('vance') || q.includes('darius')) {
    return {
      reply: "Darius Vance is identified as an active field operative for the Apex Syndicate. Registered driver of Black SUV (VIN: 7829-K) spotted leaving Harbor Terminal C at 04:22 UTC. Microwave tap indicates incoming tactical orders from Voronin.",
      intent: 'SUSPECT_INQUIRY',
      entities: ['Darius Vance', 'Black SUV (VIN: 7829-K)'],
      leads: ['Issue BOLO on vehicle VIN: 7829-K']
    };
  }

  if (q.includes('case') || q.includes('investigation') || q.includes('open') || q.includes('status')) {
    const caseSummary = cases.map(c => `• ${c.id}: ${c.title} [Status: ${c.status} | Priority: ${c.priority}]`).join('\n');
    return {
      reply: `There are currently ${cases.length} active docket files under taskforce review:\n\n${caseSummary}\n\nAll evidence chains and relationship graphs are synchronized.`,
      intent: 'CASES_LIST',
      entities: cases.map(c => c.id),
      leads: []
    };
  }

  if (q.includes('port') || q.includes('terminal') || q.includes('harbor') || q.includes('container')) {
    return {
      reply: "Incident analysis for Harbor Terminal C: Seal breach detected on Container TXUS-2291 containing high-precision avionics hardware. Optical analysis confirmed security cameras were disrupted using an 868MHz RF jammer. Viktor Voronin and Darius Vance are primary persons of interest.",
      intent: 'INCIDENT_ANALYSIS',
      entities: ['Terminal C Harbor Depot', 'Container TXUS-2291', '868MHz RF Jammer'],
      leads: ['Review Customs Microwave Tap Sector 4 logs', 'Inspect Container TXUS-2291 physical seals']
    };
  }

  if (q.includes('network') || q.includes('syndicate') || q.includes('graph') || q.includes('nexus')) {
    return {
      reply: `Syndicate Graph active: ${crimeGraph.nodes.length} verified nodes and ${crimeGraph.edges.length} cross-case edges. Core nexus isolates Viktor Voronin commanding field distribution while offshore liquidity routes through Nightfall escrow channels.`,
      intent: 'GRAPH_OVERVIEW',
      entities: crimeGraph.nodes.map(n => n.label),
      leads: ['Trigger live Syndicate Nexus modal to inspect edge weights']
    };
  }

  if (q.includes('evidence') || q.includes('call') || q.includes('cctv') || q.includes('tap')) {
    const evSummary = evidenceRecords.map(e => `• [${e.type}] ${e.name} (Source: ${e.source})`).join('\n');
    return {
      reply: `Chain of custody currently tracks ${evidenceRecords.length} validated forensic items:\n\n${evSummary}`,
      intent: 'EVIDENCE_INQUIRY',
      entities: evidenceRecords.map(e => e.name),
      leads: []
    };
  }

  // Default investigative assistant reply
  return {
    reply: `CrimeNet CIRA Cognitive Matrix online. Ingested query processed: "${query}". You can query suspect profiles (e.g. Viktor Voronin, Darius Vance), check active case dockets, request incident forensics for Port Sovereign, or examine the syndicate network graph.`,
    intent: 'GENERAL_ASSISTANCE',
    entities: [],
    leads: []
  };
}

// ==================== REST API ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'active', system: 'CrimeNet AI Backend', timestamp: new Date().toISOString() });
});

// Cases CRUD
app.get('/api/cases', (req, res) => {
  const { status, priority, search } = req.query;
  let results = [...cases];

  if (status) {
    results = results.filter(c => c.status.toLowerCase() === status.toLowerCase());
  }
  if (priority) {
    results = results.filter(c => c.priority.toLowerCase() === priority.toLowerCase());
  }
  if (search) {
    const s = search.toLowerCase();
    results = results.filter(c => c.title.toLowerCase().includes(s) || c.description.toLowerCase().includes(s) || c.id.toLowerCase().includes(s));
  }

  res.json({ count: results.length, cases: results });
});

app.post('/api/cases', (req, res) => {
  const newCase = {
    id: req.body.id || `CASE #CR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    title: req.body.title || 'Untitled Investigation',
    case_type: req.body.case_type || 'General Incident',
    status: req.body.status || 'Active',
    priority: req.body.priority || 'Medium',
    created_date: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
    last_updated: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
    investigator: req.body.investigator || 'Special Agent',
    reference_no: req.body.reference_no || `REF-${Math.floor(1000 + Math.random() * 9000)}`,
    tags: Array.isArray(req.body.tags) ? req.body.tags : ['New Case'],
    description: req.body.description || '',
    evidence_count: 0,
    entity_count: 0,
    investigation_status: 'Active Docket'
  };

  cases.unshift(newCase);
  res.status(201).json({ success: true, case: newCase });
});

app.get('/api/cases/:id', (req, res) => {
  const cleanId = req.params.id.replace('CASE #', '').trim();
  const c = cases.find(item => item.id === req.params.id || item.id.replace('CASE #', '').trim() === cleanId);
  if (!c) {
    return res.status(404).json({ error: 'Case not found' });
  }

  const relatedEvidence = evidenceRecords.filter(e => e.case_id === c.id);
  res.json({
    ...c,
    evidence: relatedEvidence,
    timeline: [
      { date: c.created_date, event: `Case docket opened: ${c.title}`, author: c.investigator },
      { date: c.last_updated, event: 'Automated intelligence cross-reference completed', author: 'CIRA Engine' }
    ]
  });
});

app.put('/api/cases/:id', (req, res) => {
  const cleanId = req.params.id.replace('CASE #', '').trim();
  const idx = cases.findIndex(item => item.id === req.params.id || item.id.replace('CASE #', '').trim() === cleanId);
  if (idx === -1) {
    return res.status(404).json({ error: 'Case not found' });
  }

  cases[idx] = {
    ...cases[idx],
    ...req.body,
    last_updated: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC'
  };

  res.json({ success: true, case: cases[idx] });
});

app.delete('/api/cases/:id', (req, res) => {
  const cleanId = req.params.id.replace('CASE #', '').trim();
  const initialLen = cases.length;
  cases = cases.filter(item => item.id !== req.params.id && item.id.replace('CASE #', '').trim() !== cleanId);
  if (cases.length === initialLen) {
    return res.status(404).json({ error: 'Case not found' });
  }
  res.json({ success: true, message: 'Case deleted' });
});

// Evidence API
app.get('/api/evidence', (req, res) => {
  const { case_id, type } = req.query;
  let results = [...evidenceRecords];
  if (case_id) {
    results = results.filter(e => e.case_id === case_id);
  }
  if (type) {
    results = results.filter(e => e.type.toLowerCase() === type.toLowerCase());
  }
  res.json({ count: results.length, evidence: results });
});

app.post('/api/evidence', (req, res) => {
  const newEv = {
    id: `EV-${Math.floor(1000 + Math.random() * 9000)}`,
    name: req.body.name || 'Forensic_Record.dat',
    type: req.body.type || 'Documents',
    case_id: req.body.case_id || cases[0].id,
    upload_date: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
    file_size: req.body.file_size || '512 KB',
    source: req.body.source || 'Taskforce Ingestion Portal',
    status: 'Verified',
    entities: req.body.entities || [
      { name: 'Extracted Entity', type: 'Subject', confidence: 0.92 }
    ],
    notes: req.body.notes || 'Evidence indexed and tokenized into case matrix.'
  };

  evidenceRecords.unshift(newEv);
  res.status(201).json({ success: true, evidence: newEv });
});

// CIRA Chatbot API
app.post('/api/chat', (req, res) => {
  const query = req.body.message || req.body.query || req.body.type_something || '';
  if (!query) {
    return res.status(400).json({ error: 'Message cannot be empty' });
  }

  const result = processCiraQuery(query);
  res.json({
    success: true,
    query: query,
    response: result.reply,
    intent: result.intent,
    entities: result.entities,
    leads: result.leads,
    timestamp: new Date().toISOString()
  });
});

// Crime Network Graph
app.get('/api/graph', (req, res) => {
  res.json({
    success: true,
    nodes: crimeGraph.nodes,
    edges: crimeGraph.edges,
    total_nodes: crimeGraph.nodes.length,
    total_edges: crimeGraph.edges.length
  });
});

// Leads API
app.get('/api/leads', (req, res) => {
  res.json({ count: leads.length, leads: leads });
});

// Form submission handler (matching the Framer form action URL path)
app.post('/api/submit/form_nfqriZajR_bKymqI', (req, res) => {
  const text = req.body.type_something || req.body.message || '';
  if (text) {
    const ciraReply = processCiraQuery(text);
    return res.json({
      status: 'success',
      reply: ciraReply.reply,
      intent: ciraReply.intent
    });
  }
  res.json({ status: 'success', message: 'Inquiry received' });
});

app.post('/api/contact', (req, res) => {
  inquiries.push({
    ...req.body,
    timestamp: new Date().toISOString()
  });
  res.json({ success: true, message: 'Consultation request filed with Taskforce Dispatch.' });
});

// Serve static frontend
app.use(express.static(__dirname));

// Single-page fallback for Express v5
app.get('*all', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`CrimeNet AI Full-Stack Server active on http://0.0.0.0:${PORT}`);
});
