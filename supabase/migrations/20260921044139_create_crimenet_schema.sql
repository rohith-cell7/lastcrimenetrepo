/*
# CrimeNet AI — Core Database Schema

## Overview
Creates the full data model for the CrimeNet AI crime intelligence platform: cases, evidence,
graph nodes (entities), graph edges (relationships), investigative leads, and contact inquiries.
All tables are owner-scoped to the authenticated investigator who created them.

## New Tables

### 1. cases
Stores investigation dockets. Each case belongs to the investigator who created it.
- id (uuid, PK)
- title (text, not null)
- case_type (text)
- status (text, default 'Active')
- priority (text, default 'Medium')
- investigator (text)
- reference_no (text)
- description (text)
- tags (text[])
- evidence_count (int, default 0)
- entity_count (int, default 0)
- investigation_status (text)
- user_id (uuid, FK auth.users, defaults to auth.uid())
- created_at (timestamptz)
- updated_at (timestamptz)

### 2. evidence
Forensic evidence items linked to a case. Inherits ownership through the parent case.
- id (uuid, PK)
- case_id (uuid, FK cases)
- name (text, not null)
- type (text)
- category (text)
- file_size (text)
- source (text)
- status (text, default 'Verified')
- processing_state (text, default 'ANALYZED')
- extracted_entities_count (int, default 0)
- detected_relationships_count (int, default 0)
- entities (jsonb) — array of extracted entity objects
- relationships (jsonb) — array of relationship objects
- notes (text)
- used_by_graph (boolean, default true)
- user_id (uuid, FK auth.users)
- created_at (timestamptz)

### 3. graph_nodes
Entities in the syndicate network graph, linked to a case.
- id (uuid, PK)
- case_id (uuid, FK cases)
- node_id (text, not null) — external label like 'PERSON-001'
- label (text, not null)
- type (text) — Person, Phone, Vehicle, FinancialAccount, Location, Organization, Evidence
- threat (text)
- role (text)
- details (text)
- user_id (uuid, FK auth.users)
- created_at (timestamptz)

### 4. graph_edges
Relationships between graph nodes, linked to a case.
- id (uuid, PK)
- case_id (uuid, FK cases)
- source_node_id (text, not null)
- target_node_id (text, not null)
- relation (text, not null)
- relation_type (text)
- confidence (numeric, default 0.9)
- supporting_evidence_id (text)
- supporting_evidence_name (text)
- explainability (text)
- user_id (uuid, FK auth.users)
- created_at (timestamptz)

### 5. leads
Investigative leads generated from evidence analysis.
- id (uuid, PK)
- case_id (uuid, FK cases)
- title (text, not null)
- priority (text)
- rationale (text)
- recommended_action (text)
- user_id (uuid, FK auth.users)
- created_at (timestamptz)

### 6. inquiries
Contact/briefing requests submitted from the landing page. No ownership scoping (public submit).
- id (uuid, PK)
- name (text)
- email (text)
- details (text)
- created_at (timestamptz)

## Security
- RLS enabled on all tables.
- cases, evidence, graph_nodes, graph_edges, leads: owner-scoped to authenticated users via user_id.
- evidence, graph_nodes, graph_edges, leads: ownership verified through parent case's user_id.
- inquiries: public insert (anon + authenticated), authenticated read only.
- All owner columns default to auth.uid().
*/

-- ==================== CASES ====================
CREATE TABLE IF NOT EXISTS cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  case_type text DEFAULT 'General Incident',
  status text DEFAULT 'Active',
  priority text DEFAULT 'Medium',
  investigator text,
  reference_no text,
  description text DEFAULT '',
  tags text[] DEFAULT '{}',
  evidence_count int DEFAULT 0,
  entity_count int DEFAULT 0,
  investigation_status text DEFAULT 'Active Docket',
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_cases" ON cases;
CREATE POLICY "select_own_cases" ON cases FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_cases" ON cases;
CREATE POLICY "insert_own_cases" ON cases FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_cases" ON cases;
CREATE POLICY "update_own_cases" ON cases FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_cases" ON cases;
CREATE POLICY "delete_own_cases" ON cases FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ==================== EVIDENCE ====================
CREATE TABLE IF NOT EXISTS evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text DEFAULT 'Documents',
  category text DEFAULT 'Documents',
  file_size text,
  source text,
  status text DEFAULT 'Verified',
  processing_state text DEFAULT 'ANALYZED',
  extracted_entities_count int DEFAULT 0,
  detected_relationships_count int DEFAULT 0,
  entities jsonb DEFAULT '[]'::jsonb,
  relationships jsonb DEFAULT '[]'::jsonb,
  notes text DEFAULT '',
  used_by_graph boolean DEFAULT true,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_evidence" ON evidence;
CREATE POLICY "select_own_evidence" ON evidence FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM cases WHERE cases.id = evidence.case_id AND cases.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "insert_own_evidence" ON evidence;
CREATE POLICY "insert_own_evidence" ON evidence FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM cases WHERE cases.id = evidence.case_id AND cases.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "update_own_evidence" ON evidence;
CREATE POLICY "update_own_evidence" ON evidence FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM cases WHERE cases.id = evidence.case_id AND cases.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM cases WHERE cases.id = evidence.case_id AND cases.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "delete_own_evidence" ON evidence;
CREATE POLICY "delete_own_evidence" ON evidence FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM cases WHERE cases.id = evidence.case_id AND cases.user_id = auth.uid())
  );

-- ==================== GRAPH NODES ====================
CREATE TABLE IF NOT EXISTS graph_nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  node_id text NOT NULL,
  label text NOT NULL,
  type text DEFAULT 'Entity',
  threat text,
  role text,
  details text,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE graph_nodes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_graph_nodes" ON graph_nodes;
CREATE POLICY "select_own_graph_nodes" ON graph_nodes FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM cases WHERE cases.id = graph_nodes.case_id AND cases.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "insert_own_graph_nodes" ON graph_nodes;
CREATE POLICY "insert_own_graph_nodes" ON graph_nodes FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM cases WHERE cases.id = graph_nodes.case_id AND cases.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "update_own_graph_nodes" ON graph_nodes;
CREATE POLICY "update_own_graph_nodes" ON graph_nodes FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM cases WHERE cases.id = graph_nodes.case_id AND cases.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM cases WHERE cases.id = graph_nodes.case_id AND cases.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "delete_own_graph_nodes" ON graph_nodes;
CREATE POLICY "delete_own_graph_nodes" ON graph_nodes FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM cases WHERE cases.id = graph_nodes.case_id AND cases.user_id = auth.uid())
  );

-- ==================== GRAPH EDGES ====================
CREATE TABLE IF NOT EXISTS graph_edges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  source_node_id text NOT NULL,
  target_node_id text NOT NULL,
  relation text NOT NULL,
  relation_type text,
  confidence numeric DEFAULT 0.9,
  supporting_evidence_id text,
  supporting_evidence_name text,
  explainability text,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE graph_edges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_graph_edges" ON graph_edges;
CREATE POLICY "select_own_graph_edges" ON graph_edges FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM cases WHERE cases.id = graph_edges.case_id AND cases.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "insert_own_graph_edges" ON graph_edges;
CREATE POLICY "insert_own_graph_edges" ON graph_edges FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM cases WHERE cases.id = graph_edges.case_id AND cases.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "update_own_graph_edges" ON graph_edges;
CREATE POLICY "update_own_graph_edges" ON graph_edges FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM cases WHERE cases.id = graph_edges.case_id AND cases.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM cases WHERE cases.id = graph_edges.case_id AND cases.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "delete_own_graph_edges" ON graph_edges;
CREATE POLICY "delete_own_graph_edges" ON graph_edges FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM cases WHERE cases.id = graph_edges.case_id AND cases.user_id = auth.uid())
  );

-- ==================== LEADS ====================
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  title text NOT NULL,
  priority text DEFAULT 'Medium',
  rationale text,
  recommended_action text,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_leads" ON leads;
CREATE POLICY "select_own_leads" ON leads FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM cases WHERE cases.id = leads.case_id AND cases.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "insert_own_leads" ON leads;
CREATE POLICY "insert_own_leads" ON leads FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM cases WHERE cases.id = leads.case_id AND cases.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "update_own_leads" ON leads;
CREATE POLICY "update_own_leads" ON leads FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM cases WHERE cases.id = leads.case_id AND cases.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM cases WHERE cases.id = leads.case_id AND cases.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "delete_own_leads" ON leads;
CREATE POLICY "delete_own_leads" ON leads FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM cases WHERE cases.id = leads.case_id AND cases.user_id = auth.uid())
  );

-- ==================== INQUIRIES (public) ====================
CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text,
  details text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_inquiries" ON inquiries;
CREATE POLICY "anon_insert_inquiries" ON inquiries FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_read_inquiries" ON inquiries;
CREATE POLICY "authenticated_read_inquiries" ON inquiries FOR SELECT
  TO authenticated USING (true);

-- ==================== INDEXES ====================
CREATE INDEX IF NOT EXISTS idx_cases_user_id ON cases(user_id);
CREATE INDEX IF NOT EXISTS idx_evidence_case_id ON evidence(case_id);
CREATE INDEX IF NOT EXISTS idx_graph_nodes_case_id ON graph_nodes(case_id);
CREATE INDEX IF NOT EXISTS idx_graph_edges_case_id ON graph_edges(case_id);
CREATE INDEX IF NOT EXISTS idx_leads_case_id ON leads(case_id);
