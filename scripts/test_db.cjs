const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://vhedpucowbjabgiklyea.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoZWRwdWNvd2JqYWJnaWtseWVhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk4OTQzNywiZXhwIjoyMDg3NTY1NDM3fQ._RBmUFpQgwSrTOnuB6A9w_W4jaD80Seaqd8ydV1tIk8');

async function test() {
    const { data, error } = await supabase.from('users').select('*').limit(1);
    console.log('Users:', !!data);
    const { data: p, error: pe } = await supabase.from('patients').select('*').limit(1);
    console.log('Patients:', !!p, pe?.message);
}
test();
