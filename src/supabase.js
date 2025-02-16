import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fglcxbufinkvaovbbdwj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnbGN4YnVmaW5rdmFvdmJiZHdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxOTc2OTAsImV4cCI6MjA1NDc3MzY5MH0.Y4tlm76Zt8cXzZOZ_vR4GJtftnpD8EjnzQORdRiGphs';

export const supabase = createClient(supabaseUrl, supabaseKey)
