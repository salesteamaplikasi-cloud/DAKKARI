import { useState } from 'react';
import { Store, ArrowRight, Loader2, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (email === 'dakkari@gmail.com' && password === 'Dakkari#123') {
      onLogin();
    } else {
      setError('Kredensial tidak valid. Silakan coba lagi.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-center items-center p-6 relative overflow-hidden">
      
      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-200/40 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-200/40 blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="bg-white px-8 py-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
          
          <div className="flex flex-col items-center mb-10 text-center">
             <div className="flex items-center justify-center p-4 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-600/20 mb-5 relative group">
               <div className="absolute inset-0 bg-white/20 blur-md rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
               <Store className="w-8 h-8 relative z-10" />
             </div>
             <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Toko Dakkari</h1>
             <p className="text-slate-500 mt-2 text-sm font-medium">Purbalingga Central Dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 text-sm font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded-xl"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium"
                  placeholder="admin@dakkari.com"
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-semibold shadow-md shadow-indigo-600/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 mt-2 hover:shadow-lg hover:shadow-indigo-600/30"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In to Dashboard
                  <ArrowRight className="w-5 h-5 ml-1" />
                </>
              )}
            </button>
          </form>

        </div>
        
        <p className="text-center text-slate-400 text-sm mt-8 font-medium">
          &copy; {new Date().getFullYear()} Toko Dakkari Purbalingga.
        </p>
      </motion.div>
    </div>
  );
}
