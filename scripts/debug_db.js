const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
    console.log('Checking database...');
    try {
        const { data: p, error: pe } = await supabase.from('dfo_patients').select('*').limit(5);
        console.log('PATIENTS:', p || pe);
        const { data: a, error: ae } = await supabase.from('dfo_appointments').select('*').limit(5);
        console.log('APPOINTMENTS:', a || ae);
    } catch (e) {
        console.log('ERROR:', e.message);
    }
}
check();
