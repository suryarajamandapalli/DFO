import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle, Siren } from 'lucide-react';

export function ThreadClassification() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Intelligent Threat Classification</h2>
          <p className="text-slate-600 text-lg">
            Every conversation is automatically analyzed and routed to the correct priority bucket using our proprietary Hybrid Risk Engine.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Green Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl p-6 bg-white border-t-4 border-emerald-400 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Green Thread</h3>
            <div className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded mb-4">General Queries</div>
            <ul className="space-y-3 text-slate-600 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5"></div>
                Routine updates and diet questions
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5"></div>
                Booking appointments
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5"></div>
                Handled by automated rules or CRO
              </li>
            </ul>
          </motion.div>

          {/* Yellow Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl p-6 bg-white border-t-4 border-amber-400 shadow-[0_10px_30px_-10px_rgba(251,191,36,0.2)]"
          >
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mb-6">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Yellow Thread</h3>
            <div className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded mb-4">Sensitive Cases</div>
            <ul className="space-y-3 text-slate-600 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5"></div>
                Mild pain, unusual symptoms
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5"></div>
                Requires clinical review
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5"></div>
                Escalated to Nurses for review
              </li>
            </ul>
          </motion.div>

          {/* Red Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-2xl p-6 bg-white border-t-4 border-rose-500 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
          >
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center opacity-50 z-0"></div>
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-6 relative z-10">
              <Siren className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2 relative z-10">Red Thread</h3>
            <div className="inline-block px-2 py-1 bg-rose-50 text-rose-700 text-xs font-semibold rounded mb-4 relative z-10 animate-pulse">Critical Emergency</div>
            <ul className="space-y-3 text-slate-600 text-sm relative z-10">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5"></div>
                Severe pain, bleeding, emergencies
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5"></div>
                Strict SLA timers start immediately
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5"></div>
                Sent directly to Doctors on duty
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
