import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Button } from '../../components/ui/button';
import { motion } from 'motion/react';
import { Stethoscope, AlertCircle, ArrowLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function Login({ onSwitchToSignup, onBackToLanding }: { onSwitchToSignup: () => void, onBackToLanding: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { user } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    if (!authData.session) {
      setSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Panel: Brand Inspiration */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] relative overflow-hidden flex-col justify-between p-16">
        <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-sky-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
        
        <div className="relative z-10">
          <div 
            onClick={onBackToLanding}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Stethoscope className="w-6 h-6 text-slate-950" />
            </div>
            <span className="text-white font-black tracking-tighter text-2xl uppercase">DFO CLINIC</span>
          </div>
        </div>

        <div className="relative z-10">
          <h1 className="text-white text-6xl xl:text-7xl font-black tracking-tighter leading-[0.9] mb-8">
            Clinical <br /> Intelligence. <br /> <span className="text-sky-500">Redefined.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md font-medium leading-relaxed italic opacity-80">
            "The future of clinical operations is not just digital—it's intelligent, predictive, and unified."
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-widest">
           <div className="w-8 h-px bg-slate-800" />
           <span>Empowering Modern Clinics</span>
        </div>
      </div>

      {/* Right Panel: Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tighter mb-3">Welcome back</h2>
            <p className="text-slate-500 font-medium italic">Your clinical workspace is ready.</p>
          </div>

          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 bg-emerald-50 rounded-2xl text-center border border-emerald-100"
            >
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-lg font-black text-emerald-900 mb-2">Check your email</h3>
              <p className="text-emerald-700 text-sm">We've sent you a verification link to continue.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-600 text-sm font-medium">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Professional Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/5 transition-all outline-none font-medium text-slate-900"
                  placeholder="doctor@clinic.com"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/5 transition-all outline-none font-medium text-slate-900 pr-14"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-1">
                <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                <label htmlFor="remember" className="text-xs font-medium text-slate-500">Remember session</label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-slate-950 hover:bg-slate-800 text-white rounded-xl shadow-xl shadow-slate-950/10 font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98]"
              >
                {loading ? 'Validating...' : 'Sign In'}
              </Button>
            </form>
          )}

          <div className="mt-12 text-center border-t border-slate-50 pt-10">
            <p className="text-sm text-slate-500 font-medium">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToSignup}
                className="text-sky-500 font-black uppercase text-[11px] tracking-widest hover:text-sky-600 ml-2"
              >
                Sign up
              </button>
            </p>
            <button
              onClick={onBackToLanding}
              className="mt-8 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to landing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
