import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { Lock, Mail, User, UserCog, EyeOff, Eye } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [userType, setUserType] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  
  const isDark = colorScheme === 'dark';
  
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const handleRegister = async () => {
    if (!email || !password || !name) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    try {
      await signUp(email.trim(), password, name, userType);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
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
          <View style={styles.headerContainer}>
            <Text style={[styles.title, isDark && styles.textDark]}>Create Account</Text>
            <Text style={[styles.subtitle, isDark && styles.textLightDark]}>
              Join EduSync to manage your educational activities
            </Text>
          </View>
          
          <View style={styles.formContainer}>
            <View style={[styles.inputContainer, isDark && styles.inputContainerDark]}>
              <User size={20} color={isDark ? '#BBBBBB' : '#666666'} />
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                placeholder="Full Name"
                placeholderTextColor={isDark ? '#BBBBBB' : '#999999'}
                value={name}
                onChangeText={setName}
              />
            </View>
            
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
                autoComplete="email"
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
            
            <Text style={[styles.sectionTitle, isDark && styles.textDark]}>I am a:</Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  userType === 'student' && styles.roleButtonActive,
                  isDark && styles.roleButtonDark,
                  userType === 'student' && isDark && styles.roleButtonActiveDark
                ]}
                onPress={() => setUserType('student')}
              >
                <Text
                  style={[
                    styles.roleButtonText,
                    userType === 'student' && styles.roleButtonTextActive,
                    isDark && styles.textDark,
                    userType === 'student' && styles.roleButtonTextActive
                  ]}
                >
                  Student
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  userType === 'instructor' && styles.roleButtonActive,
                  isDark && styles.roleButtonDark,
                  userType === 'instructor' && isDark && styles.roleButtonActiveDark
                ]}
                onPress={() => setUserType('instructor')}
              >
                <Text
                  style={[
                    styles.roleButtonText,
                    userType === 'instructor' && styles.roleButtonTextActive,
                    isDark && styles.textDark,
                    userType === 'instructor' && styles.roleButtonTextActive
                  ]}
                >
                  Instructor
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  userType === 'admin' && styles.roleButtonActive,
                  isDark && styles.roleButtonDark,
                  userType === 'admin' && isDark && styles.roleButtonActiveDark
                ]}
                onPress={() => setUserType('admin')}
              >
                <Text
                  style={[
                    styles.roleButtonText,
                    userType === 'admin' && styles.roleButtonTextActive,
                    isDark && styles.textDark,
                    userType === 'admin' && styles.roleButtonTextActive
                  ]}
                >
                  Admin
                </Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Creating Account...' : 'Register'}
              </Text>
            </TouchableOpacity>
            
            <View style={styles.footerContainer}>
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
  headerContainer: {
    alignItems: 'center',
    marginVertical: 30,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  roleButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  roleButtonDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
  },
  roleButtonActive: {
    backgroundColor: '#E7ECFF',
    borderColor: '#4361EE',
  },
  roleButtonActiveDark: {
    backgroundColor: '#344181',
    borderColor: '#4361EE',
  },
  roleButtonText: {
    color: '#666666',
    fontWeight: '500',
  },
  roleButtonTextActive: {
    color: '#4361EE',
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#4361EE',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
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