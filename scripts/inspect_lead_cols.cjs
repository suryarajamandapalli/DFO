const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
    const { data, error } = await supabase.from('sakhi_clinic_leads').select('*').limit(1);
    if (data && data[0]) {
        console.log('COLUMNS:', Object.keys(data[0]));
        console.log('SAMPLE:', data[0]);
    } else {
        console.log('Error or no data:', error);
    }
}
check();
