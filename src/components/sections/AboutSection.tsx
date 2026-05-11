import { Card } from './LandingCard';
import { HeartPulse, Shield, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export function AboutSection() {
  const features = [
    {
      title: "Intelligent Triage",
      desc: "Continuous support powered by clinical intelligence that provides immediate, localized guidance and filters high-risk queries in real-time.",
      icon: MessageCircle,
      delay: 0.1
    },
    {
      title: "Verified Connections",
      desc: "More than just an AI. We bridge the critical gap between patients and medical professionals when urgency or empathy is required.",
      icon: HeartPulse,
      delay: 0.2
    },
    {
      title: "Language Agnostic",
      desc: "Care beyond barriers. Our platform interprets intent and emotion across diverse linguistic landscapes to ensure inclusivity.",
      icon: Shield,
      delay: 0.3
    }
  ];

  return (
    <section id="about" className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start mb-24 md:mb-32">
          <div className="w-full lg:w-3/5">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-500 mb-6"
            >
              Mission Statement
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl md:text-[64px] font-black text-slate-950 tracking-tighter leading-[1.05]"
            >
              The Intelligence Layer for <br /> <span className="text-slate-300">Clinical Operations.</span>
            </motion.h2>
          </div>
          <div className="w-full lg:w-2/5 lg:pt-20">
            <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed">
              JanmaSethu is not just a portal—it's a clinical OS. We elevate healthcare providers with the tools to manage 10x the patient volume without sacrificing care quality.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: f.delay }}
              className="group p-10 bg-white border border-slate-100 rounded-2xl hover:shadow-2xl transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-xl bg-sky-50 flex items-center justify-center text-sky-500 mb-10 transition-transform group-hover:scale-110">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-slate-950 mb-6 tracking-tight">{f.title}</h3>
              <p className="text-sm text-slate-500 mb-10 font-medium leading-relaxed">
                {f.desc}
              </p>
              <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-sky-500 group-hover:gap-5 transition-all">
                Learn Methodology <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
