import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DashboardStatProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  backgroundColor?: string;
  isDark?: boolean;
}

const DashboardStat: React.FC<DashboardStatProps> = ({
  icon,
  label,
  value,
  backgroundColor = '#FFFFFF',
  isDark = false,
}) => {
  return (
    <View style={[
      styles.container,
      { backgroundColor: isDark ? '#2A2A2A' : backgroundColor },
      isDark && styles.containerDark
    ]}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text style={[styles.value, isDark && styles.textDark]}>
        {value}
      </Text>
      <Text style={[styles.label, isDark && styles.textLightDark]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 120,
  },
  containerDark: {
    shadowColor: '#FFFFFF',
    shadowOpacity: 0.05,
  },
  iconContainer: {
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333333',
    marginBottom: 4,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
  },
  textDark: {
    color: '#FFFFFF',
  },
  textLightDark: {
    color: '#BBBBBB',
  },
});

export default DashboardStat;