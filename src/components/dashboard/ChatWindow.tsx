import { useState, useRef, useEffect } from 'react';
import type { Message, Thread } from '../../lib/types';
import { Button } from '../../components/ui/Button';
import { Send, UserCircle, Bot, Stethoscope, HeartPulse, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';

interface ChatWindowProps {
  thread: Thread;
  messages: Message[];
  currentRole: 'CRO' | 'Nurse' | 'Doctor';
  onSendMessage: (text: string) => Promise<void>;
  onTakeover?: () => Promise<void>;
}

export function ChatWindow({ thread, messages, currentRole, onSendMessage, onTakeover }: ChatWindowProps) {
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;

    setSending(true);
    await onSendMessage(inputText.trim());
    setInputText('');
    setSending(false);
  };

  const getSenderIcon = (type: string) => {
    switch(type) {
      case 'patient': return <UserCircle className="w-5 h-5 text-slate-400" />;
      case 'ai': return <Bot className="w-5 h-5 text-indigo-500" />;
      case 'Doctor': return <Stethoscope className="w-5 h-5 text-rose-500" />;
      case 'Nurse': return <HeartPulse className="w-5 h-5 text-amber-500" />;
      default: return <UserCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getSenderName = (type: string) => {
    switch(type) {
      case 'patient': return thread.metadata?.patient_name || thread.patient_name || 'Patient';
      case 'ai': return 'Sakhi AI Intelligence';
      case 'Doctor': return 'Attending Physician';
      case 'Nurse': return 'Triage Specialist';
      default: return 'System Admin';
    }
  };

  const patientName = thread.metadata?.patient_name || thread.patient_name || `Patient ${thread.id.slice(0, 4)}`;

  return (
    <div className="flex-1 flex flex-col bg-white h-full relative">
      {/* Thread Header - Simplified */}
      <div className="px-6 py-4 border-b border-slate-100 bg-white/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full shadow-sm ${thread.status === 'red' ? 'bg-rose-500 animate-pulse' : thread.status === 'yellow' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          <div>
            <h2 className="text-sm font-black text-slate-900 tracking-tight leading-none mb-1">{patientName}</h2>
            <div className="flex items-center gap-2">
               <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-slate-50 text-slate-500 uppercase tracking-widest border border-slate-100 leading-none">
                 ID: {thread.id.slice(0, 8)}
               </span>
               <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest leading-none border ${
                 thread.status === 'red' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                 thread.status === 'yellow' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                 'bg-emerald-50 text-emerald-600 border-emerald-100'
               }`}>
                 {thread.status} RISK
               </span>
            </div>
          </div>
        </div>

        {/* Human Takeover logic */}
        <div className="flex items-center gap-3">
          {!thread.assigned_user_id && currentRole === 'Doctor' && (
            <Button onClick={onTakeover} size="sm" className="bg-rose-600 hover:bg-rose-700 shadow-xl shadow-rose-600/20 gap-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
              <ShieldAlert className="w-3.5 h-3.5" />
              Emergency Takeover
            </Button>
          )}
          {!thread.assigned_user_id && currentRole === 'Nurse' && (
            <Button onClick={onTakeover} size="sm" className="bg-amber-600 hover:bg-amber-700 shadow-xl shadow-amber-600/20 gap-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white">
              <HeartPulse className="w-3.5 h-3.5" />
              Claim Thread
            </Button>
          )}
          {thread.assigned_user_id && (
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">Direct Clinical Control</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/30 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="text-center text-slate-400 text-sm mt-24 flex flex-col items-center gap-5">
             <div className="bg-white p-6 rounded-[2rem] shadow-premium border border-slate-100">
               <Bot className="w-10 h-10 text-slate-200" />
             </div>
             <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-300">No secure clinical messages yet</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = (msg.sender_type === 'CRO' && currentRole === 'CRO') || 
                       (msg.sender_type === 'Nurse' && currentRole === 'Nurse') ||
                       (msg.sender_type === 'Doctor' && currentRole === 'Doctor');
            const isPatient = msg.sender_type === 'patient';
            const isAI = msg.sender_type === 'ai';

            return (
              <div key={msg.id} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}>
                <div className={`mt-1 flex-shrink-0 bg-white rounded-2xl p-2 shadow-premium border border-slate-100 ${isMe ? 'hidden' : ''}`}>
                  {getSenderIcon(msg.sender_type)}
                </div>
                
                <div className={`flex flex-col max-w-[800px] min-w-[120px] ${isMe ? 'items-end ml-auto' : 'items-start mr-auto'}`}>
                  <div className={`text-[10px] text-slate-400 font-bold mb-1.5 flex items-center gap-3 uppercase tracking-widest ${isMe ? 'flex-row-reverse' : ''}`}>
                    <span className={isMe ? 'text-sky-600 font-black' : isAI ? 'text-indigo-600 font-black' : 'text-slate-600'}>
                      {isMe ? 'Clinical Control (You)' : getSenderName(msg.sender_type)}
                    </span>
                    <span className="opacity-60">{format(new Date(msg.created_at), 'HH:mm • MMM d')}</span>
                  </div>
                  
                  <div className={`px-6 py-4 rounded-3xl text-sm leading-relaxed shadow-premium ${
                    isMe 
                      ? 'bg-[#0f172a] text-white rounded-tr-sm' 
                      : isPatient
                        ? 'bg-white text-slate-800 border border-slate-200 rounded-tl-sm font-medium'
                        : 'bg-indigo-600 text-white border-none rounded-tl-sm shadow-indigo-600/10' // AI
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-slate-100 bg-white/80 backdrop-blur-md">
        <form onSubmit={handleSend} className="flex gap-4 relative">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder={(thread.assigned_user_id || currentRole === 'CRO') ? "Type a secure physician response..." : "Triage takeover required to respond..."}
            disabled={!thread.assigned_user_id && currentRole !== 'CRO'}
            className="flex-1 rounded-2xl border border-slate-200 bg-slate-50/50 px-6 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 disabled:bg-slate-50/50 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-300 placeholder:text-slate-400"
          />
          <Button 
            type="submit" 
            disabled={sending || !inputText.trim() || (!thread.assigned_user_id && currentRole !== 'CRO')}
            className={`px-8 rounded-2xl flex items-center gap-3 font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${inputText.trim() ? 'bg-[#0f172a] text-white hover:scale-[1.02] shadow-bespoke' : 'bg-slate-200 text-slate-400'}`}
          >
            {sending ? 'Encrypting...' : <><Send className="w-4 h-4" /> Send Message</>}
          </Button>
        </form>
      </div>
    </div>
  );
}
