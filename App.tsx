import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { SplashScreen } from 'expo-router';
import { Slot } from 'expo-router';
import 'react-native-url-polyfill/auto';

export default function App() {
  const [fontsLoaded, error] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'Roboto-Regular': Roboto_400Regular,
    'Roboto-Medium': Roboto_500Medium,
    'Roboto-Bold': Roboto_700Bold,
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