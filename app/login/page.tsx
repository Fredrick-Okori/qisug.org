'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  createClient, 
  isSupabaseConfigured, 
  getSupabaseConfigStatus, 
  getSupabaseErrorMessage 
} from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, Eye, EyeOff, Loader2, 
  AlertCircle, CheckCircle2, 
  Settings, RefreshCw, User, ArrowRight, ShieldCheck 
} from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState({
    hasLength: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
  });

  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      if (window.location.hostname === 'localhost') return 'http://localhost:3000';
    }
    return 'https://qgis.ac.ug';
  };

  const redirectPath = searchParams.get('redirect') || '/admissions/apply-now';

  const getRedirectDestination = async (userId: string) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (!userError && user && user.id === userId) {
        const role = (user.user_metadata && (user.user_metadata.role || user.user_metadata.roles))
          || (user.app_metadata && user.app_metadata.role)
          || null;

        const isActive = (user.user_metadata && user.user_metadata.is_active) ?? true;

        if (role && isActive) {
          const adminRoles = ['admin', 'reviewer', 'viewer'];
          if (typeof role === 'string' && adminRoles.includes(role)) {
            return '/dashboard/admin';
          }
          if (Array.isArray(role) && role.some((r) => adminRoles.includes(r))) {
            return '/dashboard/admin';
          }
        }
      }

      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('role, is_active')
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle();

      if (adminUser && !adminError && adminUser.is_active) {
        return '/dashboard/admin';
      }

      return '/dashboard';
    } catch (err) {
      console.error('Error checking admin status:', err);
      return '/dashboard';
    }
  };

  useEffect(() => {
    setIsMounted(true);
    const configured = isSupabaseConfigured();
    setIsConfigured(configured);

    if (!configured) {
      const status = getSupabaseConfigStatus();
      setConfigError(status.error || 'Supabase is not properly configured');
      return;
    }

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const destination = await getRedirectDestination(session.user.id);
        router.push(destination);
      }
    };
    checkSession();
  }, [isMounted, isConfigured, router, redirectPath, supabase]);

  const checkPasswordStrength = (pwd: string) => {
    setPasswordStrength({
      hasLength: pwd.length >= 8,
      hasUpper: /[A-Z]/.test(pwd),
      hasLower: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    checkPasswordStrength(value);
  };

  const getPasswordStrengthScore = () => {
    const { hasLength, hasUpper, hasLower, hasNumber, hasSpecial } = passwordStrength;
    return [hasLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  };

  const getPasswordStrengthColor = () => {
    const score = getPasswordStrengthScore();
    if (score <= 2) return 'bg-rose-500';
    if (score <= 3) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfigured) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(getSupabaseErrorMessage(authError));
        setIsLoading(false);
        return;
      }

      if (data.user) {
        const destination = await getRedirectDestination(data.user.id);
        setSuccess('Authentication verified! Redirecting...');
        setTimeout(() => {
          router.push(destination);
        }, 400);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfigured) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${getBaseUrl()}/auth/callback`,
          data: { full_name: fullName },
        },
      });

      if (signUpError) {
        setError(getSupabaseErrorMessage(signUpError));
      } else {
        setSuccess('Account created successfully! You can now sign in.');
        setTimeout(() => setIsSignUp(false), 1800);
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isConfigured) return;
    setIsLoading(true);
    try {
      const redirectTo = `${getBaseUrl()}/auth/callback?redirect=${encodeURIComponent(redirectPath)}`;
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo },
      });
    } catch (err) {
      setError('Google sign-in failed.');
      setIsLoading(false);
    }
  };

  if (isMounted && !isConfigured && configError) {
    return (
      <div className="min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-serif text-[#032f36] font-bold mb-2">Configuration Missing</h1>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">{configError}</p>
          <Button onClick={() => window.location.reload()} className="w-full bg-[#032f36] hover:bg-[#064e5a] text-white py-6 rounded-xl">
            <RefreshCw className="mr-2 h-4 w-4" /> Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  // Animation variants for smooth form transition
  const formVariants = {
    hidden: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? 30 : -30,
      filter: 'blur(4px)',
    }),
    visible: {
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.35,
        ease: [0.25, 1, 0.5, 1] as const,
      },
    },
    exit: (direction: number) => ({
      opacity: 0,
      x: direction < 0 ? 30 : -30,
      filter: 'blur(4px)',
      transition: {
        duration: 0.25,
        ease: [0.25, 1, 0.5, 1] as const,
      },
    }),
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-16 px-4 sm:px-6">
      {/* Sleek Background Architecture */}
      <div 
        className="fixed inset-0 bg-center bg-repeat opacity-20 pointer-events-none -z-20" 
        style={{ backgroundImage: "url('/images/pattern.webp')" }} 
      />
      <div className="fixed inset-0 bg-gradient-to-br from-[#032f36] via-[#054450] to-[#021f24] -z-10" />
      
      {/* Subtle Ambient Glow Spheres */}
      <div className="fixed top-1/4 left-10 w-96 h-96 bg-[#20cece]/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 right-10 w-96 h-96 bg-[#EFBF04]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <motion.div 
        className="w-full max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="grid lg:grid-cols-12 rounded-3xl shadow-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl">
          
          {/* Left Hero Card Panel */}
          <div className="lg:col-span-5 hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#032f36]/90 to-[#022025]/95 p-10 text-white relative overflow-hidden border-r border-white/10">
            <div className="absolute -top-24 -left-24 w-60 h-60 bg-[#20cece]/20 rounded-full blur-3xl pointer-events-none" />
            
            <div>
              {/* Logo & Refined Compact Header */}
              <div className="flex items-center gap-4 mb-8">
                <Link href="/" className="shrink-0 transition-transform duration-300 hover:scale-105">
                  <Image
                    src="/images/logo_white.png"
                    alt="Queensgate International School Logo"
                    width={160}
                    height={160}
                    className="h-20 sm:h-24 w-auto object-contain drop-shadow-lg"
                    priority
                  />
                </Link>

                <AnimatePresence mode="wait">
                  <motion.h1 
                    key={isSignUp ? 'signup-title' : 'login-title'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-xl lg:text-2xl font-serif font-bold text-white leading-snug"
                  >
                    {isSignUp ? 'Empower Your Academic Future.' : 'Welcome Back to Excellence.'}
                  </motion.h1>
                </AnimatePresence>
              </div>
              
              <p className="text-white/70 text-sm font-light leading-relaxed mb-8">
                Seamless access to application management, enrollment status updates, and institutional records.
              </p>

              <div className="space-y-4 pt-4 border-t border-white/10">
                {[
                  'Real-time Application Status Tracking',
                  'Direct Document Upload & Verification',
                  'Secure Communication Channel'
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-[#20cece]/20 text-[#20cece] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-white/80 font-light">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
              <span>© {new Date().getFullYear()} QGIS Inc.</span>
              <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-[#20cece]" /> Encrypted Portal</span>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-12 flex flex-col justify-center relative overflow-hidden">
            
            {/* Segmented Tab Switcher with Animated Pill */}
            <div className="relative flex bg-gray-100 p-1.5 rounded-2xl mb-8 max-w-xs mx-auto w-full">
              <button
                type="button"
                onClick={() => { setIsSignUp(false); setError(null); setSuccess(null); }}
                className={`relative z-10 flex-1 py-3 text-xs sm:text-sm font-semibold rounded-xl transition-colors duration-200 ${
                  !isSignUp ? 'text-[#032f36]' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setIsSignUp(true); setError(null); setSuccess(null); }}
                className={`relative z-10 flex-1 py-3 text-xs sm:text-sm font-semibold rounded-xl transition-colors duration-200 ${
                  isSignUp ? 'text-[#032f36]' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Create Account
              </button>

              {/* Animated Background Slider */}
              <motion.div
                className="absolute top-1.5 bottom-1.5 bg-white rounded-xl shadow-md"
                initial={false}
                animate={{
                  left: isSignUp ? '50%' : '0.375rem',
                  width: 'calc(50% - 0.375rem)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            </div>

            {/* Dynamic Content Block with Smooth AnimatePresence */}
            <AnimatePresence mode="wait" custom={isSignUp ? 1 : -1}>
              <motion.div
                key={isSignUp ? 'sign-up-form' : 'sign-in-form'}
                custom={isSignUp ? 1 : -1}
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Form Title */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#032f36]">
                    {isSignUp ? 'Create your Account' : 'Sign In to Portal'}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1.5">
                    {isSignUp 
                      ? 'Enter your details below to create your applicant profile' 
                      : 'Access your student dashboard and admission progress'}
                  </p>
                </div>

                {/* Dynamic Alerts */}
                <AnimatePresence mode="wait">
                  {(error || success) && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      className={`mb-6 p-4 rounded-xl text-sm flex items-start gap-3 border overflow-hidden ${
                        error 
                          ? 'bg-rose-50 border-rose-200 text-rose-700' 
                          : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      }`}
                    >
                      {error ? (
                        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-rose-500" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-emerald-500" />
                      )}
                      <span className="leading-snug">{error || success}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Auth Form */}
                <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-5">
                  
                  {isSignUp && (
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <Label className="text-sm font-semibold text-gray-700">Full Name</Label>
                      <div className="relative">
                        <User className="w-5 h-5 text-gray-400 absolute left-4 top-4" />
                        <Input 
                          placeholder="e.g. Sarah Jenkins"
                          value={fullName} 
                          onChange={(e) => setFullName(e.target.value)} 
                          className="pl-12 h-13 bg-gray-50/50 border-gray-200 focus:border-[#032f36] focus:ring-[#032f36] rounded-xl text-base"
                          required 
                        />
                      </div>
                    </motion.div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Email Address</Label>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-4" />
                      <Input 
                        type="email" 
                        placeholder="name@example.com"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="pl-12 h-13 bg-gray-50/50 border-gray-200 focus:border-[#032f36] focus:ring-[#032f36] rounded-xl text-base"
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold text-gray-700">Password</Label>
                      {!isSignUp && (
                        <Link href="#" className="text-xs sm:text-sm text-[#032f36] font-medium hover:underline">
                          Forgot password?
                        </Link>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-4" />
                      <Input 
                        type={showPassword ? 'text' : 'password'} 
                        placeholder="••••••••"
                        value={password} 
                        onChange={handlePasswordChange} 
                        className="pl-12 pr-12 h-13 bg-gray-50/50 border-gray-200 focus:border-[#032f36] focus:ring-[#032f36] rounded-xl text-base"
                        required 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {isSignUp && password && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="pt-2"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Password Strength</span>
                          <span className="text-xs text-gray-500 font-bold">
                            {getPasswordStrengthScore() <= 2 ? 'Weak' : getPasswordStrengthScore() <= 3 ? 'Medium' : 'Strong'}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`} 
                            style={{ width: `${(getPasswordStrengthScore() / 5) * 100}%` }} 
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#032f36] hover:bg-[#074b57] text-white font-medium h-14 rounded-xl transition-all duration-300 shadow-lg shadow-[#032f36]/15 hover:shadow-xl mt-3" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin w-6 h-6 text-white" />
                    ) : (
                      <span className="flex items-center justify-center gap-2.5 text-base font-semibold">
                        {isSignUp ? 'Create Account' : 'Sign In'}
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    )}
                  </Button>
                </form>
              </motion.div>
            </AnimatePresence>

            {/* Divider */}
            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-gray-400 font-medium">Or continue with</span>
              </div>
            </div>

            {/* Social Login Button */}
            <Button 
              variant="outline" 
              className="w-full h-12 border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-medium text-sm transition-all" 
              onClick={handleGoogleSignIn} 
              disabled={isLoading}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google Account
            </Button>

          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#032f36] flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-[#EFBF04]" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}