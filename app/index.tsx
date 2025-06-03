import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/hooks/useSupabase';

export default function Root() {
  const { session, isLoading } = useAuth();
  
  useEffect(() => {
    const checkEnrollment = async () => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('enrollment_completed')
          .eq('id', session.user.id)
          .single();

        if (profile && !profile.enrollment_completed) {
          return <Redirect href="/auth/enrollment" />;
        }
      }
    };

    checkEnrollment();
  }, [session]);
  
  if (!isLoading) {
    if (session) {
      return <Redirect href="/(tabs)" />;
    } else {
      return <Redirect href="/auth/login" />;
    }
  }
  
  return null;
}