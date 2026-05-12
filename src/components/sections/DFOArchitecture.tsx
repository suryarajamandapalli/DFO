import { motion } from 'motion/react';
import { User, MessageSquareText, ShieldAlert, GitMerge, FileText, ClipboardList, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const FlowNode = ({ icon: Icon, title, description, isActive = false, delay = 0 }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="flex flex-col items-center text-center p-8 bg-white border border-slate-100 rounded-2xl relative z-10 w-full group hover:shadow-xl transition-all"
  >
    <div className={cn(
      "w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 shadow-sm border border-slate-50",
      isActive ? "bg-sky-500 text-white shadow-sky-100" : "bg-slate-50 text-slate-400"
    )}>
      <Icon className="w-7 h-7" />
    </div>
    <h4 className="font-black text-slate-900 text-[10px] uppercase tracking-[0.2em] mb-4">{title}</h4>
    <p className="text-[11px] font-medium text-slate-400 leading-relaxed max-w-[140px] uppercase tracking-wide">{description}</p>
    
    {isActive && (
       <div className="absolute top-4 right-4 w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
    )}
  </motion.div>
);

export function DFOArchitecture() {
  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24 md:mb-32">
          <div className="max-w-2xl">
            <motion.p 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-500 mb-6"
             >
               Architecture & Flow
             </motion.p>
            <h2 className="text-4xl sm:text-5xl md:text-[64px] font-black text-slate-950 tracking-tighter leading-[1.05]">
              Closed-Loop <br className="hidden sm:block" /> <span className="text-slate-300">Clinical Governance.</span>
            </h2>
          </div>
          <p className="text-sm md:text-base text-slate-500 font-medium max-w-sm pb-1 leading-relaxed">
            Every interaction is logged, stratified by risk, and routed through a hardened medical triaging system.
          </p>
        </div>

        <div className="w-full max-w-7xl mx-auto relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-[110px] left-0 right-0 h-[2px] bg-sky-100 z-0">
             <motion.div 
               initial={{ width: 0 }}
               whileInView={{ width: '100%' }}
               transition={{ duration: 1.5, ease: "easeInOut" }}
               className="h-full bg-sky-500" 
             />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 relative z-10">
            <FlowNode 
              icon={User} 
              title="Patient" 
              description="Sends Query via WhatsApp/App" 
              delay={0.1}
            />
            <FlowNode 
              icon={MessageSquareText} 
              title="Intelligence" 
              description="Front-line Contextual Support" 
              isActive={true}
              delay={0.2}
            />
            <FlowNode 
              icon={ShieldAlert} 
              title="Risk Engine" 
              description="Sentiment & Clinical Analysis" 
              delay={0.3}
            />
            <FlowNode 
              icon={GitMerge} 
              title="Triage Hub" 
              description="Automated Role Routing" 
              isActive={true}
              delay={0.4}
            />
            <FlowNode 
              icon={FileText} 
              title="Governance" 
              description="Clinical Takeover & Notes" 
              delay={0.5}
            />
            <FlowNode 
              icon={ClipboardList} 
              title="Continuity" 
              description="Scheduled Follow-ups" 
              delay={0.6}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
