'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { BlueSiteHeader } from '@/components/blue-header';
import { MainSiteFooter } from '@/components/main-footer';
import { motion } from 'framer-motion';
import { Loader2, Lock, Mail, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false);

  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('id, role, full_name')
          .eq('user_id', data.user.id)
          .eq('is_active', true)
          .single();

        if (adminError || !adminData) {
          await supabase.auth.signOut();
          setError('You do not have admin privileges. Contact the system administrator.');
          return;
        }

        setIsSignedIn(true);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsSignedIn(false);
    setEmail('');
    setPassword('');
  };

  if (isSignedIn) {
    return (
      <>
        <BlueSiteHeader />
        <div className="min-h-screen pt-[120px] md:pt-[200px] lg:pt-[240px] pb-16 px-6">
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');
          `}</style>
          <div className="fixed inset-0 bg-center bg-repeat -z-10" style={{ backgroundImage: "url('/images/pattern.webp')" }} />
          <motion.div className="fixed inset-0 -z-[5]" style={{ backgroundColor: '#EFBF04', opacity: 0.88 }} />

          <motion.div className="max-w-4xl mx-auto" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl text-[#053f52]" style={{ fontFamily: "'Crimson Pro', serif" }}>Admin Dashboard</h1>
                <button onClick={handleSignOut} className="text-red-600 hover:text-red-700 font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>Sign Out</button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-[#053f52] mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>Application Overview</h2>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center"><p className="text-3xl font-bold text-[#053f52]">0</p><p className="text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>Total</p></div>
                  <div className="bg-white rounded-lg p-4 text-center"><p className="text-3xl font-bold text-yellow-500">0</p><p className="text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>Pending</p></div>
                  <div className="bg-white rounded-lg p-4 text-center"><p className="text-3xl font-bold text-green-600">0</p><p className="text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>Accepted</p></div>
                  <div className="bg-white rounded-lg p-4 text-center"><p className="text-3xl font-bold text-red-600">0</p><p className="text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>Rejected</p></div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700" style={{ fontFamily: "'Inter', sans-serif" }}>This is the admin dashboard for viewing and managing student applications.</p>
                <p className="text-gray-600 mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>Visit <a href="/admin/applications" className="text-[#EFBF04] hover:underline">/admin/applications</a> to view all applications.</p>
              </div>
            </div>
          </motion.div>
        </div>
        <MainSiteFooter />
      </>
    );
  }

  return (
    <>
      <BlueSiteHeader />
      <div className="min-h-screen pt-[120px] md:pt-[200px] lg:pt-[240px] pb-16 px-6">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');
        `}</style>
        <div className="fixed inset-0 bg-center bg-repeat -z-10" style={{ backgroundImage: "url('/images/pattern.webp')" }} />
        <motion.div className="fixed inset-0 -z-[5]" style={{ backgroundColor: '#EFBF04', opacity: 0.88 }} />

        <motion.div className="max-w-md mx-auto" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} className="w-16 h-16 bg-[#053f52] rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </motion.div>
              <h1 className="text-3xl text-[#053f52] mb-2" style={{ fontFamily: "'Crimson Pro', serif" }}>Admin Login</h1>
              <p className="text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>Queensgate International School</p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSignIn} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#EFBF04]" style={{ fontFamily: "'Inter', sans-serif" }} placeholder="admin@queensgate.ac.ug" />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#EFBF04]" style={{ fontFamily: "'Inter', sans-serif" }} placeholder="Enter password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                </div>
              </div>

              <motion.button type="submit" disabled={isLoading} className={`w-full py-3 rounded-lg font-semibold text-lg text-white ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#053f52] hover:bg-[#042a38]'}`} style={{ fontFamily: "'Inter', sans-serif" }} whileHover={!isLoading ? { scale: 1.02 } : {}}>
                {isLoading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />Signing in...</span> : 'Sign In'}
              </motion.button>
            </form>

            <div className="mt-6 text-center"><p className="text-sm text-gray-500" style={{ fontFamily: "'Inter', sans-serif" }}>Restricted to authorized personnel</p></div>
          </div>
        </motion.div>
      </div>
      <MainSiteFooter />
    </>
  );
}

