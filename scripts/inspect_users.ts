import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectUsers() {
    const { data, error } = await supabase.from('users').select('*').limit(1);
    if (error) {
        console.error(error);
    } else {
        console.log('Users columns:', Object.keys(data[0] || {}));
        console.log('Sample user:', data[0]);
    }
}

inspectUsers();
