import { Network, Activity, Clock, Users, Shield, Calendar, Stethoscope, FileText, History, Bell, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  { icon: Network, title: "Control Tower", desc: "Intelligence and monitoring layer that analyzes conversations, detects risks, and enforces rules." },
  { icon: Activity, title: "Hybrid Risk Engine", desc: "Analyzes sentiment, keywords, and BERT models alongside patient history to assign clinical risk." },
  { icon: Clock, title: "SLA Monitoring", desc: "Tracks response times for critical cases and escalates automatically if untouched." },
  { icon: Users, title: "Thread Assignment", desc: "Smart routing of cases manually by CRO or automatically based on workload and role." },
  { icon: Shield, title: "Human Takeover", desc: "Locks the thread when a doctor takes control, instantly disabling AI responses to avoid conflicts." },
  { icon: Calendar, title: "Appointment Lifecycle", desc: "End-to-end handling of bookings, rescheduling, and automated missed-consultation detection." },
  { icon: Stethoscope, title: "Consultation Workflow", desc: "Dedicated interface for doctors to start, manage, and close consultations with clinical notes." },
  { icon: FileText, title: "Prescription Engine", desc: "Generates and stores structured prescriptions with medicine, dosage, and duration tracking." },
  { icon: History, title: "Deep Patient History", desc: "Unified timeline of all past interactions, consultations, prescriptions, and reports." },
  { icon: Bell, title: "Notification System", desc: "Automated alerts sent via WhatsApp & dashboard to keep patients and doctors synchronized." },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Real-time insights into system health, response times, and clinical load distribution." },
];

export function CoreFeatures() {
  return (
    <section id="features" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Core DFO Features</h2>
          <p className="text-slate-600 text-lg">
            A complete suite of clinical operations tools, designed from the ground up for modern parenthood care.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all hover:border-sky-100 group"
            >
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-500 flex items-center justify-center mb-4 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
