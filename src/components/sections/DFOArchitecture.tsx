import { motion } from 'framer-motion';
import { User, MessageSquareText, ShieldAlert, GitMerge, FileText, ClipboardList } from 'lucide-react';
import { cn } from '../../lib/utils';

const FlowNode = ({ icon: Icon, title, description, isActive = false, delay = 0 }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay }}
    className={cn(
      "flex flex-col items-center text-center p-4 rounded-xl relative z-10 w-40",
      isActive ? "bg-sky-50 shadow-md border border-sky-200" : "bg-white border border-slate-100"
    )}
  >
    <div className={cn(
      "w-12 h-12 rounded-full flex items-center justify-center mb-3",
      isActive ? "bg-sky-500 text-white" : "bg-slate-100 text-slate-500"
    )}>
      <Icon className="w-6 h-6" />
    </div>
    <h4 className="font-semibold text-slate-800 text-sm mb-1">{title}</h4>
    <p className="text-xs text-slate-500">{description}</p>
  </motion.div>
);

export function DFOArchitecture() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Complete Patient Journey</h2>
          <p className="text-slate-600 text-lg">
            A continuous loop from first interaction to follow-up, ensuring no patient gets left behind or ignored.
          </p>
        </div>

        <div className="w-full max-w-5xl mx-auto py-10 relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-[68px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-sky-200 via-sky-400 to-sky-200 z-0"></div>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4 relative z-10">
            <FlowNode 
              icon={User} 
              title="Patient" 
              description="Sends Query on WhatsApp/App" 
              delay={0.1}
            />
            <FlowNode 
              icon={MessageSquareText} 
              title="Front-line Chat" 
              description="Initial Triage & Support" 
              isActive={true}
              delay={0.2}
            />
            <FlowNode 
              icon={ShieldAlert} 
              title="Risk Engine" 
              description="Sentiment & Keyword analysis" 
              delay={0.3}
            />
            <FlowNode 
              icon={GitMerge} 
              title="Assignment" 
              description="Routed to correct role" 
              isActive={true}
              delay={0.4}
            />
            <FlowNode 
              icon={FileText} 
              title="Consultation" 
              description="Doctor takes over" 
              delay={0.5}
            />
            <FlowNode 
              icon={ClipboardList} 
              title="Follow-up" 
              description="Automated check-ins" 
              delay={0.6}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
