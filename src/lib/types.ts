export type RiskLevel = 'green' | 'yellow' | 'red';
export type SenderType = 'patient' | 'nurse' | 'doctor' | 'ai';
export type ThreadStatus = 'open' | 'assigned' | 'closed';
export type SLAStatus = 'pending' | 'breached' | 'completed';

export interface Thread {
  id: string;
  patient_name: string;
  last_message: string;
  risk_level: RiskLevel;
  sentiment_score: number;
  assigned_to: string | null;
  assigned_role: 'cro' | 'nurse' | 'doctor' | null;
  status: ThreadStatus;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  thread_id: string;
  sender_type: SenderType;
  sender_id: string | null;
  message: string;
  created_at: string;
}

export interface SLATracking {
  id: string;
  thread_id: string;
  response_deadline: string;
  responded_at: string | null;
  status: SLAStatus;
  created_at: string;
}
