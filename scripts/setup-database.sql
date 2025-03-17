-- Apiaries Table
CREATE TABLE IF NOT EXISTS apiaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT,
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hives Table
CREATE TABLE IF NOT EXISTS hives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  inspection_id UUID REFERENCES inspection_logs(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Historical Data Table for Time Series Analysis
CREATE TABLE IF NOT EXISTS historical_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  hive_id UUID REFERENCES hives(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  temperature DECIMAL(5,2),
  humidity DECIMAL(5,2),
  weight DECIMAL(6,2),
  sound DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_apiaries_user_id ON apiaries(user_id);
CREATE INDEX IF NOT EXISTS idx_hives_user_id ON hives(user_id);
CREATE INDEX IF NOT EXISTS idx_inspection_logs_user_id ON inspection_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_inspection_actions_user_id ON inspection_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_historical_data_user_id ON historical_data(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE apiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE hives ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE historical_data ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can only view their own apiaries"
  ON apiaries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own apiaries"
  ON apiaries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own apiaries"
  ON apiaries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own apiaries"
  ON apiaries FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only view their own hives"
  ON hives FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own hives"
  ON hives FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own hives"
  ON hives FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own hives"
  ON hives FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only view their own inspection logs"
  ON inspection_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own inspection logs"
  ON inspection_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own inspection logs"
  ON inspection_logs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own inspection logs"
  ON inspection_logs FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only view their own inspection actions"
  ON inspection_actions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own inspection actions"
  ON inspection_actions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own inspection actions"
  ON inspection_actions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own inspection actions"
  ON inspection_actions FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only view their own historical data"
  ON historical_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own historical data"
  ON historical_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own historical data"
  ON historical_data FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own historical data"
  ON historical_data FOR DELETE
  USING (auth.uid() = user_id);

-- Set up real-time subscriptions
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
