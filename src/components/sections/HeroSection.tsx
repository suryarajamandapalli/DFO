import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { ShieldCheck, Activity, ArrowRight, ChevronLeft, ChevronRight, LayoutDashboard, Brain } from 'lucide-react';

const slides = [
  {
    tag: "Clinical OS v2.0 Platform",
    title: "Modern Ops for Clinical Triage.",
    highlight: "Clinical",
    desc: "Automated intake flows, real-time risk telemetry, and unified role-based command for modern parenthood care clinics.",
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2070&auto=format&fit=crop",
    stat: "100% SLA"
  },
  {
    tag: "Real-time Telemetry",
    title: "Intelligence Beyond Support.",
    highlight: "Beyond",
    desc: "Identify critical high-risk cases instantly with our hybrid sentiment-BERT engine designed for clinical precision.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
    stat: "1.2ms Latency"
  }
];

export function HeroSection({ onLogin, onSignup }: { onLogin: () => void, onSignup: () => void }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 overflow-hidden bg-white">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">

          <div className="flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={`slide-content-${current}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col"
              >
                <div className="inline-flex items-center gap-3 mb-8">
                  <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">{slides[current].tag}</span>
                </div>

                <h1 className="text-5xl sm:text-7xl xl:text-[90px] font-black text-slate-950 leading-[0.95] tracking-tighter mb-8">
                  {slides[current].title.split(' ').map((word, i) => (
                    <span key={i} className={word.replace(/[.,]/g, '').toLowerCase() === slides[current].highlight.toLowerCase() ? 'text-sky-500' : ''}>
                      {word}{' '}
                    </span>
                  ))}
                </h1>

                <p className="text-base md:text-lg text-slate-500 mb-12 max-w-lg font-medium leading-relaxed tracking-tight">
                  {slides[current].desc}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-4">
              <Button
                size="lg"
                onClick={onLogin}
                className="h-16 px-10 bg-[#0F172A] hover:bg-slate-800 text-white rounded-md text-[11px] font-black uppercase tracking-widest transition-all group flex items-center gap-3"
              >
                Launch Dashboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <button
                onClick={onSignup}
                className="h-16 px-8 border border-slate-200 hover:bg-slate-50 text-slate-900 rounded-md text-[11px] font-black uppercase tracking-widest transition-all"
              >
                Request Access
              </button>

              <div className="hidden sm:flex items-center gap-2">
                 <button onClick={prevSlide} className="h-14 w-14 rounded-md border border-slate-100 bg-white hover:bg-slate-50 shadow-sm transition-all flex items-center justify-center group">
                    <ChevronLeft className="w-5 h-5 text-slate-300 group-hover:text-slate-900" />
                 </button>
                 <button onClick={nextSlide} className="h-14 w-14 rounded-md border border-slate-100 bg-white hover:bg-slate-50 shadow-sm transition-all flex items-center justify-center group">
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-900" />
                 </button>
              </div>
            </div>

            <div className="mt-16 flex items-center gap-3">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${current === i ? 'w-12 bg-sky-500' : 'w-4 bg-slate-100 hover:bg-slate-200'}`}
                />
              ))}
            </div>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={`slide-image-${current}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-50 border border-slate-100 aspect-[1.1/1]">
                  <img
                    src={slides[current].image}
                    alt={slides[current].title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Floating SLA Badge */}
                  <div className="absolute top-8 right-8 bg-white/95 backdrop-blur-md px-5 py-3 rounded-lg shadow-xl border border-white/20">
                    <span className="text-[10px] font-black uppercase text-slate-950 tracking-[0.2em]">{slides[current].stat}</span>
                  </div>

                  {/* Protocol Delta Card */}
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[85%] bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-6">
                    <div className="w-12 h-12 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/20">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-slate-950 font-black text-xs tracking-tight uppercase mb-1">Protocol Delta</p>
                      <p className="text-slate-400 text-[9px] font-black tracking-widest uppercase">Synced: Cluster Hydra v2</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
