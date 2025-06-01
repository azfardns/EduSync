import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

type QRCodeDisplayProps = {
  value: string;
  size?: number;
  isDark?: boolean;
};

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ 
  value, 
  size = 200,
  isDark = false
}) => {
  if (Platform.OS === 'web') {
    // For web, we'll use a different QR code library
    return (
      <View style={[styles.container, isDark && styles.containerDark]}>
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`}
          alt="QR Code"
          style={{ width: size, height: size }}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <QRCode
        value={value}
        size={size}
        backgroundColor={isDark ? '#2A2A2A' : '#FFFFFF'}
        color={isDark ? '#FFFFFF' : '#000000'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerDark: {
    backgroundColor: '#2A2A2A',
  },
});

export default QRCodeDisplay;