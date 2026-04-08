import { supabase } from './supabase';

/**
 * PRODUCTION CLINICAL SERVICE
 * Aligned strictly with the SQL Schema: 
 * - conversation_threads (status: green | yellow | red)
 * - conversation_messages (content)
 */

// Send a clinical message from Doctor/Nurse/CRO
export const sendClinicalMessage = async (threadId: string, role: string, userId: string, content: string) => {
  const { error } = await supabase
    .from('conversation_messages')
    .insert([
      {
        thread_id: threadId,
        sender_id: userId,
        sender_type: role,
        content: content,
        created_at: new Date().toISOString()
      }
    ]);
    
  if (error) throw error;
  
  // Update the thread's last updated timestamp
  await supabase
    .from('conversation_threads')
    .update({ 
      updated_at: new Date().toISOString()
    })
    .eq('id', threadId);

  // Mark analytics / SLA as met if first response
  await supabase
    .from('janmasethu_analytics')
    .update({ 
      sla_met: true,
      first_reply_at: new Date().toISOString()
    })
    .eq('thread_id', threadId)
    .is('first_reply_at', null);
};

// Takeover / Assignment logic
export const assignThread = async (threadId: string, role: 'Nurse' | 'Doctor', userId: string) => {
  const { error } = await supabase
    .from('conversation_threads')
    .update({ 
      assigned_user_id: userId,
      assigned_role: role,
      ownership: 'Human',
      updated_at: new Date().toISOString()
    })
    .eq('id', threadId);
    
  if (error) throw error;
  
  // Log takeover in message history
  await supabase
    .from('conversation_messages')
    .insert([
      {
        thread_id: threadId,
        sender_id: 'SYSTEM',
        sender_type: 'ai',
        content: `CLINICAL TAKEOVER: Thread assigned to ${role.toUpperCase()}. AI responses are now secondary to direct human clinical control.`
      }
    ]);
};

// Diagnostic: Simulate Patient Incoming (Aligned with Production Schema)
export const simulateIncomingPatientMessage = async (patientId: string, text: string, status: 'green' | 'yellow' | 'red' = 'green') => {
  // 1. Create a thread
  const { data: thread, error: threadErr } = await supabase
    .from('conversation_threads')
    .insert([
      {
        domain: 'janmasethu',
        user_id: patientId,
        channel: 'whatsapp',
        status: status,
        ownership: 'AI',
        metadata: { last_message: text }
      }
    ])
    .select()
    .single();

  if (threadErr || !thread) throw threadErr;

  // 2. Insert the message
  await supabase
    .from('conversation_messages')
    .insert([
      {
        thread_id: thread.id,
        sender_id: patientId,
        sender_type: 'patient',
        content: text
      }
    ]);

  return thread;
};
