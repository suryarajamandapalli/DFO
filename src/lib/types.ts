export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Patient {
  id: string;
  auth_user_id?: string;
  full_name: string;
  phone_number: string;
  email?: string;
  age?: number;
  journey_stage: 'trying_to_conceive' | 'pregnant' | 'postpartum';
  pregnancy_stage?: number;
  medical_history?: Json;
  last_menstrual_period?: string;
  estimated_due_date?: string;
  engagement_preferences?: Json;
  created_at: string;
  updated_at: string;
  journey_start_date?: string;
  risk_score_trend?: Json;
  deleted_at?: string;
}

export interface Thread {
  id: string;
  domain: string;
  user_id: string; // Foreign key to dfo_patients.id or auth.users.id
  channel: string;
  status: 'green' | 'yellow' | 'red';
  ownership: 'AI' | 'Human';
  assigned_role?: 'Doctor' | 'Nurse';
  assigned_user_id?: string;
  is_locked: boolean;
  version: number;
  created_at: string;
  updated_at: string;
  metadata?: Json;
  // Computed fields for UI convenience
  patient_name?: string; 
}

export interface Message {
  id: string;
  thread_id: string;
  sender_id: string;
  sender_type: 'patient' | 'doctor' | 'nurse' | 'cro' | 'ai';
  content: string;
  created_at: string;
}

export interface RiskLog {
  id: string;
  patient_id: string;
  thread_id?: string;
  message_id?: string;
  risk_score: number;
  risk_level: 'low' | 'moderate' | 'high';
  reasoning: string;
  signals: Json;
  created_at: string;
}

export interface AnalyticsRecord {
  id: string;
  thread_id?: string;
  risk_level: 'green' | 'yellow' | 'red';
  escalation_queue?: string;
  response_time_ms?: number;
  model_name?: string;
  created_at: string;
  assigned_doctor_id?: string;
  assigned_at?: string;
  sla_met: boolean;
  sla_breached: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'doctor' | 'nurse' | 'cro' | 'patient' | 'admin';
  domain: string;
  is_active: boolean;
  created_at: string;
}
