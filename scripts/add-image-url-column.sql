-- Add image_url column to apiaries table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'apiaries' 
        AND column_name = 'image_url'
    ) THEN
        ALTER TABLE apiaries 
        ADD COLUMN image_url TEXT;
    END IF;
END $$; 