import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { signUp } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
    }
    
    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await signUp(email.trim(), password);
      router.replace('/(tabs)');
    } catch (error: any) {
      setErrors({
        submit: error.message || 'Registration failed. Please try again.'
      });
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
          <View style={styles.header}>
            <Text style={[styles.title, isDark && styles.textDark]}>Create Account</Text>
            <Text style={[styles.subtitle, isDark && styles.textLightDark]}>
              Join us to start managing your educational journey
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <View style={[
                styles.inputContainer,
                isDark && styles.inputContainerDark,
                errors.email && styles.inputError
              ]}>
                <Mail size={20} color={isDark ? '#BBBBBB' : '#666666'} />
                <TextInput
                  style={[styles.input, isDark && styles.inputDark]}
                  placeholder="Email"
                  placeholderTextColor={isDark ? '#BBBBBB' : '#999999'}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) {
                      setErrors(prev => ({ ...prev, email: '' }));
                    }
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
              {errors.email && (
                <View style={styles.errorContainer}>
                  <AlertTriangle size={16} color="#FF6B6B" />
                  <Text style={styles.errorText}>{errors.email}</Text>
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <View style={[
                styles.inputContainer,
                isDark && styles.inputContainerDark,
                errors.password && styles.inputError
              ]}>
                <Lock size={20} color={isDark ? '#BBBBBB' : '#666666'} />
                <TextInput
                  style={[styles.input, isDark && styles.inputDark]}
                  placeholder="Password"
                  placeholderTextColor={isDark ? '#BBBBBB' : '#999999'}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) {
                      setErrors(prev => ({ ...prev, password: '' }));
                    }
                  }}
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
              {errors.password && (
                <View style={styles.errorContainer}>
                  <AlertTriangle size={16} color="#FF6B6B" />
                  <Text style={styles.errorText}>{errors.password}</Text>
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <View style={[
                styles.inputContainer,
                isDark && styles.inputContainerDark,
                errors.confirmPassword && styles.inputError
              ]}>
                <Lock size={20} color={isDark ? '#BBBBBB' : '#666666'} />
                <TextInput
                  style={[styles.input, isDark && styles.inputDark]}
                  placeholder="Confirm Password"
                  placeholderTextColor={isDark ? '#BBBBBB' : '#999999'}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword) {
                      setErrors(prev => ({ ...prev, confirmPassword: '' }));
                    }
                  }}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? (
                    <EyeOff size={20} color={isDark ? '#BBBBBB' : '#666666'} />
                  ) : (
                    <Eye size={20} color={isDark ? '#BBBBBB' : '#666666'} />
                  )}
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <View style={styles.errorContainer}>
                  <AlertTriangle size={16} color="#FF6B6B" />
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                </View>
              )}
            </View>

            {errors.submit && (
              <View style={[styles.submitError, isDark && styles.submitErrorDark]}>
                <AlertTriangle size={20} color="#FF6B6B" />
                <Text style={styles.submitErrorText}>{errors.submit}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.button,
                isLoading && styles.buttonDisabled,
                isDark && styles.buttonDark
              ]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Creating Account...' : 'Register'}
              </Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={[styles.footerText, isDark && styles.textLightDark]}>
                Already have an account?{' '}
              </Text>
              <Link href="/auth/login" asChild>
                <TouchableOpacity>
                  <Text style={styles.linkText}>Login</Text>
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
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginVertical: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    maxWidth: '80%',
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  inputContainerDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
  },
  inputError: {
    borderColor: '#FF6B6B',
    borderWidth: 2,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333333',
  },
  inputDark: {
    color: '#FFFFFF',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  errorText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#FF6B6B',
  },
  submitError: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  submitErrorDark: {
    backgroundColor: '#3A2828',
  },
  submitErrorText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#FF6B6B',
    flex: 1,
  },
  button: {
    backgroundColor: '#4361EE',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#4361EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDark: {
    backgroundColor: '#4361EE',
  },
  buttonDisabled: {
    backgroundColor: '#A1B1F8',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#666666',
  },
  linkText: {
    fontSize: 14,
    color: '#4361EE',
    fontWeight: '600',
  },
  textDark: {
    color: '#FFFFFF',
  },
  textLightDark: {
    color: '#BBBBBB',
  },
});