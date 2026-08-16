import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let supabase = null;
let supabaseAdmin = null;

if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });

    if (supabaseServiceKey) {
      supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      });
    } else {
      supabaseAdmin = supabase;
    }
    console.log('[Supabase Client]: Initialized successfully.');
  } catch (err) {
    console.warn(`[Supabase Notice]: Client initialization failed (${err.message}). In-memory fallback available.`);
  }
} else {
  console.warn('[Supabase Notice]: SUPABASE_URL and SUPABASE_ANON_KEY not fully configured. Using resilient fallback.');
}

export { supabase, supabaseAdmin };
