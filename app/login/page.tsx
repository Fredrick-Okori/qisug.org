'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BlueSiteHeader } from '@/components/blue-header';
import { MainSiteFooter } from '@/components/main-footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import { 
  Mail, Lock, Eye, EyeOff, Loader2, 
  GraduationCap, AlertCircle, CheckCircle 
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

  // Get redirect URL from query params
  const redirectUrl = searchParams.get('redirect') || '/admissions/apply-now';

  useEffect(() => {
    setIsMounted(true);
    // Check if already signed in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push(redirectUrl);
      }
    };
    checkSession();
  }, [supabase, router, redirectUrl]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          router.push(redirectUrl);
        }, 1500);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess('Account created successfully! Please check your email to verify your account.');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess('Password reset email sent! Check your inbox.');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Force localhost for development
          redirectTo: `http://localhost:3000/auth/callback?redirect=${encodeURIComponent(redirectUrl)}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        // Provide more helpful error messages for common OAuth issues
        const errorMessage = error.message.toLowerCase();
        
        if (errorMessage.includes('provider is not enabled') || 
            errorMessage.includes('provider not set') ||
            errorMessage.includes('not enabled')) {
          setError('Google sign-in is not configured. Please contact the administrator or use email/password to sign in.');
        } else if (errorMessage.includes('redirect_uri') || errorMessage.includes('redirect url')) {
          setError('OAuth redirect URL is not configured correctly. Please contact the administrator.');
        } else {
          setError(error.message);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <BlueSiteHeader />
      
      <div className="min-h-screen pt-[120px] md:pt-[200px] lg:pt-[160px] pb-16 px-4 md:px-6">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');
        `}</style>
        <div 
          className="fixed inset-0 bg-center bg-repeat -z-10" 
          style={{ backgroundImage: "url('/images/pattern.webp')" }} 
        />
        <motion.div 
          className="fixed inset-0 -z-[5]" 
          style={{ backgroundColor: '#EFBF04', opacity: 0.88 }} 
        />

        <motion.div 
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid lg:grid-cols-2 items-stretch">
            
            {/* Left Side - Welcome Text (Hidden on small and medium devices) */}
            <motion.div 
              className="hidden lg:flex flex-col justify-center"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div 
                className="bg-[#053f52] rounded-l-2xl p-8 md:p-12 text-white shadow-2xl"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div 
                  className="flex items-center justify-center w-16 h-16 bg-[#EFBF04] rounded-full mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.4 }}
                >
                  <GraduationCap className="w-8 h-8  text-center text-[#053f52]" />
                </motion.div>
                
                <h1 
                  className="text-3xl md:text-4xl mb-4 text-center"
                  style={{ fontFamily: "'Crimson Pro', serif" }}
                >
                  {isSignUp ? 'Join Our Community' : 'Welcome Back'}
                </h1>
                
                <p 
                  className="text-lg text-gray-200 mb-8 text-center"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {isSignUp 
                    ? 'Create your account to begin your journey with Queensgate International School.'
                    : 'Sign in to access the admissions portal and manage your applications.'}
                </p>

                {/* Benefits List */}
                <div className="space-y-4 mb-8">
                  {[
                    'Track your application status',
                    'Upload required documents',
                    'Communicate with admissions team',
                    'Access important updates'
                  ].map((benefit, index) => (
                    <motion.div 
                      key={benefit}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <motion.div 
                        className="w-6 h-6 bg-[#EFBF04] rounded-full flex items-center justify-center flex-shrink-0"
                        whileHover={{ scale: 1.1 }}
                      >
                        <CheckCircle className="w-4 h-4 text-[#053f52]" />
                      </motion.div>
                      <span className="text-gray-100">{benefit}</span>
                    </motion.div>
                  ))}
                </div>

                {/* School Contact */}
                <div className="mt-auto pt-2 border-t border-white/20">
                  <p className="text-sm text-gray-300 mb-2">Need assistance?</p>
                  <a 
                    href="mailto:admissions@qisug.ac.ug" 
                    className="text-[#EFBF04] hover:underline flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    admissions@qisug.ac.ug
                  </a>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Login Form (Without Card) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-r-2xl p-6 md:p-8 shadow-xl">
                <div className="space-y-1 pb-6">
                  <h2 className="text-2xl text-center text-[#053f52]" style={{ fontFamily: "'Crimson Pro', serif" }}>
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </h2>
                  <p className="text-center text-gray-500">Enter your credentials to continue</p>
                </div>
                
                <div className="space-y-4">
                  {/* Error/Success Messages */}
                  {error && (
                    <motion.div 
                      className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-red-800">Error</p>
                        <p className="text-red-700 text-sm">{error}</p>
                      </div>
                    </motion.div>
                  )}

                  {success && (
                    <motion.div 
                      className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-green-800">Success</p>
                        <p className="text-green-700 text-sm">{success}</p>
                      </div>
                    </motion.div>
                  )}

                  <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
                    {/* Full Name (Sign Up Only) */}
                    {isSignUp && (
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-gray-700">Full Name</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="fullName"
                            type="text"
                            placeholder="John Doe"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="pl-10 h-11 border-gray-200"
                            required={isSignUp}
                          />
                        </div>
                      </div>
                    )}

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 h-11 border-gray-200"
                          required
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-700">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10 h-11 border-gray-200"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Forgot Password Link */}
                    {!isSignUp && (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={handleForgotPassword}
                          className="text-sm text-[#053f52] hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full h-11 bg-[#053f52] hover:bg-[#042a38] text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {isSignUp ? 'Creating Account...' : 'Signing In...'}
                        </span>
                      ) : (
                        isSignUp ? 'Create Account' : 'Sign In'
                      )}
                    </Button>
                  </form>

                  {/* Divider */}
                  <div className="relative my-6">
                    <Separator />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm text-gray-500">
                      or continue with
                    </span>
                  </div>

                  {/* Google Sign In */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 border-gray-200"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                </div>

                <div className="flex flex-col space-y-4 mt-6">
                  <p className="text-sm text-gray-600 text-center">
                    {isSignUp ? (
                      <>
                        Already have an account?{' '}
                        <button
                          onClick={() => {
                            setIsSignUp(false);
                            setError(null);
                            setSuccess(null);
                          }}
                          className="text-[#053f52] font-semibold hover:underline"
                        >
                          Sign in
                        </button>
                      </>
                    ) : (
                      <>
                        Don&apos;t have an account?{' '}
                        <button
                          onClick={() => {
                            setIsSignUp(true);
                            setError(null);
                            setSuccess(null);
                          }}
                          className="text-[#053f52] font-semibold hover:underline"
                        >
                          Sign up
                        </button>
                      </>
                    )}
                  </p>

                  <Link 
                    href="/" 
                    className="text-sm text-gray-500 hover:text-[#053f52] transition-colors text-center"
                  >
                    ← Return to homepage
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <MainSiteFooter />
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoadingSkeleton />}>
      <LoginContent />
    </Suspense>
  );
}

function LoginLoadingSkeleton() {
  return (
    <>
      <BlueSiteHeader />
      <div className="min-h-screen pt-[120px] md:pt-[200px] lg:pt-[160px] pb-16 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 items-stretch">
            <div className="hidden lg:flex flex-col justify-center p-8 md:p-12">
              <div className="bg-[#053f52] rounded-l-2xl p-8 md:p-12 text-white h-full animate-pulse" />
            </div>
            <div className="p-6 md:p-8">
              <div className="bg-white/95 backdrop-blur-sm rounded-r-2xl p-6 md:p-8 h-full animate-pulse">
                <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-4" />
                <div className="h-4 w-32 bg-gray-200 rounded mx-auto mb-8" />
                <div className="space-y-4">
                  <div className="h-11 bg-gray-200 rounded" />
                  <div className="h-11 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MainSiteFooter />
    </>
  );
}


