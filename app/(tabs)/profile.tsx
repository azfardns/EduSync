import { View, Text, StyleSheet, TouchableOpacity, Image, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Mail, Key, Calendar } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const handleLogout = async () => {
    await signOut();
    router.replace('/auth/login');
  };
  
  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isDark && styles.textDark]}>Profile</Text>
      </View>
      
      <View style={[styles.profileCard, isDark && styles.profileCardDark]}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }}
          style={styles.profileImage}
        />
        <Text style={[styles.name, isDark && styles.textDark]}>{user?.name}</Text>
        <Text style={[styles.role, isDark && styles.textLightDark]}>
          {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
        </Text>
      </View>
      
      <View style={[styles.infoCard, isDark && styles.infoCardDark]}>
        <View style={styles.infoRow}>
          <Mail size={20} color={isDark ? '#BBBBBB' : '#666666'} />
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, isDark && styles.textLightDark]}>Email</Text>
            <Text style={[styles.infoValue, isDark && styles.textDark]}>{user?.email}</Text>
          </View>
        </View>
        
        <View style={styles.infoRow}>
          <Key size={20} color={isDark ? '#BBBBBB' : '#666666'} />
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, isDark && styles.textLightDark]}>User ID</Text>
            <Text style={[styles.infoValue, isDark && styles.textDark]}>{user?.id}</Text>
          </View>
        </View>
        
        <View style={styles.infoRow}>
          <Calendar size={20} color={isDark ? '#BBBBBB' : '#666666'} />
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, isDark && styles.textLightDark]}>Account Created</Text>
            <Text style={[styles.infoValue, isDark && styles.textDark]}>
              {new Date().toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity 
        style={[styles.logoutButton, isDark && styles.logoutButtonDark]}
        onPress={handleLogout}
      >
        <LogOut size={20} color="#FF6B6B" />
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  textDark: {
    color: '#FFFFFF',
  },
  textLightDark: {
    color: '#CCCCCC',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  profileCardDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: '#666666',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  infoCardDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#333333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEBEB',
    marginHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
  },
  logoutButtonDark: {
    backgroundColor: '#3A2828',
  },
  logoutButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});