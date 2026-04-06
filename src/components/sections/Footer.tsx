import { Stethoscope, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-300 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
              <div className="bg-sky-500/10 p-2 rounded-lg text-sky-400">
                <Stethoscope className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Janma<span className="text-sky-400">Sethu</span></span>
            </div>
            <p className="text-slate-500 text-sm max-w-sm">
              Clinical-grade intelligence and operational control for modern parenthood care platforms.
            </p>
          </div>
          
          <div className="flex gap-12 text-sm text-center md:text-left">
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-sky-400 transition-colors">Control Tower</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors">Risk Engine</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-sky-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} JanmaSethu Technologies. All rights reserved.</p>
          <div className="flex items-center gap-1">
            Build with <Heart className="w-3 h-3 text-rose-500" /> for Healthcare
          </div>
        </div>
      </div>
    </footer>
  );
}
