-- Add user_id column to hives table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'hives' 
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE hives 
        ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        
        -- Create index for better query performance
        CREATE INDEX IF NOT EXISTS idx_hives_user_id ON hives(user_id);
        
        -- Enable RLS if not already enabled
        ALTER TABLE hives ENABLE ROW LEVEL SECURITY;
        
        -- Create RLS policies if they don't exist
        DROP POLICY IF EXISTS "Users can only view their own hives" ON hives;
        DROP POLICY IF EXISTS "Users can only insert their own hives" ON hives;
        DROP POLICY IF EXISTS "Users can only update their own hives" ON hives;
        DROP POLICY IF EXISTS "Users can only delete their own hives" ON hives;
        
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
            
        -- Update existing records to set user_id from the first user
        UPDATE hives 
        SET user_id = (SELECT id FROM auth.users LIMIT 1)
        WHERE user_id IS NULL;
    END IF;
END $$;

-- Add user_id column to inspection_logs table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'inspection_logs' 
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE inspection_logs 
        ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        
        -- Create index for better query performance
        CREATE INDEX IF NOT EXISTS idx_inspection_logs_user_id ON inspection_logs(user_id);
        
        -- Enable RLS if not already enabled
        ALTER TABLE inspection_logs ENABLE ROW LEVEL SECURITY;
        
        -- Create RLS policies if they don't exist
        DROP POLICY IF EXISTS "Users can only view their own inspection logs" ON inspection_logs;
        DROP POLICY IF EXISTS "Users can only insert their own inspection logs" ON inspection_logs;
        DROP POLICY IF EXISTS "Users can only update their own inspection logs" ON inspection_logs;
        DROP POLICY IF EXISTS "Users can only delete their own inspection logs" ON inspection_logs;
        
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
            
        -- Update existing records to set user_id from the first user
        UPDATE inspection_logs 
        SET user_id = (SELECT id FROM auth.users LIMIT 1)
        WHERE user_id IS NULL;
    END IF;
END $$;

-- Add user_id column to historical_data table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'historical_data' 
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE historical_data 
        ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        
        -- Create index for better query performance
        CREATE INDEX IF NOT EXISTS idx_historical_data_user_id ON historical_data(user_id);
        
        -- Enable RLS if not already enabled
        ALTER TABLE historical_data ENABLE ROW LEVEL SECURITY;
        
        -- Create RLS policies if they don't exist
        DROP POLICY IF EXISTS "Users can only view their own historical data" ON historical_data;
        DROP POLICY IF EXISTS "Users can only insert their own historical data" ON historical_data;
        DROP POLICY IF EXISTS "Users can only update their own historical data" ON historical_data;
        DROP POLICY IF EXISTS "Users can only delete their own historical data" ON historical_data;
        
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
            
        -- Update existing records to set user_id from the first user
        UPDATE historical_data 
        SET user_id = (SELECT id FROM auth.users LIMIT 1)
        WHERE user_id IS NULL;
    END IF;
END $$;

-- Add user_id column to apiaries table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'apiaries' 
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE apiaries 
        ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        
        -- Create index for better query performance
        CREATE INDEX IF NOT EXISTS idx_apiaries_user_id ON apiaries(user_id);
        
        -- Enable RLS
        ALTER TABLE apiaries ENABLE ROW LEVEL SECURITY;
        
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
    END IF;
END $$; 