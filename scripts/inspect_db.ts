import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectSchema() {
    console.log('Inspecting Schema...');

    // Try to list tables by querying public.users first to confirm connection
    const { data: users, error: userError } = await supabase.from('users').select('*').limit(1);
    if (userError) {
        console.error('Error fetching users:', userError.message);
    } else {
        console.log('Successfully connected to users table.');
    }

    // Common tables to check
    const tables = ['dfo_consultations', 'dfo_appointments', 'dfo_patients'];

    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
            console.log(`Table "${table}" not found or error: ${error.message}`);
        } else {
            console.log(`Table "${table}" exists. Columns: ${Object.keys(data[0] || {}).join(', ')}`);
        }
    }
}

inspectSchema();
