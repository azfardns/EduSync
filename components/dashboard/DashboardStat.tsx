import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type DashboardStatProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  backgroundColor: string;
  isDark?: boolean;
}

const DashboardStat: React.FC<DashboardStatProps> = ({ 
  icon, 
  label, 
  value, 
  backgroundColor,
  isDark = false
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
      <Text style={[styles.value, isDark && styles.textDark]}>{value}</Text>
      <Text style={[styles.label, isDark && styles.textLightDark]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  containerDark: {
    borderColor: '#3A3A3A',
  },
  iconContainer: {
    marginBottom: 12,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
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

export default DashboardStat;