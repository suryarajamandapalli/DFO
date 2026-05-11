import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function findTables() {
    const commonNames = [
        'users', 'patients', 'threads', 'messages', 'appointments',
        'patient', 'thread', 'message', 'appointment',
        'leads', 'lead', 'consultations', 'consultation',
        'medical_records', 'vitals', 'alerts', 'notifications'
    ];

    console.log('Searching for tables...');
    for (const name of commonNames) {
        const { data, error, status } = await supabase.from(name).select('*').limit(1);
        if (status >= 200 && status < 400) {
            console.log(`- FOUND: "${name}"`);
        } else {
            // console.log(`- NOT FOUND: "${name}" (${status})`);
        }
    }
}

findTables();
