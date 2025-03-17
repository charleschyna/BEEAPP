import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { 
  fetchHives, 
  subscribeToHives, 
  fetchApiaries, 
  subscribeToApiaries,
  fetchInspectionLogs,
  fetchHistoricalData,
  addHive as apiAddHive,
  updateHive as apiUpdateHive,
  addApiary as apiAddApiary,
  deleteHive as apiDeleteHive,
  Hive as ServiceHive,
  Apiary as ServiceApiary,
  InspectionLog as ServiceInspectionLog,
  HistoricalData,
  addInspectionLog as apiAddInspectionLog
} from '@/services/hiveService';

// Define our data types - compatible with UI but can map from service types
export interface Hive {
  id: string;
  name: string;
  apiaryId: string | null;
  sensorId: string; 
  createdAt: string;
  updatedAt: string;
}

export interface InspectionLog {
  id: string;
  hiveId: string;
  date: string; // ISO date string
  notes: string;
  queenSpotted: boolean;
  broodPatterns: 'excellent' | 'good' | 'fair' | 'poor';
  diseasesSigns: boolean;
  diseasesNotes?: string;
  honeyStores: 'abundant' | 'good' | 'fair' | 'low';
  pollenStores: 'abundant' | 'adequate' | 'good' | 'fair' | 'low';
  actions: string[];
}

export interface HiveHistoricalData {
  date: string;
  temperature: number;
  humidity: number;
  weight: number;
  sound?: number;
}

export interface Apiary {
  id: string;
  name: string;
  location: string;
  imageUrl?: string;
}

// Mapper functions to convert between service and UI models
const mapServiceHiveToUIHive = (serviceHive: ServiceHive): Hive => ({
  id: serviceHive.id,
  name: serviceHive.name,
  apiaryId: serviceHive.apiary_id,
  sensorId: serviceHive.sensor_id,
  createdAt: serviceHive.created_at,
  updatedAt: serviceHive.updated_at,
});

const mapUIHiveToServiceHive = (uiHive: Hive): Omit<ServiceHive, 'id'> => ({
  name: uiHive.name,
  apiary_id: uiHive.apiaryId,
  sensor_id: uiHive.sensorId,
});

const mapServiceApiaryToUIApiary = (serviceApiary: ServiceApiary): Apiary => ({
  id: serviceApiary.id,
  name: serviceApiary.name,
  location: serviceApiary.location || '',
  imageUrl: undefined // We don't store this in the service
});

const mapUIApiaryToServiceApiary = (uiApiary: Omit<Apiary, 'id'>): Omit<ServiceApiary, 'id'> => ({
  name: uiApiary.name,
  location: uiApiary.location,
});

const mapServiceInspectionLogToUIInspectionLog = (serviceLog: ServiceInspectionLog): InspectionLog => ({
  id: serviceLog.id,
  hiveId: serviceLog.hive_id,
  date: serviceLog.date,
  queenSpotted: serviceLog.queen_spotted,
  broodPatterns: serviceLog.brood_patterns,
  diseasesSigns: serviceLog.diseases_signs,
  diseasesNotes: serviceLog.diseases_notes,
  honeyStores: serviceLog.honey_stores,
  pollenStores: serviceLog.pollen_stores,
  notes: serviceLog.notes || '',
  actions: serviceLog.actions || []
});

const mapUIInspectionLogToServiceInspectionLog = (
  uiLog: Omit<InspectionLog, 'id'>
): Omit<ServiceInspectionLog, 'id' | 'actions'> => ({
  hive_id: uiLog.hiveId,
  date: uiLog.date,
  queen_spotted: uiLog.queenSpotted,
  brood_patterns: uiLog.broodPatterns,
  diseases_signs: uiLog.diseasesSigns,
  diseases_notes: uiLog.diseasesNotes,
  honey_stores: uiLog.honeyStores,
  pollen_stores: uiLog.pollenStores,
  notes: uiLog.notes
});

interface BeekeepingContextType {
  apiaries: Apiary[];
  setApiaries: (apiaries: Apiary[]) => void;
  fetchApiaries: () => Promise<Apiary[]>;
  hives: Hive[];
  inspectionLogs: InspectionLog[];
  historicalData: Record<string, HiveHistoricalData[]>; // Key is hiveId
  addApiary: (apiary: Omit<Apiary, 'id'>) => Promise<void>;
  addHive: (hive: Omit<Hive, 'id'>) => Promise<void>;
  updateHive: (id: string, updates: Partial<Hive>) => Promise<void>;
  deleteHive: (id: string) => Promise<void>;
  addInspectionLog: (log: Omit<InspectionLog, 'id'>) => Promise<void>;
  getTotalApiaries: () => number;
  getTotalHives: () => number;
  getHivesByApiaryId: (apiaryId: string) => Hive[];
  getHiveById: (id: string) => Hive | undefined;
  getApiaryById: (id: string) => Apiary | undefined;
  getInspectionLogsByHiveId: (hiveId: string) => InspectionLog[];
  getHistoricalDataByHiveId: (hiveId: string) => HiveHistoricalData[];
  isLoading: boolean;
  error: string | null;
  subscribeToSensorData: (hiveId: string) => any;
}

// Initialize with empty arrays
const initialApiaries: Apiary[] = [];
const initialHives: Hive[] = [];
const initialInspectionLogs: InspectionLog[] = [];
const initialHistoricalData: Record<string, HiveHistoricalData[]> = {};

// Create the context
const BeekeepingContext = createContext<BeekeepingContextType | undefined>(undefined);

// Provider component
export function BeekeepingProvider({ children }: { children: ReactNode }) {
  const [apiaries, setApiaries] = useState<Apiary[]>(initialApiaries);
  const [hives, setHives] = useState<Hive[]>(initialHives);
  const [inspectionLogs, setInspectionLogs] = useState<InspectionLog[]>(initialInspectionLogs);
  const [historicalData, setHistoricalData] = useState<Record<string, HiveHistoricalData[]>>(initialHistoricalData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Set up real-time subscription to hives
  useEffect(() => {
    setIsLoading(true);
    setError(null); // Reset error state when re-fetching
    
    // First load initial data directly
    const loadInitialHives = async () => {
      try {
        const hivesData = await fetchHives();
        const uiHives = hivesData.map(mapServiceHiveToUIHive);
        setHives(uiHives);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching hives:', err);
        setError('Failed to load hive data. Please check your network connection.');
        setIsLoading(false);
      }
    };
    
    loadInitialHives();
    
    try {
      // Initialize subscription to hive data
      const unsubscribe = subscribeToHives((updatedHives) => {
        // Convert service hives to UI hives
        const uiHives = updatedHives.map(mapServiceHiveToUIHive);
        setHives(uiHives);
        setIsLoading(false);
        setError(null); // Clear any existing errors on successful update
      }, (error) => {
        console.error('Supabase subscription error:', error);
        setError('Error receiving real-time updates. Please refresh the app.');
      });
      
      // Set a timeout to ensure we stop loading state even if subscription doesn't work
      const timeoutId = setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
        }
      }, 10000); // 10 second timeout
      
      // Cleanup subscription and timeout on unmount
      return () => {
        unsubscribe(); // Direct function call, not an object method
        clearTimeout(timeoutId);
      };
    } catch (err) {
      console.error('Error setting up hive subscription:', err);
      setError('Failed to connect to the database. Please try again later.');
      setIsLoading(false);
    }
  }, []);
  
  // Fetch initial data for apiaries and set up subscription
  useEffect(() => {
    setIsLoading(true);
    setError(null); // Reset error state when re-fetching
    
    const fetchApiariesData = async () => {
      try {
        const apiaryData = await fetchApiaries();
        setApiaries(apiaryData.map(mapServiceApiaryToUIApiary));
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching apiaries:', err);
        setError('Failed to load apiary data. Please check your network connection.');
        setIsLoading(false);
      }
    };
    
    fetchApiariesData();
    
    try {
      // Set up real-time subscription
      const unsubscribe = subscribeToApiaries((updatedApiaries) => {
        setApiaries(updatedApiaries.map(mapServiceApiaryToUIApiary));
        setError(null); // Clear any existing errors on successful update
      }, (error) => {
        console.error('Supabase subscription error:', error);
        setError('Error receiving real-time updates for apiaries. Please refresh the app.');
      });
      
      // Set a timeout to ensure we stop loading state even if subscription doesn't work
      const timeoutId = setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
        }
      }, 10000); // 10 second timeout
      
      return () => {
        unsubscribe();
        clearTimeout(timeoutId);
      };
    } catch (err) {
      console.error('Error setting up apiary subscription:', err);
      setError('Failed to connect to the database. Please try again later.');
      setIsLoading(false);
    }
  }, []);

  const fetchApiaries = async () => {
    const { data, error } = await supabase
        .from('apiaries')
        .select('*'); // Fetch all apiaries

    if (error) {
        console.error('Error fetching apiaries:', error);
        return [];
    }

    return data.map(mapServiceApiaryToUIApiary); // Map to UI format
  };

  // Load inspection logs for all hives
  useEffect(() => {
    const loadInspectionLogs = async () => {
      if (hives.length === 0) return;
      
      const allLogs: InspectionLog[] = [];
      
      for (const hive of hives) {
        try {
          const hiveLogs = await fetchInspectionLogs(hive.id);
          allLogs.push(...hiveLogs.map(mapServiceInspectionLogToUIInspectionLog));
        } catch (err) {
          console.error(`Error fetching inspection logs for hive ${hive.id}:`, err);
          // Continue with other hives even if this one fails
          // This handles the case where inspection_logs table doesn't exist yet
        }
      }
      
      setInspectionLogs(allLogs);
    };
    
    // Try to load logs but don't block app functionality if it fails
    loadInspectionLogs().catch(err => {
      console.error("Failed to load inspection logs:", err);
      // Set empty array to prevent further loading attempts
      setInspectionLogs([]);
    });
  }, [hives]);
  
  // Load historical data for each hive
  useEffect(() => {
    const loadHistoricalData = async () => {
      if (hives.length === 0) return;
      
      const historicalDataMap: Record<string, HiveHistoricalData[]> = {};
      
      for (const hive of hives) {
        try {
          const hiveData = await fetchHistoricalData(hive.id);
          
          // Map service data to UI data
          historicalDataMap[hive.id] = hiveData.map(data => ({
            date: data.date,
            temperature: data.temperature,
            humidity: data.humidity,
            weight: data.weight,
            sound: data.sound
          }));
        } catch (err) {
          console.error(`Error fetching historical data for hive ${hive.id}:`, err);
          historicalDataMap[hive.id] = []; // Initialize with empty array
        }
      }
      
      setHistoricalData(historicalDataMap);
    };
    
    loadHistoricalData().catch(err => {
      console.error("Failed to load historical data:", err);
      setHistoricalData({});
    });
  }, [hives]);

  // Add a new apiary
  const addApiary = async (apiary: Omit<Apiary, 'id'>) => {
    try {
        const serviceApiary = mapUIApiaryToServiceApiary(apiary);
        const { data, error } = await supabase
            .from('apiaries')
            .insert([serviceApiary]);

        if (error) {
            throw new Error(error.message);
        }

        if (data) {
            setApiaries((prev) => [...prev, data[0]]);
        }
    } catch (err) {
        console.error('Error adding apiary:', err);
        setError('Failed to add apiary');
    }
  };

  // Add a new hive
  const addHive = async (hiveData: Omit<Hive, 'id'>): Promise<void> => {
    const { data, error } = await supabase
        .from('hives')
        .insert([hiveData]);

    if (error) {
        throw new Error(error.message);
    }
  };

  // Update an existing hive
  const updateHive = async (id: string, updates: Partial<Hive>) => {
    try {
      // Convert UI updates to service updates
      const serviceUpdates: Partial<ServiceHive> = {};
      
      if (updates.name !== undefined) serviceUpdates.name = updates.name;
      if (updates.apiaryId !== undefined) serviceUpdates.apiary_id = updates.apiaryId;
      if (updates.sensorId !== undefined) serviceUpdates.sensor_id = updates.sensorId;
      
      const updatedHive = await apiUpdateHive(id, serviceUpdates);
      
      if (updatedHive) {
        // Update happens through the subscription, but let's update locally for immediate feedback
        const uiHive = mapServiceHiveToUIHive(updatedHive);
        setHives(prevHives => prevHives.map(h => h.id === id ? uiHive : h));
      }
    } catch (err) {
      console.error('Error updating hive:', err);
      setError('Failed to update hive');
    }
  };

  // Delete an existing hive
  const deleteHive = async (id: string) => {
    try {
      // First remove from local state
      setHives(prevHives => prevHives.filter(h => h.id !== id));
      
      // Then delete from database
      const success = await apiDeleteHive(id);
      
      if (!success) {
        // If deletion failed, restore the hive
        const hive = await fetchHiveById(id);
        if (hive) {
          setHives(prevHives => [...prevHives, mapServiceHiveToUIHive(hive)]);
        }
        throw new Error('Failed to delete hive');
      }
    } catch (err) {
      console.error('Error deleting hive:', err);
      setError('Failed to delete hive');
      throw err;
    }
  };

  // Add a new inspection log
  const addInspectionLog = async (log: Omit<InspectionLog, 'id'>) => {
    try {
      const serviceLog = mapUIInspectionLogToServiceInspectionLog(log);
      const actions = log.actions || [];
      
      const newLog = await apiAddInspectionLog(serviceLog, actions);
      
      if (newLog) {
        const uiLog = mapServiceInspectionLogToUIInspectionLog(newLog);
        setInspectionLogs(prevLogs => [uiLog, ...prevLogs]);
      }
    } catch (err) {
      console.error('Error adding inspection log:', err);
      setError('Failed to add inspection log');
    }
  };

  // Utility functions
  const getTotalApiaries = () => apiaries.length;
  const getTotalHives = () => hives.length;
  const getHivesByApiaryId = (apiaryId: string) => hives.filter(h => h.apiaryId === apiaryId);
  const getHiveById = (id: string) => hives.find(h => h.id === id);
  const getApiaryById = (id: string) => apiaries.find(a => a.id === id);
  const getInspectionLogsByHiveId = (hiveId: string) => 
    inspectionLogs.filter(log => log.hiveId === hiveId);
  const getHistoricalDataByHiveId = (hiveId: string) => historicalData[hiveId] || [];

  // Implement real-time data subscription
  const subscribeToSensorData = (hiveId: string) => {
    return supabase
        .from(`sensor_data:hive_id=eq.${hiveId}`)
        .on('INSERT', (payload: any) => {
            console.log('New sensor data:', payload.new);
            // Handle new sensor data (update state, etc.)
        })
        .subscribe();
  };

  // Context value
  const value = {
    apiaries,
    setApiaries,
    fetchApiaries,
    hives,
    inspectionLogs,
    historicalData,
    addApiary,
    addHive,
    updateHive,
    deleteHive,
    addInspectionLog,
    getTotalApiaries,
    getTotalHives,
    getHivesByApiaryId,
    getHiveById,
    getApiaryById,
    getInspectionLogsByHiveId,
    getHistoricalDataByHiveId,
    isLoading,
    error,
    subscribeToSensorData
  };

  return (
    <BeekeepingContext.Provider value={value}>
      {children}
    </BeekeepingContext.Provider>
  );
}

// Custom hook for using the context
export const useBeekeeping = () => {
  const context = useContext(BeekeepingContext);
  if (context === undefined) {
    throw new Error('useBeekeeping must be used within a BeekeepingProvider');
  }
  return context;
};
