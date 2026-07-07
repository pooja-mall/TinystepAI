import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Mail, Lock, User, Check, ShieldCheck, ArrowLeft } from 'lucide-react';

interface AuthViewProps {
  onLoginSuccess: (name: string, email: string, isGuest: boolean) => void;
  onBack: () => void;
}

export default function AuthView({ onLoginSuccess, onBack }: AuthViewProps) {
  const [name, setName] = useState('Pooja');
  const [email, setEmail] = useState('pooja072cs@gmail.com');
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate login loading delay
    setTimeout(() => {
      onLoginSuccess(isGuest ? 'Guest Parent' : name, isGuest ? 'guest@tinysteps.ai' : email, isGuest);
      setLoading(false);
    }, 1200);
  };

  const triggerGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      onLoginSuccess('Pooja', 'pooja072cs@gmail.com', false);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background decorations */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] aspect-square bg-secondary/5 rounded-full filter blur-3xl pointer-events-none" />

      {/* Back button */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-800 bg-white shadow-soft border border-slate-100 hover:bg-slate-50 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-violet-400 flex items-center justify-center text-white shadow-soft mx-auto mb-4">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">
          Welcome to TinySteps AI
        </h2>
        <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
          Sign in to generate personalized developmental plans, recipes, and stories for your little ones.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-100 shadow-premium"
        >
          {/* Form Option Tabs */}
          <div className="flex border-b border-slate-100 pb-4 mb-6">
            <button
              onClick={() => setIsGuest(false)}
              className={`flex-1 pb-3 text-center text-sm font-semibold border-b-2 transition-all ${!isGuest ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              Custom Parent Login
            </button>
            <button
              onClick={() => setIsGuest(true)}
              className={`flex-1 pb-3 text-center text-sm font-semibold border-b-2 transition-all ${isGuest ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              Continue as Guest
            </button>
          </div>

          {!isGuest ? (
            /* Custom Login Form */
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Parent Name
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Email Address
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
                    placeholder="parent@example.com"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-primary/95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-soft"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Create Free Account</span>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Guest Login Card */
            <div className="space-y-6">
              <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-100 flex items-start space-x-3 text-amber-800">
                <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-500" />
                <div className="text-xs leading-relaxed">
                  <strong className="block font-bold mb-0.5">Quick Access</strong>
                  As a Guest Parent, your profile information, favorites, and AI history will be safely saved locally on your device's browser cache.
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 border border-slate-200 text-sm font-bold rounded-xl text-slate-700 bg-slate-50 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all shadow-soft"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-slate-700 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Explore as Guest Parent</span>
                )}
              </button>
            </div>
          )}

          {/* Spacer / Divider */}
          <div className="my-6 flex items-center justify-between">
            <span className="w-1/5 border-b border-slate-100" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-300">or</span>
            <span className="w-1/5 border-b border-slate-100" />
          </div>

          {/* Google Login Button */}
          <button
            onClick={triggerGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-sm font-semibold text-slate-700 transition-all shadow-soft"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
