import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { supabase } from '@/hooks/useSupabase';

export default function Root() {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrollmentCompleted, setIsEnrollmentCompleted] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        checkEnrollmentStatus(session.user.id);
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        checkEnrollmentStatus(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkEnrollmentStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('enrollment_completed')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setIsEnrollmentCompleted(data?.enrollment_completed ?? false);
    } catch (error) {
      console.error('Error checking enrollment status:', error);
    }
  };

  if (isLoading) {
    return null;
  }

  if (!session) {
    return <Redirect href="/auth/login" />;
  }

  if (!isEnrollmentCompleted) {
    return <Redirect href="/auth/enrollment" />;
  }

  return <Redirect href="/(tabs)" />;
}