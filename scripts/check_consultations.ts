import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!
);

async function checkConsultations() {
    const { data, error } = await supabase
        .from('dfo_consultations')
        .select('*, dfo_patients(full_name)')
        .limit(1);

    if (error) {
        console.error('Error with join:', error.message);
        const { data: cols } = await supabase.from('dfo_consultations').select('*').limit(1);
        console.log('Columns:', Object.keys(cols?.[0] || {}));
    } else {
        console.log('Sample Data:', JSON.stringify(data, null, 2));
    }
}

checkConsultations();
