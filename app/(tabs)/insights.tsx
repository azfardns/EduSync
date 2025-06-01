import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChartBar as BarChart2, TrendingUp, Users, Clock } from 'lucide-react-native';
import DashboardStat from '@/components/dashboard/DashboardStat';

export default function InsightsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isDark && styles.textDark]}>Analytics</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsContainer}>
          <DashboardStat
            icon={<TrendingUp size={24} color={isDark ? '#4361EE' : '#4361EE'} />}
            label="Performance"
            value="85%"
            backgroundColor={isDark ? '#2A2A2A' : '#E7ECFF'}
            isDark={isDark}
          />
          <DashboardStat
            icon={<Users size={24} color={isDark ? '#4CAF50' : '#4CAF50'} />}
            label="Engagement"
            value="92%"
            backgroundColor={isDark ? '#2A2A2A' : '#E6F7ED'}
            isDark={isDark}
          />
          <DashboardStat
            icon={<Clock size={24} color={isDark ? '#FF9F1C' : '#FF9F1C'} />}
            label="Time Spent"
            value="4.2h"
            backgroundColor={isDark ? '#2A2A2A' : '#FFF8E1'}
            isDark={isDark}
          />
        </View>

        <View style={[styles.section, isDark && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
            Performance Trends
          </Text>
          <View style={[
            styles.chartPlaceholder,
            { backgroundColor: isDark ? '#333333' : '#F8F9FA' }
          ]}>
            <BarChart2 size={48} color={isDark ? '#BBBBBB' : '#666666'} />
            <Text style={[styles.placeholderText, isDark && styles.textLightDark]}>
              Performance data visualization coming soon
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  textDark: {
    color: '#FFFFFF',
  },
  textLightDark: {
    color: '#CCCCCC',
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  sectionDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 20,
  },
  chartPlaceholder: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 20,
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});