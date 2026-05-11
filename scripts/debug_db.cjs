const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
    const { data: p } = await supabase.from('dfo_patients').select('*').limit(5);
    console.log('PATIENTS_LIST_START');
    console.log(JSON.stringify(p, null, 2));
    console.log('PATIENTS_LIST_END');
}
check();
