import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './useSupabase';

type User = {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'instructor' | 'admin';
};

type Session = {
  user: User;
  token: string;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (profileError) throw profileError;
          
          if (!profile) {
            // If no profile exists, sign out the user to clear the inconsistent state
            await signOut();
            throw new Error('User profile not found. Please sign in again or contact support.');
          }
          
          const userSession = {
            user: {
              id: session.user.id,
              email: session.user.email!,
              name: profile.name,
              role: profile.role,
            },
            token: session.access_token,
          };
          
          setSession(userSession);
          setUser(userSession.user);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        // Ensure user and session are cleared in case of error
        setSession(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, []);
  
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();
        
      if (profileError) throw profileError;
      
      if (!profile) {
        throw new Error('User profile not found. Please register or contact support.');
      }
      
      const userSession = {
        user: {
          id: data.user.id,
          email: data.user.email!,
          name: profile.name,
          role: profile.role,
        },
        token: data.session.access_token,
      };
      
      setSession(userSession);
      setUser(userSession.user);
    } catch (error: any) {
      throw new Error(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  const signUp = async (email: string, password: string, name: string, role: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              name,
              role,
              email,
            },
          ]);
          
        if (profileError) throw profileError;
        
        const userSession = {
          user: {
            id: data.user.id,
            email: data.user.email!,
            name,
            role: role as 'student' | 'instructor' | 'admin',
          },
          token: data.session?.access_token || '',
        };
        
        setSession(userSession);
        setUser(userSession.user);
      }
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setSession(null);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};