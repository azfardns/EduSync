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
      <ScrollView style={styles.content}>
        <View style={styles.statsContainer}>
          <DashboardStat
            icon={<TrendingUp size={24} color="#4361EE" />}
            label="Performance"
            value="85%"
            backgroundColor={isDark ? '#2A2A2A' : '#E7ECFF'}
            isDark={isDark}
          />
          <DashboardStat
            icon={<Users size={24} color="#4CAF50" />}
            label="Engagement"
            value="92%"
            backgroundColor={isDark ? '#2A2A2A' : '#E6F7ED'}
            isDark={isDark}
          />
          <DashboardStat
            icon={<Clock size={24} color="#FF6F61" />}
            label="Time Spent"
            value="4.2h"
            backgroundColor={isDark ? '#2A2A2A' : '#F8EDEB'}
            isDark={isDark}
          />
        </View>

        <View style={[styles.section, isDark && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Performance Trends</Text>
          <View style={[styles.chartPlaceholder, isDark && styles.chartPlaceholderDark]}>
            <BarChart2 size={48} color={isDark ? '#FFFFFF' : '#666666'} />
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
    backgroundColor: '#F9F9F9',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  section: {
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  sectionDark: {
    backgroundColor: '#121212',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 20,
  },
  chartPlaceholder: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    padding: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chartPlaceholderDark: {
    backgroundColor: '#2A2A2A',
    shadowColor: '#FFFFFF',
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  textDark: {
    color: '#FFFFFF',
  },
  textLightDark: {
    color: '#BBBBBB',
  },
});