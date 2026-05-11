import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function findTables() {
    const commonNames = [
        'members', 'member_profiles', 'patients', 'patient_profiles',
        'leads', 'contacts',
        'appointments', 'consultations', 'visits',
        'notifications', 'alerts',
        'threads', 'messages', 'chat_messages',
        'vitals', 'health_metrics',
        'prescriptions', 'medications',
        'documents', 'clinical_records'
    ];

    console.log('Searching for tables...');
    for (const name of commonNames) {
        try {
            const { data, error, status } = await supabase.from(name).select('*').limit(1);
            if (status >= 200 && status < 300) {
                console.log(`FOUND: "${name}" (${Object.keys(data?.[0] || {}).join(', ')})`);
            }
        } catch (e) { }
    }
}

findTables();
