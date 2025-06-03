import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function Root() {
  const { session, isLoading } = useAuth();
  
  // Redirect to the appropriate screen based on authentication status
  if (!isLoading) {
    if (session) {
      return <Redirect href="/(tabs)" />;
    } else {
      return <Redirect href="/auth/login" />;
    }
  }
  
  // Return null while loading to prevent flash
  return null;
}