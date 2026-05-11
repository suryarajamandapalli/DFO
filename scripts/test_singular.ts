import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSingular() {
    const names = ['patient', 'thread', 'appointment', 'consultation', 'vitals'];
    for (const name of names) {
        const { status, error } = await supabase.from(name).select('*').limit(1);
        console.log(`${name}: ${status}`);
        if (error) console.log(error.message);
    }
}
testSingular();
