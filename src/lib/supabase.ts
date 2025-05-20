import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pmorcgjgvvktemyczllb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtb3JjZ2pndnZrdGVteWN6bGxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2OTQ0NzMsImV4cCI6MjA2MzI3MDQ3M30.wGHquNRFaHZ9agQ-hwU6cEWYyn7XFt98jV_5L35VJbE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 