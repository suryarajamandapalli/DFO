import { Button } from '../../components/ui/button';
import { ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';
import { motion } from 'motion/react';

export function CTASection({ onSignup }: { onSignup: () => void }) {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-white">
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="bg-sky-50/50 border border-sky-100 rounded-[3rem] p-10 md:p-20 relative overflow-hidden text-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-sky-500/5 to-transparent pointer-events-none" />

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-500 mb-8"
            >
              Enterprise Ready
            </motion.p>

            <h2 className="text-4xl md:text-6xl lg:text-[72px] font-black text-slate-950 mb-10 tracking-tighter leading-[1.05]">
              Start Managing Patient <br /> <span className="text-sky-500">Journeys Smarter.</span>
            </h2>
            
            <p className="text-slate-500 text-base md:text-lg mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
              Equip your hospital with the operational intelligence and triage automation of the DFO Digital Front Office.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button
                size="lg"
                onClick={onSignup}
                className="w-full sm:w-auto h-16 px-12 bg-[#0F172A] hover:bg-slate-800 text-white shadow-xl rounded-md text-[11px] font-black uppercase tracking-widest transition-all group"
              >
                Request Platform Access
                <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="mt-16 pt-10 border-t border-sky-100/50 flex flex-wrap justify-center gap-10 md:gap-20">
              <div className="flex flex-col items-center">
                <span className="text-slate-950 font-black text-3xl leading-none">2.4k+</span>
                <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest mt-2">Live Clinicians</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-slate-950 font-black text-3xl leading-none">99.9%</span>
                <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest mt-2">Uptime Protocol</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-slate-950 font-black text-3xl leading-none">AES-256</span>
                <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest mt-2">Data Integrity</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
