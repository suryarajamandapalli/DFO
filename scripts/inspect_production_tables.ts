import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectTables() {
    const tables = [
        'conversation_threads',
        'conversation_messages',
        'dfo_patients',
        'dfo_doctors',
        'dfo_consultations',
        'dfo_appointments',
        'patient_vitals',
        'sakhi_clinic_leads'
    ];

    console.log('Inspecting Production Tables...');
    for (const table of tables) {
        const { data, error, status } = await supabase.from(table).select('*').limit(1);
        if (status >= 200 && status < 300) {
            console.log(`\nTABLE: "${table}"`);
            console.log(`COLUMNS: ${Object.keys(data?.[0] || {}).join(', ')}`);
        } else {
            console.log(`\nTABLE: "${table}" NOT ACCESSIBLE (Status: ${status})`);
            if (error) console.log(`ERROR: ${error.message}`);
        }
    }
}

inspectTables();
