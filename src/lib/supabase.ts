/**
 * Supabase Client Configuration
 * 
 * SECURITY NOTES:
 * - Only the anon key is used here (safe for client-side)
 * - The service_role key is NEVER used client-side
 * - All database access is protected by Row Level Security (RLS)
 * - Storage access uses signed URLs for private buckets
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Client-side Supabase instance (uses anon key only)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

/**
 * Generate a signed URL for accessing private storage files.
 * In production, this would be done server-side via Edge Function.
 * For the demo, we use the anon key with RLS-protected storage.
 */
export async function getSignedUrl(bucket: string, path: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 3600); // 1 hour expiry
    
    if (error) {
      console.error('Signed URL error:', error.message);
      return null;
    }
    return data?.signedUrl || null;
  } catch {
    return null;
  }
}

/**
 * Upload a photo to the private roof-photos bucket.
 * SECURITY: Uses random UUID paths, never user-provided filenames.
 */
export async function uploadRoofPhoto(file: File, leadId: string): Promise<string | null> {
  try {
    // Generate random path - never trust user-provided filenames
    const { v4: uuidv4 } = await import('uuid');
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const randomPath = `${leadId}/${uuidv4()}.${ext}`;
    
    const { data, error } = await supabase.storage
      .from('roof-photos')
      .upload(randomPath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });
    
    if (error) {
      console.error('Upload error:', error.message);
      return null;
    }
    return data?.path || null;
  } catch {
    return null;
  }
}
