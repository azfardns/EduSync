import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, useColorScheme, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Mail, Key, Calendar, BookOpen, GraduationCap, Users, Award } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const isInstructor = user?.role === 'instructor' || user?.role === 'admin';
  
  const handleLogout = async () => {
    await signOut();
    setShowLogoutModal(false);
  };
  
  const getRoleBadgeColors = () => {
    if (isInstructor) {
      return {
        bg: isDark ? '#344181' : '#E7ECFF',
        text: isDark ? '#4361EE' : '#4361EE',
      };
    }
    return {
      bg: isDark ? '#483C14' : '#FFF8E1',
      text: isDark ? '#FF9F1C' : '#FF9F1C',
    };
  };

  const badgeColors = getRoleBadgeColors();
  
  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Profile Card */}
        <View style={[styles.profileCard, isDark && styles.profileCardDark]}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }}
            style={styles.profileImage}
          />
          <Text style={[styles.name, isDark && styles.textDark]}>{String(user?.name || '')}</Text>
          <View style={[styles.roleBadge, { backgroundColor: badgeColors.bg }]}>
            <Text style={[styles.roleText, { color: badgeColors.text }]}>
              {String(user?.role || '').charAt(0).toUpperCase() + String(user?.role || '').slice(1)}
            </Text>
          </View>
        </View>

        {/* Account Details */}
        <View style={[styles.section, isDark && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Account Details</Text>
          
          <View style={styles.detailRow}>
            <Mail size={20} color={isDark ? '#BBBBBB' : '#666666'} />
            <View style={styles.detailContent}>
              <Text style={[styles.detailLabel, isDark && styles.textLightDark]}>Email</Text>
              <Text style={[styles.detailValue, isDark && styles.textDark]}>{String(user?.email || '')}</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <Key size={20} color={isDark ? '#BBBBBB' : '#666666'} />
            <View style={styles.detailContent}>
              <Text style={[styles.detailLabel, isDark && styles.textLightDark]}>User ID</Text>
              <Text style={[styles.detailValue, isDark && styles.textDark]}>{String(user?.id || '')}</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <Calendar size={20} color={isDark ? '#BBBBBB' : '#666666'} />
            <View style={styles.detailContent}>
              <Text style={[styles.detailLabel, isDark && styles.textLightDark]}>Account Created</Text>
              <Text style={[styles.detailValue, isDark && styles.textDark]}>
                {String(new Date().toLocaleDateString())}
              </Text>
            </View>
          </View>
        </View>

        {/* Role-specific Section */}
        {isInstructor ? (
          <View style={[styles.section, isDark && styles.sectionDark]}>
            <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Teaching Dashboard</Text>
            
            <View style={styles.statsGrid}>
              <View style={[styles.statCard, isDark && styles.statCardDark]}>
                <Users size={24} color={isDark ? '#4361EE' : '#4361EE'} />
                <Text style={[styles.statValue, isDark && styles.textDark]}>156</Text>
                <Text style={[styles.statLabel, isDark && styles.textLightDark]}>Total Students</Text>
              </View>
              
              <View style={[styles.statCard, isDark && styles.statCardDark]}>
                <BookOpen size={24} color={isDark ? '#FF9F1C' : '#FF9F1C'} />
                <Text style={[styles.statValue, isDark && styles.textDark]}>8</Text>
                <Text style={[styles.statLabel, isDark && styles.textLightDark]}>Active Courses</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={[styles.manageButton, isDark && styles.manageButtonDark]}
              activeOpacity={0.8}
            >
              <GraduationCap size={20} color={isDark ? '#FFFFFF' : '#FFFFFF'} />
              <Text style={styles.manageButtonText}>Manage Courses</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.section, isDark && styles.sectionDark]}>
            <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Academic Overview</Text>
            
            <View style={styles.statsGrid}>
              <View style={[styles.statCard, isDark && styles.statCardDark]}>
                <BookOpen size={24} color={isDark ? '#4361EE' : '#4361EE'} />
                <Text style={[styles.statValue, isDark && styles.textDark]}>6</Text>
                <Text style={[styles.statLabel, isDark && styles.textLightDark]}>Enrolled Courses</Text>
              </View>
              
              <View style={[styles.statCard, isDark && styles.statCardDark]}>
                <Award size={24} color={isDark ? '#FF9F1C' : '#FF9F1C'} />
                <Text style={[styles.statValue, isDark && styles.textDark]}>3.8</Text>
                <Text style={[styles.statLabel, isDark && styles.textLightDark]}>Current GPA</Text>
              </View>
            </View>
          </View>
        )}

        {/* Logout Button */}
        <TouchableOpacity 
          style={[styles.logoutButton, isDark && styles.logoutButtonDark]}
          onPress={() => setShowLogoutModal(true)}
        >
          <LogOut size={20} color="#FF6B6B" />
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDark && styles.modalContentDark]}>
            <Text style={[styles.modalTitle, isDark && styles.textDark]}>Log Out</Text>
            <Text style={[styles.modalMessage, isDark && styles.textLightDark]}>
              Are you sure you want to log out?
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, isDark && styles.cancelButtonDark]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={[styles.cancelButtonText, isDark && styles.textLightDark]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleLogout}
              >
                <Text style={styles.confirmButtonText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  profileCardDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
    shadowColor: '#FFFFFF',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
    shadowColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: '#333333',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  statCardDark: {
    backgroundColor: '#333333',
    borderColor: '#444444',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  manageButton: {
    backgroundColor: '#4361EE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  manageButtonDark: {
    backgroundColor: '#4361EE',
  },
  manageButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEBEB',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalContentDark: {
    backgroundColor: '#2A2A2A',
    shadowColor: '#FFFFFF',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  cancelButtonDark: {
    backgroundColor: '#333333',
    borderColor: '#444444',
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#FF6B6B',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  textDark: {
    color: '#FFFFFF',
  },
  textLightDark: {
    color: '#BBBBBB',
  },
});