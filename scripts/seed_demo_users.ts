import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY!; // It's actually the service role key based on my analysis

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const demoUsers = [
  {
    email: 'CRO@gmail.com',
    password: 'CRO123',
    full_name: 'Chief Operational Officer',
    role: 'cro',
    domain: 'Global Operations'
  },
  {
    email: 'Nurse@gmail.com',
    password: 'Nurse123',
    full_name: 'Senior Triage Nurse',
    role: 'nurse',
    domain: 'Emergency Triage'
  },
  {
    email: 'Doctor@gmail.com',
    password: 'Doctor123',
    full_name: 'Attending Physician',
    role: 'doctor',
    domain: 'Specialist Care'
  }
];

async function seed() {
  console.log('Seeding demo users...');

  for (const user of demoUsers) {
    console.log(`Creating user: ${user.email}`);
    
    // 1. Create Auth User
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: { full_name: user.full_name }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log(`User ${user.email} already exists in Auth.`);
        // Try to get the user ID
        const { data: usersData } = await supabase.auth.admin.listUsers();
        const existingUser = usersData.users.find(u => u.email === user.email);
        if (existingUser) {
          // Sync profile anyway
          await syncProfile(existingUser.id, user);
        }
      } else {
        console.error(`Error creating auth user ${user.email}:`, authError.message);
      }
    } else if (authData.user) {
      console.log(`Auth user created: ${authData.user.id}`);
      await syncProfile(authData.user.id, user);
    }
  }

  console.log('Seeding complete.');
}

async function syncProfile(id: string, user: any) {
  console.log(`Syncing profile for: ${user.email}`);
  const { error: profileError } = await supabase
    .from('users')
    .upsert({
      id: id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      domain: user.domain,
      created_at: new Date().toISOString()
    });

  if (profileError) {
    console.error(`Error syncing profile for ${user.email}:`, profileError.message);
  } else {
    console.log(`Profile synced for ${user.email}`);
  }
}

seed();
