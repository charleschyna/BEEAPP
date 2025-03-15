-- Apiaries Table
CREATE TABLE IF NOT EXISTS apiaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hives Table
CREATE TABLE IF NOT EXISTS hives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  apiary_id UUID REFERENCES apiaries(id) ON DELETE CASCADE,
  temperature DECIMAL(5,2) NOT NULL DEFAULT 25.0,
  humidity DECIMAL(5,2) NOT NULL DEFAULT 40.0,
  weight DECIMAL(6,2) NOT NULL DEFAULT 10.0,
  sound DECIMAL(5,2),
  status TEXT CHECK (status IN ('healthy', 'warning', 'danger')) DEFAULT 'healthy',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inspection Logs Table
CREATE TABLE IF NOT EXISTS inspection_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hive_id UUID REFERENCES hives(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  queen_spotted BOOLEAN DEFAULT false,
  brood_patterns TEXT CHECK (brood_patterns IN ('excellent', 'good', 'fair', 'poor')) DEFAULT 'good',
  honey_stores TEXT CHECK (honey_stores IN ('abundant', 'good', 'fair', 'low')) DEFAULT 'good',
  pollen_stores TEXT CHECK (pollen_stores IN ('abundant', 'adequate', 'good', 'fair', 'low')) DEFAULT 'good',
  diseases_signs BOOLEAN DEFAULT false,
  diseases_notes TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inspection Actions Table (many-to-one relationship with inspection_logs)
CREATE TABLE IF NOT EXISTS inspection_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id UUID REFERENCES inspection_logs(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Historical Data Table for Time Series Analysis
CREATE TABLE IF NOT EXISTS historical_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hive_id UUID REFERENCES hives(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  temperature DECIMAL(5,2),
  humidity DECIMAL(5,2),
  weight DECIMAL(6,2),
  sound DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS Policies for Public Access
-- Note: In a production app, you would want to limit access based on user authentication
ALTER TABLE apiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE hives ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE historical_data ENABLE ROW LEVEL SECURITY;

-- Create policies for anon access (for demo purposes)
CREATE POLICY "Allow anon select for apiaries" ON apiaries FOR SELECT USING (true);
CREATE POLICY "Allow anon insert for apiaries" ON apiaries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update for apiaries" ON apiaries FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete for apiaries" ON apiaries FOR DELETE USING (true);

CREATE POLICY "Allow anon select for hives" ON hives FOR SELECT USING (true);
CREATE POLICY "Allow anon insert for hives" ON hives FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update for hives" ON hives FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete for hives" ON hives FOR DELETE USING (true);

CREATE POLICY "Allow anon select for inspection_logs" ON inspection_logs FOR SELECT USING (true);
CREATE POLICY "Allow anon insert for inspection_logs" ON inspection_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update for inspection_logs" ON inspection_logs FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete for inspection_logs" ON inspection_logs FOR DELETE USING (true);

CREATE POLICY "Allow anon select for inspection_actions" ON inspection_actions FOR SELECT USING (true);
CREATE POLICY "Allow anon insert for inspection_actions" ON inspection_actions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update for inspection_actions" ON inspection_actions FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete for inspection_actions" ON inspection_actions FOR DELETE USING (true);

CREATE POLICY "Allow anon select for historical_data" ON historical_data FOR SELECT USING (true);
CREATE POLICY "Allow anon insert for historical_data" ON historical_data FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update for historical_data" ON historical_data FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete for historical_data" ON historical_data FOR DELETE USING (true);

-- Setup Realtime Publish
BEGIN;
  -- Drop if exists
  DROP publication IF EXISTS supabase_realtime;
  
  -- Create publication for all tables
  CREATE PUBLICATION supabase_realtime FOR TABLE 
    apiaries, 
    hives, 
    inspection_logs, 
    inspection_actions, 
    historical_data;
COMMIT;
