import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, shopName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  checkUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  checkUser: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    set({ user: session?.user ?? null, loading: false });
  },

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) {
      const { data: { session } } = await supabase.auth.getSession();
      set({ user: session?.user ?? null });
    }
    return { error };
  },

  signUp: async (email, password, shopName) => {
    // 1. Create Auth User
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { shop_name: shopName }
      }
    });

    if (authError) return { error: authError };

    // 2. Create Shop Record linked to this user
    if (authData.user) {
      const { error: shopError } = await supabase
        .from('shops')
        .insert({
          id: authData.user.id, // Use Auth ID as Shop ID for simplicity
          name: shopName,
          owner_name: shopName, // Default owner name
          email: email
        });
      
      if (shopError) return { error: shopError };
      
      set({ user: authData.user });
    }

    return { error: null };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  }
}));
