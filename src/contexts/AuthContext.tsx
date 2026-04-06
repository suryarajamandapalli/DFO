import { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Define DB Types based on user prompt
export type AppRole = 'cro' | 'nurse' | 'doctor';

export interface UserProfile {
  id: string;
  full_name: string | null;
  role: AppRole | null;
  phone: string | null;
  created_at: string;
}

export interface OnboardingData {
  id: string;
  user_id: string;
  role: AppRole;
  data: any;
  completed: boolean;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  onboardingState: OnboardingData | null;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [onboardingState, setOnboardingState] = useState<OnboardingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = async () => {
    if (!user) return;
    
    // Fetch profile
    const { data: profileData, error: profileErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profileErr && profileData) {
      setProfile(profileData);
      
      // If role exists, check onboarding
      if (profileData.role) {
        const { data: onbData, error: onbErr } = await supabase
          .from('onboarding_data')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (!onbErr && onbData) {
          setOnboardingState(onbData);
        } else {
          setOnboardingState(null);
        }
      } else {
        setOnboardingState(null);
      }
    } else {
      setProfile(null);
      setOnboardingState(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(session ? true : false); // Ensure we wait for profile fetch
      }
    }

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(true);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Whenever user changes, re-fetch profile
  useEffect(() => {
    let mounted = true;
    
    async function hydrate() {
      if (!user) {
        if (mounted) {
          setProfile(null);
          setOnboardingState(null);
          setIsLoading(false);
        }
        return;
      }
      
      await refreshProfile();
      if (mounted) setIsLoading(false);
    }
    
    hydrate();
    
    return () => { mounted = false; };
  }, [user]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, onboardingState, isLoading, refreshProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
