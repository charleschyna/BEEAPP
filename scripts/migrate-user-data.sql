-- Get the first user's ID
DO $$
DECLARE
    first_user_id UUID;
BEGIN
    -- Get the first user's ID
    SELECT id INTO first_user_id FROM auth.users LIMIT 1;

    -- Update apiaries table
    UPDATE apiaries 
    SET user_id = first_user_id 
    WHERE user_id IS NULL;

    -- Update hives table
    UPDATE hives 
    SET user_id = first_user_id 
    WHERE user_id IS NULL;

    -- Update inspection_logs table
    UPDATE inspection_logs 
    SET user_id = first_user_id 
    WHERE user_id IS NULL;

    -- Update inspection_actions table
    UPDATE inspection_actions 
    SET user_id = first_user_id 
    WHERE user_id IS NULL;

    -- Update historical_data table
    UPDATE historical_data 
    SET user_id = first_user_id 
    WHERE user_id IS NULL;
END $$; 