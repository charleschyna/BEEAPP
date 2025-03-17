-- Delete data in the correct order to respect foreign key constraints
DELETE FROM historical_data;
DELETE FROM inspection_actions;
DELETE FROM inspection_logs;
DELETE FROM hives;
DELETE FROM apiaries; 