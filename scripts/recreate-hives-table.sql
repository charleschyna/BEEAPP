-- Drop the existing table
DROP TABLE IF EXISTS hives CASCADE;

-- Recreate the hives table
CREATE TABLE hives (
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

-- Create indexes
CREATE INDEX idx_hives_user_id ON hives(user_id);
CREATE INDEX idx_hives_apiary_id ON hives(apiary_id);

-- Grant permissions to authenticated users
GRANT ALL ON hives TO authenticated;

-- Enable RLS
ALTER TABLE hives ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own hives"
    ON hives FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own hives"
    ON hives FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own hives"
    ON hives FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own hives"
    ON hives FOR DELETE
    USING (auth.uid() = user_id);

-- Force schema cache reload
NOTIFY pgrst, 'reload schema';

-- Verify the table structure
SELECT 
    column_name, 
    data_type, 
    column_default, 
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_name = 'hives'
ORDER BY 
    ordinal_position; 