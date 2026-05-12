const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://vhedpucowbjabgiklyea.supabase.co/';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoZWRwdWNvd2JqYWJnaWtseWVhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk4OTQzNywiZXhwIjoyMDg3NTY1NDM3fQ._RBmUFpQgwSrTOnuB6A9w_W4jaD80Seaqd8ydV1tIk8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkJoin() {
    const { data, error } = await supabase
        .from('conversation_threads')
        .select(`
            *,
            patients:dfo_patients!user_id(full_name)
        `)
        .limit(5);
    
    if (error) {
        console.error('Join Error:', error);
    } else {
        console.log('Join Success:', JSON.stringify(data, null, 2));
    }
}

checkJoin();
