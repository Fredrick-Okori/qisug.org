'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BlueSiteHeader } from '@/components/blue-header';
import { MainSiteFooter } from '@/components/main-footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  createClient, 
  isSupabaseConfigured, 
  getSupabaseConfigStatus, 
  getSupabaseErrorMessage 
} from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import { 
  Mail, Lock, Eye, EyeOff, Loader2, 
  GraduationCap, AlertCircle, CheckCircle, 
  Settings, RefreshCw 
} from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  /**
   * Helper function to determine where a user belongs based on their role
   * This checks both Supabase auth metadata and the admin_users table
   */
  const getRedirectDestination = async (userId: string) => {
    try {
      // First, try to read role information from the authenticated user's metadata
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (!userError && user && user.id === userId) {
        // Role may be stored in either user_metadata or app_metadata depending on setup
        const role = (user.user_metadata && (user.user_metadata.role || user.user_metadata.roles))
          || (user.app_metadata && user.app_metadata.role)
          || null;

        // Some setups may store an "is_active" flag in metadata; default to true
        const isActive = (user.user_metadata && user.user_metadata.is_active) ?? true;

        console.log('Auth user metadata check:', { id: user.id, role, isActive });

        if (role && isActive) {
          // Treat any administrative role as admin portal access
          const adminRoles = ['admin', 'reviewer', 'viewer'];
          if (typeof role === 'string' && adminRoles.includes(role)) {
            return '/dashboard/admin';
          }
          // If role is an array, check for intersection
          if (Array.isArray(role) && role.some((r) => adminRoles.includes(r))) {
            return '/dashboard/admin';
          }
        }
      }

      // Fallback: legacy check against admin_users table (keeps backward compatibility)
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('role, is_active')
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle();

      console.log('Legacy admin_users check:', { adminUser, adminError });

      if (adminUser && !adminError && adminUser.is_active) {
        return '/dashboard/admin';
      }

      // User is not an admin, redirect to student portal (not apply-now)
      return '/dashboard';
    } catch (err) {
      console.error('Error checking admin status:', err);
      // Default to student portal on error
      return '/dashboard';
    }
  };

  // Check configuration and session on mount
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
    if (score <= 2) return 'bg-red-500';
    if (score <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
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
        // determine if this is an admin or an applicant
        const destination = await getRedirectDestination(data.user.id);
        
        setSuccess('Login successful! Redirecting...');
        
        // Reduced redirect delay for faster perceived performance
        setTimeout(() => {
          router.push(destination);
        }, 500);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfigured) return;
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

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
        setSuccess('Account created! You can now sign in.');
        setTimeout(() => setIsSignUp(false), 2000);
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
      <>
        <BlueSiteHeader />
        <div className="min-h-screen pt-[160px] pb-16 px-4 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <Settings className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Configuration Missing</h1>
            <p className="text-gray-600 mb-6">{configError}</p>
            <Button onClick={() => window.location.reload()} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" /> Retry
            </Button>
          </div>
        </div>
        <MainSiteFooter />
      </>
    );
  }

  return (
    <>
      <BlueSiteHeader />
      <div className="min-h-screen pt-[120px] md:pt-[200px] lg:pt-[160px] pb-16 px-4 md:px-6">
        <div className="fixed inset-0 bg-center bg-repeat -z-10" style={{ backgroundImage: "url('/images/pattern.webp')" }} />
        <div className="fixed inset-0 -z-[5]" style={{ backgroundColor: '#EFBF04', opacity: 0.88 }} />

        <motion.div 
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid lg:grid-cols-2 items-stretch overflow-hidden rounded-2xl shadow-2xl">
            
            {/* Left Panel */}
            <div className="hidden lg:flex flex-col justify-center bg-[#053f52] p-12 text-white">
              <GraduationCap className="w-16 h-16 text-[#EFBF04] mb-6" />
              <h1 className="text-4xl font-serif mb-4">
                {isSignUp ? 'Begin Your Journey' : 'Portal Login'}
              </h1>
              <p className="text-gray-300 mb-8">
                Access the Queensgate International School admissions system.
              </p>
              <div className="space-y-4">
                {['Real-time tracking', 'Document management', 'Direct communication'].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#EFBF04]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Panel */}
            <div className="bg-white p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-serif text-[#053f52]">
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </h2>
              </div>

              {(error || success) && (
                <div className={`mb-4 p-4 border-l-4 text-sm flex items-center gap-3 ${error ? 'bg-red-50 border-red-500 text-red-700' : 'bg-green-50 border-green-500 text-green-700'}`}>
                  {error ? <AlertCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                  {error || success}
                </div>
              )}

              <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
                {isSignUp && (
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Input 
                      type={showPassword ? 'text' : 'password'} 
                      value={password} 
                      onChange={handlePasswordChange} 
                      required 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {isSignUp && password && (
                    <div className="h-1.5 w-full bg-gray-100 rounded-full mt-2">
                      <div className={`h-full rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`} style={{ width: `${(getPasswordStrengthScore() / 5) * 100}%` }} />
                    </div>
                  )}
                </div>

                {isSignUp && (
                  <div className="space-y-2">
                    <Label>Confirm Password</Label>
                    <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                  </div>
                )}

                <Button type="submit" className="w-full bg-[#053f52] hover:bg-[#0a4d63]" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin" /> : (isSignUp ? 'Register' : 'Login')}
                </Button>
              </form>

              <div className="relative my-8">
                <Separator />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-gray-400 uppercase">Or continue with</span>
              </div>

              <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>

              <p className="mt-8 text-center text-sm text-gray-600">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button onClick={() => setIsSignUp(!isSignUp)} className="text-[#053f52] font-bold hover:underline">
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      <MainSiteFooter />
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#053f52]" /></div>}>
      <LoginContent />
    </Suspense>
  );
}