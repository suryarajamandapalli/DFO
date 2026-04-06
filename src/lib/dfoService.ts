import { supabase } from './supabase';

// Mock Patient Message Injector for testing since NLP backend is dead.
export const simulateIncomingPatientMessage = async (patientName: string, text: string, riskLevel: 'green' | 'yellow' | 'red') => {
  // 1. Create a dummy thread
  const { data: thread, error: threadErr } = await supabase
    .from('threads')
    .insert([
      {
        patient_name: patientName,
        last_message: text,
        risk_level: riskLevel,
        sentiment_score: riskLevel === 'red' ? -0.9 : riskLevel === 'yellow' ? -0.4 : 0.8,
        status: 'open'
      }
    ])
    .select()
    .single();

  if (threadErr || !thread) {
    console.error("Simulation error logging thread", threadErr);
    return;
  }

  // 2. Insert the message
  await supabase
    .from('messages')
    .insert([
      {
        thread_id: thread.id,
        sender_type: 'patient',
        message: text
      }
    ]);
    
  // 3. Insert Sakhi AI automated reply immediately
  await supabase
    .from('messages')
    .insert([
      {
        thread_id: thread.id,
        sender_type: 'ai',
        message: "Your message has been received by our clinical system. A triage specialist will review this shortly."
      }
    ]);
};

// Send a clinical message
export const sendClinicalMessage = async (threadId: string, role: string, userId: string, message: string) => {
  const { error } = await supabase
    .from('messages')
    .insert([
      {
        thread_id: threadId,
        sender_type: role,
        sender_id: userId,
        message: message
      }
    ]);
    
  if (error) throw error;
  
  // Update last_message on thread to keep list fresh
  await supabase
    .from('threads')
    .update({ 
      last_message: '(Clinical Staff) ' + message,
      updated_at: new Date().toISOString()
    })
    .eq('id', threadId);
};

// Takeover Thread
export const takeoverThread = async (threadId: string, role: 'nurse' | 'doctor', userId: string) => {
  const { error } = await supabase
    .from('threads')
    .update({ 
      assigned_to: userId,
      assigned_role: role,
      status: 'assigned',
      updated_at: new Date().toISOString()
    })
    .eq('id', threadId);
    
  if (error) throw error;
  
  // Inject automated takeover log
  await supabase
    .from('messages')
    .insert([
      {
        thread_id: threadId,
        sender_type: 'ai',
        message: `🚨 THREAD TAKEOVER: A human ${role} has claimed this thread. Automated AI routing is now disabled.`
      }
    ]);
};
