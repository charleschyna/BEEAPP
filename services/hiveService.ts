import { supabase } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';

// Types that match our database schema
export interface Apiary {
  id: string;
  name: string;
  location?: string;
  notes?: string;
}

export interface Hive {
  id: string;
  name: string;
  apiary_id: string;
  temperature: number;
  humidity: number;
  weight: number;
  sound?: number;
  status: 'healthy' | 'warning' | 'danger';
  last_updated: string;
}

export interface InspectionLog {
  id: string;
  hive_id: string;
  date: string;
  queen_spotted: boolean;
  brood_patterns: 'excellent' | 'good' | 'fair' | 'poor';
  honey_stores: 'abundant' | 'good' | 'fair' | 'low';
  pollen_stores: 'abundant' | 'adequate' | 'good' | 'fair' | 'low';
  diseases_signs: boolean;
  diseases_notes?: string;
  notes?: string;
  actions?: string[];
}

export interface HistoricalData {
  id: string;
  hive_id: string;
  date: string;
  temperature: number;
  humidity: number;
  weight: number;
  sound?: number;
}

// API functions for Apiaries
export const fetchApiaries = async (): Promise<Apiary[]> => {
  try {
    const { data, error } = await supabase
      .from('apiaries')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching apiaries:', error);
    return [];
  }
};

export const addApiary = async (apiary: Omit<Apiary, 'id'>): Promise<Apiary | null> => {
  try {
    const { data, error } = await supabase
      .from('apiaries')
      .insert(apiary)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding apiary:', error);
    return null;
  }
};

export const updateApiary = async (id: string, updates: Partial<Apiary>): Promise<Apiary | null> => {
  try {
    const { data, error } = await supabase
      .from('apiaries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating apiary:', error);
    return null;
  }
};

export const deleteApiary = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('apiaries')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting apiary:', error);
    return false;
  }
};

// API functions for Hives
export const fetchHives = async (): Promise<Hive[]> => {
  try {
    const { data, error } = await supabase
      .from('hives')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching hives:', error);
    return [];
  }
};

export const fetchHivesByApiaryId = async (apiaryId: string): Promise<Hive[]> => {
  try {
    const { data, error } = await supabase
      .from('hives')
      .select('*')
      .eq('apiary_id', apiaryId)
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching hives for apiary ${apiaryId}:`, error);
    return [];
  }
};

export const addHive = async (hive: Omit<Hive, 'id'>): Promise<Hive | null> => {
  try {
    const { data, error } = await supabase
      .from('hives')
      .insert(hive)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding hive:', error);
    return null;
  }
};

export const updateHive = async (id: string, updates: Partial<Hive>): Promise<Hive | null> => {
  try {
    const { data, error } = await supabase
      .from('hives')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating hive:', error);
    return null;
  }
};

export const deleteHive = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('hives')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting hive:', error);
    return false;
  }
};

// API functions for Inspection Logs
export const fetchInspectionLogs = async (hiveId: string): Promise<InspectionLog[]> => {
  try {
    // First get the logs
    const { data: logs, error } = await supabase
      .from('inspection_logs')
      .select('*')
      .eq('hive_id', hiveId)
      .order('date', { ascending: false });
    
    if (error) {
      // If table doesn't exist, return empty array instead of throwing
      if (error.code === '42P01') { // PostgreSQL code for "relation does not exist"
        console.warn('Inspection logs table does not exist yet. Returning empty array.');
        return [];
      }
      throw error;
    }
    
    if (!logs || logs.length === 0) {
      return [];
    }

    // Then get the actions for each log
    const inspectionLogs = await Promise.all(logs.map(async (log) => {
      const { data: actions, error: actionsError } = await supabase
        .from('inspection_actions')
        .select('action')
        .eq('inspection_id', log.id);
        
      if (actionsError) throw actionsError;
      
      return {
        ...log,
        actions: actions ? actions.map(a => a.action) : []
      };
    }));
    
    return inspectionLogs;
  } catch (error) {
    console.error('Error fetching inspection logs:', error);
    return []; // Return empty array on error instead of throwing
  }
};

export const addInspectionLog = async (
  inspectionLog: Omit<InspectionLog, 'id' | 'actions'>,
  actions: string[]
): Promise<InspectionLog | null> => {
  try {
    // Begin a transaction by starting a callback that returns a promise
    const result = await supabase.rpc('add_inspection_with_actions', {
      inspection_data: inspectionLog,
      action_texts: actions
    });
    
    if (result.error) throw result.error;
    
    // If we succeeded, fetch the newly created inspection with its actions
    const newLog = await fetchInspectionLogs(inspectionLog.hive_id);
    return newLog[0] || null;
  } catch (error) {
    console.error('Error adding inspection log:', error);
    
    // Try a fallback approach without the RPC if it's not set up
    try {
      // First insert the inspection log
      const { data: logData, error: logError } = await supabase
        .from('inspection_logs')
        .insert(inspectionLog)
        .select()
        .single();
        
      if (logError) throw logError;
      
      // Then insert each action referencing the new log
      if (actions && actions.length > 0) {
        const actionInserts = actions.map(action => ({
          inspection_id: logData.id,
          action
        }));
        
        const { error: actionsError } = await supabase
          .from('inspection_actions')
          .insert(actionInserts);
          
        if (actionsError) throw actionsError;
      }
      
      // Return the new inspection log with actions
      return {
        ...logData,
        actions: actions || []
      };
    } catch (fallbackError) {
      console.error('Error in fallback inspection creation:', fallbackError);
      return null;
    }
  }
};

// API functions for Historical Data
export const fetchHistoricalData = async (hiveId: string): Promise<HistoricalData[]> => {
  try {
    const { data, error } = await supabase
      .from('historical_data')
      .select('*')
      .eq('hive_id', hiveId)
      .order('date', { ascending: false })
      .limit(30); // Last 30 data points
    
    if (error) {
      // If table doesn't exist, return empty array instead of throwing
      if (error.code === '42P01') { // PostgreSQL code for "relation does not exist"
        console.warn('Historical data table does not exist yet. Returning empty array.');
        return [];
      }
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return []; // Return empty array on error instead of throwing
  }
};

// Real-time subscriptions
export const subscribeToHives = (
  callback: (hives: Hive[]) => void,
  onError?: (error: PostgrestError) => void
) => {
  const subscription = supabase
    .channel('public:hives')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'hives'
      },
      async (payload) => {
        try {
          // When any change occurs, fetch all hives
          const { data, error } = await supabase
            .from('hives')
            .select('*')
            .order('name');
          
          if (error) {
            if (onError) onError(error);
            return;
          }
          
          callback(data || []);
        } catch (error) {
          console.error('Error in hives subscription callback:', error);
        }
      }
    )
    .subscribe();
    
  // Return unsubscribe function
  return () => {
    supabase.removeChannel(subscription);
  };
};

export const subscribeToApiaries = (
  callback: (apiaries: Apiary[]) => void,
  onError?: (error: PostgrestError) => void
) => {
  const subscription = supabase
    .channel('public:apiaries')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'apiaries'
      },
      async (payload) => {
        try {
          // When any change occurs, fetch all apiaries
          const { data, error } = await supabase
            .from('apiaries')
            .select('*')
            .order('name');
          
          if (error) {
            if (onError) onError(error);
            return;
          }
          
          callback(data || []);
        } catch (error) {
          console.error('Error in apiaries subscription callback:', error);
        }
      }
    )
    .subscribe();
    
  // Return unsubscribe function
  return () => {
    supabase.removeChannel(subscription);
  };
};

export const subscribeToInspectionLogs = (
  hiveId: string,
  callback: (logs: InspectionLog[]) => void,
  onError?: (error: PostgrestError) => void
) => {
  const subscription = supabase
    .channel(`public:inspection_logs:hive_id=eq.${hiveId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'inspection_logs',
        filter: `hive_id=eq.${hiveId}`
      },
      async (payload) => {
        try {
          // When any change occurs, fetch all logs for this hive
          const logs = await fetchInspectionLogs(hiveId);
          callback(logs);
        } catch (error) {
          console.error(`Error in inspection logs subscription callback for hive ${hiveId}:`, error);
        }
      }
    )
    .subscribe();
    
  // Return unsubscribe function
  return () => {
    supabase.removeChannel(subscription);
  };
};

// Helper function to simulate sensor readings (for demo purposes)
export const simulateSensorUpdate = async (hiveId: string): Promise<boolean> => {
  try {
    // First get the current hive data
    const { data: hive, error: hiveError } = await supabase
      .from('hives')
      .select('*')
      .eq('id', hiveId)
      .single();
      
    if (hiveError) throw hiveError;
    
    // Generate random variations (+/- 5%)
    const variation = (value: number) => {
      const change = value * 0.05 * (Math.random() * 2 - 1); // +/- 5%
      return value + change;
    };
    
    const newTemp = variation(hive.temperature);
    const newHumidity = variation(hive.humidity);
    const newWeight = variation(hive.weight);
    const newSound = hive.sound ? variation(hive.sound) : undefined;
    
    // Determine hive status based on readings
    let status: 'healthy' | 'warning' | 'danger' = 'healthy';
    
    // Example logic: 
    // - Temperature too high or too low
    // - Humidity out of optimal range
    // - Sudden weight changes
    if (newTemp > 35 || newTemp < 15 || newHumidity > 80 || newHumidity < 30) {
      status = 'warning';
    }
    
    if (newTemp > 40 || newTemp < 10 || newHumidity > 90 || newHumidity < 20) {
      status = 'danger';
    }
    
    // Update the hive with new readings
    const { error: updateError } = await supabase
      .from('hives')
      .update({
        temperature: newTemp,
        humidity: newHumidity,
        weight: newWeight,
        sound: newSound,
        status: status,
        last_updated: new Date().toISOString()
      })
      .eq('id', hiveId);
      
    if (updateError) throw updateError;
    
    // Also add to historical data
    const { error: historyError } = await supabase
      .from('historical_data')
      .insert({
        hive_id: hiveId,
        date: new Date().toISOString(),
        temperature: newTemp,
        humidity: newHumidity,
        weight: newWeight,
        sound: newSound
      });
      
    if (historyError) throw historyError;
    
    return true;
  } catch (error) {
    console.error(`Error simulating sensor update for hive ${hiveId}:`, error);
    return false;
  }
};
