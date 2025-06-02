import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { Slot } from 'expo-router';
import 'react-native-url-polyfill/auto';

// Ensure XMLHttpRequest is available globally for network requests
if (typeof global.XMLHttpRequest === 'undefined') {
  global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
}

export default function App() {
  const [fontsLoaded, error] = useFonts({
    // You can add custom fonts here
  });

  useEffect(() => {
    // Prevent splash screen from auto-hiding until fonts are loaded
    const preventAutoHide = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn('Error preventing splash screen auto-hide:', e);
      }
    };
    preventAutoHide();
  }, []);

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  // Return null to keep splash screen visible while fonts load
  if (!fontsLoaded && !error) {
    return null;
  }

  return <Slot />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});