import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!
);

async function run() {
    try {
        const { data, error } = await supabase.from('dfo_consultations').select('*').limit(1);
        if (error) throw error;
        if (data && data.length > 0) {
            console.log('Columns:', Object.keys(data[0]));
        } else {
            console.log('No data in dfo_consultations');
        }
    } catch (err) {
        console.error('Error:', err);
    }
}

run();
