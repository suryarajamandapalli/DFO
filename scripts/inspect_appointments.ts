import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!
);

async function inspectAppointments() {
    const { data, error } = await supabase
        .from('dfo_appointments')
        .select('*, dfo_patients(full_name)')
        .limit(5);

    if (error) {
        console.error('Error:', error);
        // Fallback without join to see table columns
        const { data: cols, error: colError } = await supabase
            .from('dfo_appointments')
            .select('*')
            .limit(1);
        console.log('Columns:', Object.keys(cols?.[0] || {}));
    } else {
        console.log('Sample data with names:', JSON.stringify(data, null, 2));
    }
}

inspectAppointments();
