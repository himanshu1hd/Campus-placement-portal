/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mail, Lock, LogIn, Info, User, UserCircle, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';

import { Logo } from '../common/Logo';
import { UserRole } from '../../types';

export const Login: React.FC = () => {
  const { login, signup, loginWithGoogle } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const cleanEmail = email.trim();
    
    if (isLogin) {
      const result = await login(cleanEmail, password);
      if (!result.success) {
        setError(result.error || 'Invalid email or password.');
      }
    } else {
      if (!name || !cleanEmail || !password) {
        setError('Please fill in all required fields.');
        setLoading(false);
        return;
      }
      const result = await signup({
        name,
        email: cleanEmail,
        password,
        role,
        department: role === 'HR' ? department : (role === 'STUDENT' || role === 'COORDINATOR' ? department : undefined),
        isVerified: role === 'STUDENT' ? false : true // Only students need verification
      } as any);
      
      if (!result.success) {
        setError(result.error || 'Signup failed.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-slate-50">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl border border-slate-100 shadow-2xl">
        <Logo size="md" className="justify-center mb-8" />
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-slate-500">
            {isLogin ? 'Enter your credentials to continue.' : 'Join the placement ecosystem today.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 ml-1">Full Name</label>
                <div className="relative">
                  <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 ml-1">
                  Department/Branch
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                    placeholder="CSE"
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-red-500 text-[11px] font-medium bg-red-50 p-2.5 rounded-xl border border-red-100 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <Info size={14} className="shrink-0" /> {error}
              </div>

              {/* Action Buttons based on error context */}
              {error.includes('go to the Login tab') && (
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="mt-1 w-full py-2 bg-white border border-red-200 rounded-lg text-indigo-600 font-bold hover:bg-slate-50 transition-colors"
                >
                  Switch to Sign In
                </button>
              )}

              {error.includes('create a new account') && (
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="mt-1 w-full py-2 bg-white border border-red-200 rounded-lg text-indigo-600 font-bold hover:bg-slate-50 transition-colors"
                >
                  Switch to Create Account
                </button>
              )}

              {error.includes('popup was closed') && (
                <button
                  type="button"
                  onClick={async () => {
                    setLoading(true);
                    setError('');
                    const result = await loginWithGoogle();
                    if (!result.success) setError(result.error || 'Google login failed.');
                    setLoading(false);
                  }}
                  className="mt-1 w-full py-2 bg-amber-100 border border-amber-200 rounded-lg text-amber-700 font-bold hover:bg-amber-100 transition-colors"
                >
                  Retry Google Login
                </button>
              )}

              {(error.includes('Firebase Console') || error.includes('operation-not-allowed') || error.includes('authentication is not enabled')) && (
                <div className="mt-1 p-2.5 bg-white rounded-lg border border-red-200 text-slate-700 shadow-sm">
                  <p className="font-bold text-[10px] text-red-600 mb-1">Action Required:</p>
                  <p className="text-[9px] mb-2 leading-tight">Email/Password sign-in is disabled by default. Please enable it in your console:</p>
                  <ol className="list-decimal list-inside space-y-1 text-[9px]">
                    <li>Open <a href="https://console.firebase.google.com/project/ai-studio-applet-webapp-a9af2/authentication/providers" target="_blank" rel="noreferrer" className="text-indigo-600 underline font-bold">Firebase Console</a></li>
                    <li>Click <strong>Add new provider</strong></li>
                    <li>Select <strong>Email/Password</strong></li>
                    <li>Enable it and click <strong>Save</strong></li>
                  </ol>
                </div>
              )}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 mt-2"
          >
            {loading ? 'Processing...' : <>{isLogin ? <LogIn size={18} /> : <User size={18} />} {isLogin ? 'Sign In' : 'Create Account'}</>}
          </button>
        </form>

        <div className="mt-4">
          <button
            onClick={async () => {
              setLoading(true);
              setError('');
              const result = await loginWithGoogle();
              if (!result.success) {
                setError(result.error || 'Google login failed.');
              }
              setLoading(false);
            }}
            disabled={loading}
            className="w-full bg-white border border-slate-200 text-slate-700 py-3 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              <path fill="none" d="M0 0h24v24H0z" />
            </svg>
            Sign in with Google
          </button>
        </div>

        <div className="text-center mt-6">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>

      <p className="mt-8 text-slate-400 text-sm font-medium">#techforwardnow</p>
    </div>
  );
};
