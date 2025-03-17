-- Enable RLS on apiaries table
ALTER TABLE apiaries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can only view their own apiaries" ON apiaries;
DROP POLICY IF EXISTS "Users can only insert their own apiaries" ON apiaries;
DROP POLICY IF EXISTS "Users can only update their own apiaries" ON apiaries;
DROP POLICY IF EXISTS "Users can only delete their own apiaries" ON apiaries;

-- Create RLS policies using profile_id
CREATE POLICY "Users can only view their own apiaries"
    ON apiaries FOR SELECT
    USING (auth.uid() = profile_id);
    
CREATE POLICY "Users can only insert their own apiaries"
    ON apiaries FOR INSERT
    WITH CHECK (auth.uid() = profile_id);
    
CREATE POLICY "Users can only update their own apiaries"
    ON apiaries FOR UPDATE
    USING (auth.uid() = profile_id);
    
CREATE POLICY "Users can only delete their own apiaries"
    ON apiaries FOR DELETE
    USING (auth.uid() = profile_id);

-- Update existing records to set profile_id from the first user if it's NULL
UPDATE apiaries 
SET profile_id = (SELECT id FROM auth.users LIMIT 1)
WHERE profile_id IS NULL; 