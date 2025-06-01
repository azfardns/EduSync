import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { Lock, Mail, EyeOff, Eye } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  
  const isDark = colorScheme === 'dark';
  
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=800' }}
              style={styles.logo}
            />
            <Text style={[styles.title, isDark && styles.textDark]}>DiplomaTrack</Text>
            <Text style={[styles.subtitle, isDark && styles.textLightDark]}>
              Manage coursework, attendance, and assessments
            </Text>
          </View>
          
          <View style={styles.formContainer}>
            <View style={[styles.inputContainer, isDark && styles.inputContainerDark]}>
              <Mail size={20} color={isDark ? '#BBBBBB' : '#666666'} />
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                placeholder="Email"
                placeholderTextColor={isDark ? '#BBBBBB' : '#999999'}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={[styles.inputContainer, isDark && styles.inputContainerDark]}>
              <Lock size={20} color={isDark ? '#BBBBBB' : '#666666'} />
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                placeholder="Password"
                placeholderTextColor={isDark ? '#BBBBBB' : '#999999'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={20} color={isDark ? '#BBBBBB' : '#666666'} />
                ) : (
                  <Eye size={20} color={isDark ? '#BBBBBB' : '#666666'} />
                )}
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Text>
            </TouchableOpacity>
            
            <View style={styles.footerContainer}>
              <Text style={[styles.footerText, isDark && styles.textLightDark]}>
                Don't have an account?{' '}
              </Text>
              <Link href="/auth/register" asChild>
                <TouchableOpacity>
                  <Text style={styles.linkText}>Register</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  textDark: {
    color: '#FFFFFF',
  },
  textLightDark: {
    color: '#CCCCCC',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  inputContainerDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: '#333333',
  },
  inputDark: {
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: '#4361EE',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#4361EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#A1B1F8',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#666666',
    fontSize: 14,
  },
  linkText: {
    color: '#4361EE',
    fontSize: 14,
    fontWeight: 'bold',
  },
});