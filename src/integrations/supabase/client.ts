
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://igqzsdtjvovfnctboqwc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlncXpzZHRqdm92Zm5jdGJvcXdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNDc0NjQsImV4cCI6MjA2MDgyMzQ2NH0.e3gJ7XR2wxeh44d3KfEphFcUMc1Lopd64NVNd3IbPwQ";

// Configure client with session persistence
export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    },
  }
);
