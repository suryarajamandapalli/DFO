import { Stethoscope, Globe, ShieldCheck, Heart, Zap, ShieldAlert } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-slate-50/50 rounded-full blur-[120px] -mr-96 -mt-96 pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 py-24 border-b border-slate-100">
          <div className="lg:col-span-4 max-w-sm">
            <div className="flex items-center gap-3 mb-10">
              <div className="bg-slate-950 p-2.5 rounded-xl text-white shadow-xl shadow-slate-950/20">
                <Stethoscope className="w-5 h-5 flex-shrink-0" />
              </div>
              <span className="text-2xl font-black text-slate-950 tracking-tighter">DFO<span className="text-sky-500">CLINIC.</span></span>
            </div>
            <p className="text-slate-500 text-[15px] font-medium leading-[1.8] mb-10">
              The clinical intelligence layer for modern parenthood care. Empowering healthcare providers with automated triaging, risk telemetry, and unified operations.
            </p>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <ShieldAlert className="w-3.5 h-3.5" /> HIPAA Compliant
               </div>
               <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <Zap className="w-3.5 h-3.5" /> ISO 27001
               </div>
            </div>
          </div>
          
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-12 lg:pl-12">
            <div>
              <h4 className="text-[11px] font-black text-slate-950 uppercase tracking-[0.2em] mb-10">Platform OS</h4>
              <ul className="space-y-5">
                {['Control Tower', 'Risk Engine', 'SLA Analytics', 'Clinical Triage'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-sm font-bold text-slate-400 hover:text-sky-600 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-black text-slate-950 uppercase tracking-[0.2em] mb-10">Resources</h4>
              <ul className="space-y-5">
                {['Compliance Docs', 'API Reference', 'Security Hub', 'System Status'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-sm font-bold text-slate-400 hover:text-sky-600 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-[11px] font-black text-slate-950 uppercase tracking-[0.2em] mb-10">Global Ops</h4>
              <div className="space-y-6">
                 <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-slate-900 group">
                        <Globe className="w-4 h-4 text-sky-500" />
                        <span className="text-sm font-black underline decoration-slate-200 underline-offset-4 group-hover:decoration-sky-500 transition-all">USA HQ</span>
                    </div>
                    <span className="text-[12px] font-medium text-slate-400 ml-6">Delaware, USA</span>
                 </div>
                 <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-slate-900 group">
                        <ShieldCheck className="w-4 h-4 text-sky-500" />
                        <span className="text-sm font-black underline decoration-slate-200 underline-offset-4 group-hover:decoration-sky-500 transition-all">Regional Hub</span>
                    </div>
                    <span className="text-[12px] font-medium text-slate-400 ml-6">Verified Clinical Node</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <p>© {new Date().getFullYear()} DFO CLINIC OS. PLATFORM V2.0.4</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-slate-950 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-950 transition-colors">Internal Governance</a>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-950 bg-slate-50 px-5 py-2.5 rounded-xl border border-slate-100 shadow-sm">
            Certified Clinical Intelligence <Heart className="w-3.5 h-3.5 text-rose-500 ml-1 fill-rose-500 animate-pulse" />
          </div>
        </div>
      </div>
    </footer>
  );
}
