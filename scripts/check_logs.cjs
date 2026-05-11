const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
    console.log('Checking audit_logs table...');
    try {
        const { data, error } = await supabase.from('audit_logs').select('*').limit(5);
        if (error) {
            console.log('Table not found or error:', error.message);
            // Try common alternative names
            const altNames = ['system_logs', 'logs', 'activity_logs'];
            for (const name of altNames) {
                const { data: altData, error: altError } = await supabase.from(name).select('*').limit(5);
                if (!altError) {
                    console.log(`FOUND ALTERNATIVE: "${name}"`, altData[0] ? Object.keys(altData[0]) : 'Empty');
                    return;
                }
            }
        } else {
            console.log('AUDIT_LOGS:', data[0] ? Object.keys(data[0]) : 'Empty');
            console.log('SAMPLES:', data);
        }
    } catch (e) {
        console.log('ERROR:', e.message);
    }
}
check();
