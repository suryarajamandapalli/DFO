import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { motion } from 'framer-motion';
import { Stethoscope, AlertCircle } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { user } = useAuth();

  // If already logged in, let ProtectedRoute sort out where they belong
  if (user) {
    return <Navigate to="/select-role" replace />;
  }

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
    
    if (authData.session) {
      navigate('/select-role');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-sky-600 mb-6">
          <div className="bg-sky-100 p-3 rounded-xl">
            <Stethoscope className="w-10 h-10" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">
          Sign in to JanmaSethu
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Digital Front Office for Clinical Professionals
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-start gap-3 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full appearance-none rounded-xl border border-slate-300 px-4 py-3 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm transition-colors"
                  placeholder="doctor@clinic.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full appearance-none rounded-xl border border-slate-300 px-4 py-3 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <Button 
                type="submit" 
                className="w-full bg-sky-500 hover:bg-sky-600 py-3 rounded-xl shadow-lg shadow-sky-500/20"
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Login to DFO'}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-slate-500">New to JanmaSethu?</span>
              </div>
            </div>

            <div className="mt-6">
              <a href="/signup" className="flex w-full justify-center rounded-xl border border-slate-300 bg-white py-3 px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
                Request Access / Sign up
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
