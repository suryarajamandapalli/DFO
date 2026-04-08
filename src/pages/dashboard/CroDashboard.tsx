import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Thread, Message } from '../../lib/types';
import { ThreadList } from '../../components/dashboard/ThreadList';
import { ChatWindow } from '../../components/dashboard/ChatWindow';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { ThreadInfoPanel } from '../../components/dashboard/ThreadInfoPanel';
import { AssignmentModal } from '../../components/dashboard/AssignmentModal';
import { OperationsSummary } from '../../components/dashboard/OperationsSummary';
import { ShieldAlert, Activity, UserPlus, LayoutDashboard } from 'lucide-react';
import { sendClinicalMessage, simulateIncomingPatientMessage, assignThread } from '../../lib/dfoService';
import { Button } from '../../components/ui/Button';

export function CroDashboard() {
  const { user } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [filter, setFilter] = useState<'all' | 'green' | 'yellow' | 'red'>('all');
  const [showAssignModal, setShowAssignModal] = useState(false);

  const activeThread = threads.find(t => t.id === activeThreadId);

  // Fetch all threads for CRO
  useEffect(() => {
    if (!user) return;
    
    const fetchThreads = async () => {
      let query = supabase.from('threads').select('*').order('created_at', { ascending: false });
      if (filter !== 'all') {
        query = query.eq('risk_level', filter);
      }
      
      const { data } = await query;
      if (data) setThreads(data as Thread[]);
    };
    
    fetchThreads();

    // Listen to realtime thread updates globally
    const threadSub = supabase.channel('cro-threads')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'threads' }, payload => {
        const newThread = payload.new as Thread;
        if (filter !== 'all' && newThread.risk_level !== filter) return;
        
        setThreads(current => {
          const exists = current.find(t => t.id === newThread.id);
          if (exists) return current.map(t => t.id === newThread.id ? newThread : t);
          return [newThread, ...current];
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(threadSub); };
  }, [user, filter]);

  // Messages fetch
  useEffect(() => {
    if (!activeThreadId) {
      setMessages([]);
      return;
    }
    
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('thread_id', activeThreadId)
        .order('created_at', { ascending: true });
        
      if (data) setMessages(data as Message[]);
    };
    
    fetchMessages();

    const msgSub = supabase.channel(`messages-cro-${activeThreadId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `thread_id=eq.${activeThreadId}` }, payload => {
        setMessages(current => [...current, payload.new as Message]);
      })
      .subscribe();

    return () => { supabase.removeChannel(msgSub); };
  }, [activeThreadId]);

  const handleAssign = async (userId: string, role: 'nurse' | 'doctor') => {
    if (!activeThreadId) return;
    try {
      await assignThread(activeThreadId, role, userId);
      setShowAssignModal(false);
    } catch (err) {
      console.error("Assignment failed:", err);
    }
  };

  return (
    <DashboardLayout 
      activeMenu="inbox"
      rightPanel={activeThread ? <ThreadInfoPanel thread={activeThread} /> : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-30">
          <Activity className="w-12 h-12 mb-4" />
          <p className="text-[10px] font-black uppercase tracking-widest leading-loose">
            Select a thread to view <br /> Clinical Intelligence
          </p>
        </div>
      )}
    >
      <div className="flex-1 flex flex-col p-6 overflow-hidden bg-slate-50/30">
        <div className="mb-6">
          <h1 className="text-xl font-black text-slate-800 tracking-tight mb-1">DFO Operational Health</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Real-time Clinical Triage Monitoring</p>
        </div>
        
        <OperationsSummary />

        <div className="flex-1 flex overflow-hidden rounded-3xl border border-slate-100 shadow-sm bg-white min-h-0">
          {/* Thread List Column */}
          <div className="w-80 flex-shrink-0 flex flex-col border-r border-slate-50 bg-white">
             <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Filters</span>
                <div className="flex items-center gap-2">
                  {(['all', 'red', 'yellow'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`w-3 h-3 rounded-full border border-white shadow-sm ring-1 ring-offset-2 transition-all ${
                        filter === f ? 'scale-110 ring-slate-400' : 'ring-transparent opacity-30 hover:opacity-100'
                      } ${f === 'all' ? 'bg-slate-400' : f === 'red' ? 'bg-rose-500' : 'bg-amber-500'}`}
                      title={f.toUpperCase()}
                    />
                  ))}
                </div>
             </div>
             <div className="flex-1 overflow-hidden">
                <ThreadList 
                  threads={threads} 
                  selectedThreadId={activeThreadId}
                  onSelectThread={setActiveThreadId}
                />
             </div>
          </div>

          {/* Interaction Zone */}
          <div className="flex-1 flex flex-col min-w-0 bg-white">
             {activeThread ? (
               <>
                 <div className="px-6 py-3 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-sm z-10">
                   <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                         <ShieldAlert className="w-4 h-4 text-sky-500" />
                         <span>Ops Control Center</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-[10px] uppercase font-black text-rose-500 hover:bg-rose-50 px-3 h-9"
                        onClick={() => simulateIncomingPatientMessage("Urgent Alert", "Manual triage required for high-risk signal.", "red")}
                      >
                        Trigger Test Alert
                      </Button>
                      <Button 
                        onClick={() => setShowAssignModal(true)}
                        size="sm"
                        className="bg-slate-900 text-white hover:bg-slate-800 h-9 px-5 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/10 transition-all rounded-xl"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Assign Clinical Staff
                      </Button>
                   </div>
                 </div>
                 <div className="flex-1 min-h-0 bg-slate-50/10">
                    <ChatWindow 
                      thread={activeThread}
                      messages={messages}
                      currentRole="cro"
                      onSendMessage={(msg) => sendClinicalMessage(activeThread.id, 'CRO', user!.id, msg)}
                    />
                 </div>
               </>
             ) : (
               <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/20 text-slate-400 p-12">
                  <div className="w-24 h-24 bg-white rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-center mb-10">
                    <LayoutDashboard className="w-12 h-12 text-slate-100" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-3">Operational Overview</h2>
                  <p className="text-sm font-medium text-slate-500 max-w-sm text-center leading-relaxed">
                    Oversee global clinical patient flows and manage staff allocation in real-time. Select a record to begin supervision.
                  </p>
               </div>
             )}
          </div>
        </div>
      </div>

      {showAssignModal && activeThread && (
        <AssignmentModal 
          patientName={activeThread.patient_name}
          onClose={() => setShowAssignModal(false)}
          onAssign={handleAssign}
        />
      )}
    </DashboardLayout>
  );
}
