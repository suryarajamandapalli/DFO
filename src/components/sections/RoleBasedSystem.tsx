import { Users, Stethoscope, ShieldAlert, CheckCircle2, BrainCircuit, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export function RoleBasedSystem() {
  const roles = [
    {
      title: "CRO",
      subtitle: "Control Role",
      icon: Users,
      color: "sky",
      bullets: [
        "View all threads (Green + Yellow + Red)",
        "See overall patient dashboard & metrics",
        "Assign threads to Nurses / Doctors",
        "Monitor risk levels & sentiment"
      ]
    },
    {
      title: "Nurse",
      subtitle: "Care Role",
      icon: Stethoscope,
      color: "amber",
      bullets: [
        "Handle Yellow threads (medium priority)",
        "View assigned patients only",
        "Chat & support patients",
        "Add notes / observations"
      ]
    },
    {
      title: "Doctor",
      subtitle: "Critical Role",
      icon: ShieldAlert,
      color: "rose",
      bullets: [
        "Handle Red threads (emergency cases)",
        "View critical patient details & history",
        "Chat/respond immediately",
        "Make medical decisions"
      ]
    }
  ];

  return (
    <section id="roles" className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="mb-20 md:mb-28">
           <motion.p
             initial={{ opacity: 0, y: 10 }}
             whileInView={{ opacity: 1, y: 0 }}
             className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-500 mb-6"
           >
             Collaborative Intelligence
           </motion.p>
           <h2 className="text-4xl sm:text-5xl md:text-[64px] font-black text-slate-950 tracking-tighter mb-8 leading-[1.05]">
             Specialized Clinical <br className="hidden sm:block" /> Roles. <span className="text-slate-300">Perfect Sync.</span>
           </h2>
           <p className="text-sm md:text-base text-slate-500 max-w-2xl font-medium leading-relaxed">
             A structured workflow ensuring the right clinical staff handles the right cases at the right time. Maximum SLA compliance, zero patient neglect.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roles.map((role, idx) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl border border-slate-100 p-10 group hover:shadow-2xl transition-all duration-500 flex flex-col"
            >
              <div className={cn(
                "w-16 h-16 rounded-xl flex items-center justify-center mb-10 transition-transform group-hover:scale-110",
                role.color === 'sky' ? 'bg-sky-50 text-sky-500' :
                role.color === 'amber' ? 'bg-amber-50 text-amber-500' :
                'bg-rose-50 text-rose-500'
              )}>
                <role.icon className="w-8 h-8" />
              </div>
              
              <div className="mb-10">
                <h3 className="text-4xl font-black text-slate-950 tracking-tight leading-none mb-3">{role.title}</h3>
                <p className={cn(
                  "text-[10px] font-black uppercase tracking-[0.2em]",
                  role.color === 'sky' ? 'text-sky-500' :
                  role.color === 'amber' ? 'text-amber-500' :
                  'text-rose-500'
                )}>{role.subtitle}</p>
              </div>

              <ul className="space-y-5 flex-1">
                {role.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="flex gap-4 text-sm font-medium text-slate-500 leading-snug">
                    <CheckCircle2 className="w-5 h-5 text-slate-100 shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Quick Summary Line */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 md:mt-32 bg-slate-50 rounded-3xl p-10 md:p-16 flex flex-col xl:flex-row items-center justify-between gap-12"
        >
           <div className="flex items-center gap-8 w-full xl:w-auto">
              <div className="w-16 h-16 bg-sky-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/20">
                 <Activity className="w-8 h-8" />
              </div>
              <div>
                 <p className="text-slate-950 font-black text-2xl md:text-3xl tracking-tight mb-2">One-Line Understanding</p>
                 <p className="text-sky-500 text-[10px] font-black uppercase tracking-[0.3em]">DFO Operational Hierarchy</p>
              </div>
           </div>
           
           <div className="flex flex-wrap gap-8 md:gap-12 w-full xl:w-auto">
              {[
                { label: "CRO → Manages All", color: "bg-sky-500" },
                { label: "Nurse → Medium cases", color: "bg-amber-500" },
                { label: "Doctor → Critical cases", color: "bg-rose-500" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className={cn("w-2 h-2 rounded-full", item.color)} />
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">{item.label}</span>
                </div>
              ))}
           </div>
        </motion.div>
      </div>
    </section>
  );
}
