import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://zceivjfxwjtsxxfrosqz.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjZWl2amZ4d2p0c3h4ZnJvc3F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNjkxNzcsImV4cCI6MjA4Nzg0NTE3N30.p-jkJQXvxWix_V4iKC_IC0pS3b0TNPOYhPjjx1Nvs_g';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
