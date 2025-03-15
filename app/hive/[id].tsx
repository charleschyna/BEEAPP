import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { colors, spacing, typography } from '@/constants/theme';
import { useBeekeeping, Hive, InspectionLog } from '@/context/BeekeepingContext';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { 
  ArrowLeft, Thermometer, Droplets, Scale, Volume2, 
  Calendar, ClipboardEdit, RefreshCw 
} from 'lucide-react-native';
import { AddInspectionModal } from '@/components/AddInspectionModal';

enum TabType {
  Details = 'details',
  Analytics = 'analytics',
  Inspections = 'inspections',
}

export default function HiveDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getHiveById, getApiaryById, getInspectionLogsByHiveId, getHistoricalDataByHiveId, isLoading, error } = useBeekeeping();
  
  const [activeTab, setActiveTab] = useState<TabType>(TabType.Details);
  const [isAddInspectionModalVisible, setIsAddInspectionModalVisible] = useState(false);
  
  const hive = getHiveById(id as string);
  const apiary = hive ? getApiaryById(hive.apiaryId) : undefined;
  const inspectionLogs = getInspectionLogsByHiveId(id as string);
  const historicalData = getHistoricalDataByHiveId(id as string);
  
  const chartWidth = Dimensions.get('window').width - 32; // 32 for padding
  
  // For charts, limit to last 7 days of data
  const recentHistoricalData = historicalData.slice(-7);
  
  const labels = recentHistoricalData.map(item => {
    const date = new Date(item.date);
    return `${date.getMonth()+1}/${date.getDate()}`;
  });
  
  const temperatureData = recentHistoricalData.map(item => item.temperature);
  const humidityData = recentHistoricalData.map(item => item.humidity);
  const weightData = recentHistoricalData.map(item => item.weight);
  const soundData = recentHistoricalData.map(item => item.sound || 0);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const getStatusColor = (status: 'healthy' | 'warning' | 'danger') => {
    switch (status) {
      case 'healthy': return colors.success;
      case 'warning': return colors.warning;
      case 'danger': return colors.danger;
      default: return colors.text;
    }
  };
  
  const getBroodPatternColor = (pattern: 'excellent' | 'good' | 'fair' | 'poor') => {
    switch (pattern) {
      case 'excellent': return colors.success;
      case 'good': return colors.success;
      case 'fair': return colors.warning;
      case 'poor': return colors.danger;
      default: return colors.text;
    }
  };
  
  const getHoneyStoresColor = (stores: 'abundant' | 'good' | 'fair' | 'low') => {
    switch (stores) {
      case 'abundant': return colors.success;
      case 'good': return colors.success;
      case 'fair': return colors.warning;
      case 'low': return colors.danger;
      default: return colors.text;
    }
  };
  
  const getPollenStoresColor = (stores: 'abundant' | 'adequate' | 'good' | 'fair' | 'low') => {
    switch (stores) {
      case 'abundant': return colors.success;
      case 'adequate': return colors.success;
      case 'good': return colors.success;
      case 'fair': return colors.warning;
      case 'low': return colors.danger;
      default: return colors.text;
    }
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading hive data...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable 
          style={styles.retryButton}
          onPress={() => window.location.reload()}
        >
          <RefreshCw size={16} color={colors.white} />
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }
  
  if (!hive) {
    return (
      <View style={styles.container}>
        <Stack.Screen 
          options={{
            headerTitle: "Hive Not Found",
            headerLeft: () => (
              <Pressable onPress={() => router.back()} style={styles.backButton}>
                <ArrowLeft size={24} color={colors.text} />
              </Pressable>
            ),
          }}
        />
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>
            The requested hive was not found. It may have been deleted.
          </Text>
          <Pressable 
            style={styles.backToHivesButton} 
            onPress={() => router.push('/hives')}
          >
            <Text style={styles.backToHivesButtonText}>Back to Hives</Text>
          </Pressable>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerTitle: hive.name,
          headerTitleStyle: styles.headerTitle,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </Pressable>
          ),
        }}
      />
      
      <View style={styles.tabsContainer}>
        <Pressable 
          style={[styles.tab, activeTab === TabType.Details && styles.activeTab]}
          onPress={() => setActiveTab(TabType.Details)}
        >
          <Text style={[styles.tabText, activeTab === TabType.Details && styles.activeTabText]}>
            Details
          </Text>
        </Pressable>
        
        <Pressable 
          style={[styles.tab, activeTab === TabType.Analytics && styles.activeTab]}
          onPress={() => setActiveTab(TabType.Analytics)}
        >
          <Text style={[styles.tabText, activeTab === TabType.Analytics && styles.activeTabText]}>
            Analytics
          </Text>
        </Pressable>
        
        <Pressable 
          style={[styles.tab, activeTab === TabType.Inspections && styles.activeTab]}
          onPress={() => setActiveTab(TabType.Inspections)}
        >
          <Text style={[styles.tabText, activeTab === TabType.Inspections && styles.activeTabText]}>
            Inspections
          </Text>
        </Pressable>
      </View>
      
      <ScrollView style={styles.content}>
        {activeTab === TabType.Details && (
          <View style={styles.detailsTab}>
            <View style={styles.hiveSummary}>
              <View style={styles.summaryHeader}>
                <View>
                  <Text style={styles.apiaryName}>
                    {apiary?.name || 'Unknown Apiary'}
                  </Text>
                  <Text style={styles.hiveTitle}>{hive.name}</Text>
                </View>
                
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(hive.status) }]}>
                  <Text style={styles.statusText}>
                    {hive.status.charAt(0).toUpperCase() + hive.status.slice(1)}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.lastUpdated}>
                Last update: {formatDate(hive.lastUpdated)}
              </Text>
            </View>
            
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Thermometer size={24} color={colors.primary} />
                <Text style={styles.metricLabel}>Temperature</Text>
                <Text style={styles.metricValue}>{hive.temperature}°C</Text>
              </View>
              
              <View style={styles.metricCard}>
                <Droplets size={24} color={colors.primary} />
                <Text style={styles.metricLabel}>Humidity</Text>
                <Text style={styles.metricValue}>{hive.humidity}%</Text>
              </View>
              
              <View style={styles.metricCard}>
                <Scale size={24} color={colors.primary} />
                <Text style={styles.metricLabel}>Weight</Text>
                <Text style={styles.metricValue}>{hive.weight} kg</Text>
              </View>
              
              {hive.sound && (
                <View style={styles.metricCard}>
                  <Volume2 size={24} color={colors.primary} />
                  <Text style={styles.metricLabel}>Sound</Text>
                  <Text style={styles.metricValue}>{hive.sound} dB</Text>
                </View>
              )}
            </View>
          </View>
        )}
        
        {activeTab === TabType.Analytics && (
          <View style={styles.analyticsTab}>
            {historicalData.length === 0 ? (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>No historical data available for this hive yet.</Text>
              </View>
            ) : (
              <>
                <Text style={styles.chartTitle}>Temperature History (°C)</Text>
                <LineChart
                  data={{
                    labels,
                    datasets: [{ data: temperatureData }]
                  }}
                  width={chartWidth}
                  height={220}
                  chartConfig={{
                    backgroundColor: colors.background,
                    backgroundGradientFrom: colors.white,
                    backgroundGradientTo: colors.white,
                    decimalPlaces: 1,
                    color: () => colors.primary,
                    labelColor: () => colors.text,
                    style: { borderRadius: 16 },
                    propsForDots: { r: '6', strokeWidth: '2', stroke: colors.primaryLight }
                  }}
                  bezier
                  style={styles.chart}
                />
                
                <Text style={styles.chartTitle}>Humidity History (%)</Text>
                <LineChart
                  data={{
                    labels,
                    datasets: [{ data: humidityData }]
                  }}
                  width={chartWidth}
                  height={220}
                  chartConfig={{
                    backgroundColor: colors.background,
                    backgroundGradientFrom: colors.white,
                    backgroundGradientTo: colors.white,
                    decimalPlaces: 1,
                    color: () => '#3498db',
                    labelColor: () => colors.text,
                    style: { borderRadius: 16 },
                    propsForDots: { r: '6', strokeWidth: '2', stroke: '#2980b9' }
                  }}
                  bezier
                  style={styles.chart}
                />
                
                <Text style={styles.chartTitle}>Weight History (kg)</Text>
                <LineChart
                  data={{
                    labels,
                    datasets: [{ data: weightData }]
                  }}
                  width={chartWidth}
                  height={220}
                  chartConfig={{
                    backgroundColor: colors.background,
                    backgroundGradientFrom: colors.white,
                    backgroundGradientTo: colors.white,
                    decimalPlaces: 1,
                    color: () => '#e67e22',
                    labelColor: () => colors.text,
                    style: { borderRadius: 16 },
                    propsForDots: { r: '6', strokeWidth: '2', stroke: '#d35400' }
                  }}
                  bezier
                  style={styles.chart}
                />
                
                {hive.sound && (
                  <>
                    <Text style={styles.chartTitle}>Sound History (dB)</Text>
                    <LineChart
                      data={{
                        labels,
                        datasets: [{ data: soundData }]
                      }}
                      width={chartWidth}
                      height={220}
                      chartConfig={{
                        backgroundColor: colors.background,
                        backgroundGradientFrom: colors.white,
                        backgroundGradientTo: colors.white,
                        decimalPlaces: 1,
                        color: () => '#9b59b6',
                        labelColor: () => colors.text,
                        style: { borderRadius: 16 },
                        propsForDots: { r: '6', strokeWidth: '2', stroke: '#8e44ad' }
                      }}
                      bezier
                      style={styles.chart}
                    />
                  </>
                )}
              </>
            )}
          </View>
        )}
        
        {activeTab === TabType.Inspections && (
          <View style={styles.inspectionsTab}>
            <Pressable 
              style={styles.addInspectionButton}
              onPress={() => setIsAddInspectionModalVisible(true)}
            >
              <ClipboardEdit size={20} color={colors.white} />
              <Text style={styles.addInspectionButtonText}>Add Inspection</Text>
            </Pressable>
            
            {inspectionLogs.length === 0 ? (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>No inspection logs available for this hive yet.</Text>
              </View>
            ) : (
              inspectionLogs.map((log) => (
                <View key={log.id} style={styles.inspectionCard}>
                  <View style={styles.inspectionHeader}>
                    <View style={styles.dateContainer}>
                      <Calendar size={16} color={colors.primary} />
                      <Text style={styles.inspectionDate}>{formatDate(log.date)}</Text>
                    </View>
                    
                    <View style={styles.queenContainer}>
                      <Text style={log.queenSpotted ? styles.queenSpotted : styles.queenNotSpotted}>
                        Queen {log.queenSpotted ? 'Spotted' : 'Not Spotted'}
                      </Text>
                    </View>
                  </View>
                  
                  {log.notes && (
                    <Text style={styles.inspectionNotes}>{log.notes}</Text>
                  )}
                  
                  <View style={styles.inspectionDetails}>
                    <View style={styles.inspectionDetail}>
                      <Text style={styles.detailLabel}>Brood Patterns:</Text>
                      <Text 
                        style={[
                          styles.detailValue, 
                          { color: getBroodPatternColor(log.broodPatterns) }
                        ]}
                      >
                        {log.broodPatterns.charAt(0).toUpperCase() + log.broodPatterns.slice(1)}
                      </Text>
                    </View>
                    
                    <View style={styles.inspectionDetail}>
                      <Text style={styles.detailLabel}>Honey Stores:</Text>
                      <Text 
                        style={[
                          styles.detailValue, 
                          { color: getHoneyStoresColor(log.honeyStores) }
                        ]}
                      >
                        {log.honeyStores.charAt(0).toUpperCase() + log.honeyStores.slice(1)}
                      </Text>
                    </View>
                    
                    <View style={styles.inspectionDetail}>
                      <Text style={styles.detailLabel}>Pollen Stores:</Text>
                      <Text 
                        style={[
                          styles.detailValue, 
                          { color: getPollenStoresColor(log.pollenStores) }
                        ]}
                      >
                        {log.pollenStores.charAt(0).toUpperCase() + log.pollenStores.slice(1)}
                      </Text>
                    </View>
                    
                    <View style={styles.inspectionDetail}>
                      <Text style={styles.detailLabel}>Diseases:</Text>
                      <Text 
                        style={[
                          styles.detailValue, 
                          { color: log.diseasesSigns ? colors.danger : colors.success }
                        ]}
                      >
                        {log.diseasesSigns ? 'Signs Present' : 'None Detected'}
                      </Text>
                    </View>
                    
                    {log.diseasesSigns && log.diseasesNotes && (
                      <Text style={styles.diseasesNotes}>{log.diseasesNotes}</Text>
                    )}
                  </View>
                  
                  {log.actions.length > 0 && (
                    <View style={styles.actionsContainer}>
                      <Text style={styles.actionsTitle}>Actions Taken:</Text>
                      {log.actions.map((action, index) => (
                        <Text key={index} style={styles.actionItem}>• {action}</Text>
                      ))}
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
      
      <AddInspectionModal 
        visible={isAddInspectionModalVisible}
        onClose={() => setIsAddInspectionModalVisible(false)}
        hiveId={id as string}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
  },
  backButton: {
    padding: spacing.sm,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  detailsTab: {
    padding: spacing.md,
  },
  hiveSummary: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  apiaryName: {
    ...typography.body,
    color: colors.textSecondary,
  },
  hiveTitle: {
    ...typography.h2,
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
  },
  statusText: {
    color: colors.white,
    fontWeight: '600',
  },
  lastUpdated: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  metricLabel: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  metricValue: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.xs,
  },
  analyticsTab: {
    padding: spacing.md,
  },
  chartTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  chart: {
    marginVertical: spacing.sm,
    borderRadius: 16,
  },
  inspectionsTab: {
    padding: spacing.md,
  },
  addInspectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
    justifyContent: 'center',
  },
  addInspectionButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  inspectionCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  inspectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inspectionDate: {
    ...typography.body,
    color: colors.text,
    marginLeft: spacing.xs,
  },
  queenContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  queenSpotted: {
    ...typography.caption,
    color: colors.success,
    fontWeight: '600',
  },
  queenNotSpotted: {
    ...typography.caption,
    color: colors.danger,
    fontWeight: '600',
  },
  inspectionNotes: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  inspectionDetails: {
    marginTop: spacing.sm,
  },
  inspectionDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  detailLabel: {
    ...typography.body,
    color: colors.textSecondary,
    width: '40%',
  },
  detailValue: {
    ...typography.body,
    fontWeight: '600',
  },
  diseasesNotes: {
    ...typography.caption,
    color: colors.danger,
    marginTop: spacing.xs,
    marginLeft: '40%',
  },
  actionsContainer: {
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  actionsTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  actionItem: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    ...typography.body,
    color: colors.danger,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  noDataContainer: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  notFoundText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  backToHivesButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  backToHivesButtonText: {
    ...typography.body,
    color: colors.white,
  }
});
