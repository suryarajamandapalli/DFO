import React, { useState } from "react";
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import type { AppRole } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, HeartPulse, Stethoscope, ArrowRight, Loader2, Building2, ChevronLeft } from 'lucide-react';
import { Button } from "../../components/ui/button";

export function SelectRole({ onRoleAssigned }: { onRoleAssigned: () => void }) {
  const { user, profile, refreshProfile } = useAuth();
  const [step, setStep] = useState<'role' | 'organization'>('role');
  const [selectedRole, setSelectedRole] = useState<AppRole | null>(null);
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(false);

  const roles = [
    {
      id: 'cro' as AppRole,
      title: 'Clinical Research Officer (CRO)',
      icon: ShieldAlert,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      hoverBorder: 'hover:border-indigo-400',
      description: 'Full control. Handles clinic configuration, monitors thread assignments, and manages overall operational workflows.'
    },
    {
      id: 'nurse' as AppRole,
      title: 'Triage Nurse',
      icon: HeartPulse,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      hoverBorder: 'hover:border-amber-400',
      description: 'First line of response. Handles initial triage (Yellow threads) and routine maternity queries.'
    },
    {
      id: 'doctor' as AppRole,
      title: 'Attending Doctor',
      icon: Stethoscope,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      hoverBorder: 'hover:border-rose-400',
      description: 'Specialist care. Handles escalated emergencies (Red threads) and highly complex clinical consultations.'
    }
  ];

  const handleRoleSelect = (role: AppRole) => {
    setSelectedRole(role);
    setStep('organization');
  };

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedRole) return;
    
    setLoading(true);

    try {
      // 1. Update Profile with Role and Organization/Department (using 'domain' column)
      const { error: upsertError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          role: selectedRole,
          domain: orgName, // Using domain field to avoid "missing organization column" error
          email: user.email,
          full_name: profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Clinical Member'
        }, { onConflict: 'email' });

      if (upsertError) throw upsertError;

      // 2. Log Welcome Notification
      await supabase.from('dfo_notification_logs').insert([
        {
          patient_id: user.id,
          category: 'onboarding_complete',
          payload: {
            title: 'Welcome to DFO Clinic',
            message: `Your professional profile as a ${selectedRole.toUpperCase()} at ${orgName || 'your clinical center'} is now active.`
          },
          status: 'PENDING'
        }
      ]);

      // 3. Refresh and Complete
      await refreshProfile();
      onRoleAssigned();
    } catch (err: any) {
      console.error("Critical failure during onboarding:", err.message);
      alert(`Onboarding failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getQuestionConfig = () => {
    switch (selectedRole) {
      case 'cro':
        return {
          label: 'Organization / Hospital Name',
          placeholder: 'e.g. DFO Clinical Research Center',
          title: 'Organization Identity',
          sub: 'Help us identify your clinical governance node.'
        };
      case 'nurse':
        return {
          label: 'Assigned Department',
          placeholder: 'e.g. Cardiology, Emergency, ICU',
          title: 'Clinical Department',
          sub: 'Which wing of the clinic are you managing?'
        };
      case 'doctor':
        return {
          label: 'Specialization / Department',
          placeholder: 'e.g. Obstetrics, Internal Medicine',
          title: 'Specialist Identity',
          sub: 'What is your primary clinical focus?'
        };
      default:
        return {
          label: 'Organization Name',
          placeholder: 'e.g. DFO Clinic',
          title: 'Clinical Node',
          sub: 'Identify your workspace.'
        };
    }
  };

  const config = getQuestionConfig();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        {step === 'role' ? (
          <motion.div 
            key="step-role"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="max-w-4xl w-full"
          >
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">
                Select Your Designation
              </h1>
              <p className="text-slate-500 text-lg font-medium">
                Choose your clinical role to customize your workspace.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {roles.map((role, idx) => (
                <motion.div
                  key={role.id}
                  whileHover={{ y: -5 }}
                  onClick={() => handleRoleSelect(role.id)}
                  className={`relative bg-white rounded-3xl border-2 ${role.borderColor} p-8 cursor-pointer shadow-sm hover:shadow-xl transition-all group overflow-hidden`}
                >
                  <div className={`${role.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6`}>
                    <role.icon className={`w-8 h-8 ${role.color}`} />
                  </div>

                  <h3 className="text-xl font-black text-slate-900 mb-3">{role.title}</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                    {role.description}
                  </p>

                  <div className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${role.color}`}>
                    Select Role <ArrowRight className="w-3 h-3" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="step-org"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-xl w-full bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100"
          >
            <button 
              onClick={() => setStep('role')}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 mb-10 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Go back
            </button>

            <div className="mb-10">
              <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center mb-6 text-sky-500">
                 {selectedRole === 'cro' ? <Building2 className="w-8 h-8" /> : selectedRole === 'nurse' ? <HeartPulse className="w-8 h-8" /> : <Stethoscope className="w-8 h-8" />}
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-3">{config.title}</h2>
              <p className="text-slate-500 font-medium italic">{config.sub}</p>
            </div>

            <form onSubmit={handleComplete} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{config.label}</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/5 transition-all outline-none font-bold text-slate-900"
                  placeholder={config.placeholder}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-16 bg-slate-950 hover:bg-slate-800 text-white rounded-2xl shadow-xl font-black text-sm uppercase tracking-widest transition-all"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Initializing Workspace...
                  </div>
                ) : 'Complete Onboarding'}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

