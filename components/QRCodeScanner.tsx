import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { X } from 'lucide-react-native';

type QRCodeScannerProps = {
  onScan: (data: string) => void;
  onClose: () => void;
  isDark?: boolean;
};

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ 
  onScan, 
  onClose,
  isDark = false
}) => {
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, isDark && styles.containerDark]}>
        <Text style={[styles.permissionText, isDark && styles.textDark]}>
          We need your permission to use the camera
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <CameraView
        style={styles.camera}
        facing={CameraType.back}
        onBarcodeScanned={({ data }) => onScan(data)}
        barcodeScannerSettings={{
          barCodeTypes: ['qr'],
        }}
      >
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.scanFrame} />
          
          <Text style={styles.instructions}>
            Position the QR code within the frame
          </Text>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerDark: {
    backgroundColor: '#000000',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
  },
  instructions: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  permissionText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 40,
  },
  textDark: {
    color: '#FFFFFF',
  },
  permissionButton: {
    backgroundColor: '#4361EE',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QRCodeScanner;