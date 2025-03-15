// This script can be run to populate the Supabase database with sample data
// Run with: node scripts/seed-database.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client 
// Replace these with your actual Supabase URL and anon key or use environment variables
const supabaseUrl = process.env.SUPABASE_URL || 'https://xmqsgdjwnavrylrnsuhr.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtcXNnZGp3bmF2cnlscm5zdWhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcxODk2MjIsImV4cCI6MjAzMjc2NTYyMn0.fV1hzXTvX-5eEkYauWmdjDvvQswH9NzzHGyYP5GJGDE';

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample data
const apiaries = [
  {
    name: 'Sunny Meadow Apiary',
    location: '123 Sunny Meadow Lane, Springfield',
    notes: 'Main apiary located in a sunny meadow with abundant wildflowers.'
  },
  {
    name: 'Forest Edge Apiary',
    location: '456 Forest Road, Woodland Hills',
    notes: 'Located at the edge of a forest with diverse plant species.'
  },
  {
    name: 'Mountain Valley Apiary',
    location: '789 Mountain Pass, Highland',
    notes: 'High-altitude apiary with access to unique alpine flora.'
  }
];

const getRandomStatus = () => {
  const statuses = ['healthy', 'warning', 'danger'];
  const weights = [0.7, 0.2, 0.1]; // 70% healthy, 20% warning, 10% danger
  
  const rand = Math.random();
  let sum = 0;
  
  for (let i = 0; i < statuses.length; i++) {
    sum += weights[i];
    if (rand < sum) return statuses[i];
  }
  
  return 'healthy';
};

// Function to get a random number within a range
const getRandomNumber = (min, max, decimals = 0) => {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(decimals));
};

// Function to generate hive data
const generateHiveData = (apiaryId) => {
  const hiveCount = getRandomNumber(2, 5);
  const hives = [];
  
  for (let i = 0; i < hiveCount; i++) {
    const status = getRandomStatus();
    
    // Adjust values based on status for more realistic data
    let tempRange, humidityRange, weightRange;
    
    switch (status) {
      case 'healthy':
        tempRange = { min: 32, max: 36 };
        humidityRange = { min: 45, max: 60 };
        weightRange = { min: 40, max: 80 };
        break;
      case 'warning':
        tempRange = { min: 30, max: 38 };
        humidityRange = { min: 35, max: 70 };
        weightRange = { min: 30, max: 90 };
        break;
      case 'danger':
        tempRange = { min: 25, max: 40 };
        humidityRange = { min: 25, max: 80 };
        weightRange = { min: 20, max: 100 };
        break;
    }
    
    hives.push({
      name: `Hive ${String.fromCharCode(65 + i)}`, // Hive A, Hive B, etc.
      apiary_id: apiaryId,
      temperature: getRandomNumber(tempRange.min, tempRange.max, 1),
      humidity: getRandomNumber(humidityRange.min, humidityRange.max, 1),
      weight: getRandomNumber(weightRange.min, weightRange.max, 1),
      sound: getRandomNumber(30, 50, 1),
      status: status,
      last_updated: new Date().toISOString()
    });
  }
  
  return hives;
};

// Function to generate historical data for a hive
const generateHistoricalData = (hiveId) => {
  const data = [];
  const now = new Date();
  
  // Generate data for the past 30 days
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    data.push({
      hive_id: hiveId,
      date: date.toISOString(),
      temperature: getRandomNumber(30, 38, 1),
      humidity: getRandomNumber(40, 65, 1),
      weight: getRandomNumber(35, 85, 1),
      sound: getRandomNumber(30, 50, 1)
    });
  }
  
  return data;
};

// Function to generate inspection logs for a hive
const generateInspectionLogs = (hiveId) => {
  const logs = [];
  const now = new Date();
  
  // Generate 3-5 inspection logs per hive
  const inspectionCount = getRandomNumber(3, 5);
  
  for (let i = 0; i < inspectionCount; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - (i * 7 + getRandomNumber(0, 3))); // Every ~7 days with some variation
    
    const queenSpotted = Math.random() > 0.2; // 80% chance queen was spotted
    const diseasesSigns = Math.random() < 0.15; // 15% chance of disease signs
    
    // Possible brood patterns
    const broodPatterns = ['excellent', 'good', 'fair', 'poor'];
    const broodPattern = broodPatterns[getRandomNumber(0, broodPatterns.length - 1)];
    
    // Possible honey stores
    const honeyStores = ['abundant', 'good', 'fair', 'low'];
    const honeyStore = honeyStores[getRandomNumber(0, honeyStores.length - 1)];
    
    // Possible pollen stores
    const pollenStores = ['abundant', 'adequate', 'good', 'fair', 'low'];
    const pollenStore = pollenStores[getRandomNumber(0, pollenStores.length - 1)];
    
    logs.push({
      hive_id: hiveId,
      date: date.toISOString(),
      queen_spotted: queenSpotted,
      brood_patterns: broodPattern,
      honey_stores: honeyStore,
      pollen_stores: pollenStore,
      diseases_signs: diseasesSigns,
      diseases_notes: diseasesSigns ? 'Some signs of varroa mites observed.' : null,
      notes: `Regular inspection #${i + 1}.`
    });
  }
  
  return logs;
};

// Function to generate inspection actions for a log
const generateInspectionActions = (logId) => {
  const possibleActions = [
    'Added honey super',
    'Removed honey super',
    'Treated for varroa mites',
    'Added pollen patty',
    'Added sugar syrup',
    'Replaced queen',
    'Marked queen',
    'Added a frame',
    'Removed a frame',
    'Split the hive',
    'Combined hives',
    'Cleaned bottom board',
    'Harvested honey',
    'Inspected brood pattern',
    'Checked for queen cells',
    'Added medication',
    'Requeened',
    'Moved hive location',
    'Repaired hive box',
    'Added entrance reducer'
  ];
  
  const actions = [];
  const actionCount = getRandomNumber(0, 3); // 0-3 actions per inspection
  
  // Add some random actions
  for (let i = 0; i < actionCount; i++) {
    const randomIndex = getRandomNumber(0, possibleActions.length - 1);
    actions.push({
      inspection_id: logId,
      action: possibleActions[randomIndex]
    });
  }
  
  return actions;
};

// Main function to seed the database
async function seedDatabase() {
  console.log('Starting database seeding...');
  
  try {
    // 1. Insert apiaries
    console.log('Adding apiaries...');
    const { data: createdApiaries, error: apiaryError } = await supabase
      .from('apiaries')
      .insert(apiaries)
      .select();
    
    if (apiaryError) throw apiaryError;
    console.log(`Added ${createdApiaries.length} apiaries.`);
    
    // 2. For each apiary, add hives
    console.log('Adding hives...');
    let totalHives = 0;
    let allHives = [];
    
    for (const apiary of createdApiaries) {
      const hives = generateHiveData(apiary.id);
      const { data: createdHives, error: hivesError } = await supabase
        .from('hives')
        .insert(hives)
        .select();
      
      if (hivesError) throw hivesError;
      totalHives += createdHives.length;
      allHives = [...allHives, ...createdHives];
    }
    
    console.log(`Added ${totalHives} hives.`);
    
    // 3. For each hive, add historical data
    console.log('Adding historical data...');
    let totalHistoricalRecords = 0;
    
    for (const hive of allHives) {
      const historicalData = generateHistoricalData(hive.id);
      const { data, error: historyError } = await supabase
        .from('historical_data')
        .insert(historicalData);
      
      if (historyError) throw historyError;
      totalHistoricalRecords += historicalData.length;
    }
    
    console.log(`Added ${totalHistoricalRecords} historical data records.`);
    
    // 4. For each hive, add inspection logs
    console.log('Adding inspection logs...');
    let totalInspectionLogs = 0;
    let allInspectionLogs = [];
    
    for (const hive of allHives) {
      const inspectionLogs = generateInspectionLogs(hive.id);
      const { data: createdLogs, error: logsError } = await supabase
        .from('inspection_logs')
        .insert(inspectionLogs)
        .select();
      
      if (logsError) throw logsError;
      totalInspectionLogs += createdLogs.length;
      allInspectionLogs = [...allInspectionLogs, ...createdLogs];
    }
    
    console.log(`Added ${totalInspectionLogs} inspection logs.`);
    
    // 5. For each inspection log, add actions
    console.log('Adding inspection actions...');
    let totalActions = 0;
    
    for (const log of allInspectionLogs) {
      const actions = generateInspectionActions(log.id);
      
      if (actions.length > 0) {
        const { data, error: actionsError } = await supabase
          .from('inspection_actions')
          .insert(actions);
        
        if (actionsError) throw actionsError;
        totalActions += actions.length;
      }
    }
    
    console.log(`Added ${totalActions} inspection actions.`);
    
    console.log('Database seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run the seeding function
seedDatabase();
