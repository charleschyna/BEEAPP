import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const SUPABASE_URL = 'https://akwdkurznlswhplkqtps.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd2RrdXJ6bmxzd2hwbGtxdHBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1MTA4MDIsImV4cCI6MjA1NjA4NjgwMn0.iR7boBH24cONY_A8Zk2iqDxZFaxWrOpX1eFnIYWw1G8';

// Create a single supabase client for interacting with your database
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
