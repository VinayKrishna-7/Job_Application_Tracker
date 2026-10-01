import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  Briefcase,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Sun,
  Moon,
  AlertCircle,
  ArrowLeft,
  X,
} from 'lucide-react';

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address')
    .toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const REMEMBERED_EMAIL_KEY = 'easytrack_remembered_email';

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [authError, setAuthError] = useState<{
    title: string;
    message: string;
    action?: 'register' | 'forgot-password';
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Pre-fill remembered email if available
  useEffect(() => {
    const savedEmail = localStorage.getItem(REMEMBERED_EMAIL_KEY);
    if (savedEmail) {
      setValue('email', savedEmail);
      setRememberMe(true);
    }
  }, [setValue]);

  // Clear auth error when user types
  const watchedFields = watch();
  useEffect(() => {
    if (authError) {
      setAuthError(null);
    }
  }, [watchedFields.email, watchedFields.password]);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setAuthError(null);

      // Handle remember me
      if (rememberMe) {
        localStorage.setItem(REMEMBERED_EMAIL_KEY, data.email);
      } else {
        localStorage.removeItem(REMEMBERED_EMAIL_KEY);
      }

      await login(data);
      navigate('/dashboard');
    } catch (err: any) {
      const code = err?.code || '';
      const message = err?.message || '';

      if (
        code === 'USER_NOT_FOUND' ||
        message.toLowerCase().includes('no account') ||
        message.toLowerCase().includes('not found')
      ) {
        setAuthError({
          title: 'Account Not Found',
          message: `We could not find an account registered under "${data.email}". Please verify your email address or create a new account.`,
          action: 'register',
        });
      } else if (
        code === 'INCORRECT_PASSWORD' ||
        message.toLowerCase().includes('incorrect password') ||
        message.toLowerCase().includes('wrong password')
      ) {
        setAuthError({
          title: 'Incorrect Password',
          message: `The password entered for "${data.email}" is incorrect. Please check your password or use password recovery.`,
          action: 'forgot-password',
        });
      } else {
        setAuthError({
          title: 'Authentication Failed',
          message:
            message || 'Invalid email or password. Please verify your credentials and try again.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-gray-50/70 p-4 sm:p-6 dark:bg-gray-950 transition-colors">
      {/* Top Bar with Home Link & Theme Toggle */}
      <div className="flex items-center justify-between w-full max-w-5xl mx-auto pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <button
          onClick={toggleTheme}
          type="button"
          aria-label="Toggle theme"
          className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors shadow-2xs"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Card Container */}
      <div className="w-full max-w-md mx-auto my-auto space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="font-black text-2xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
              EasyTrack
            </span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
            Sign in to your account
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Track every application. Land your next opportunity.
          </p>
        </div>

        {/* Login Form Card */}
        <div className="rounded-2xl border border-gray-200/80 bg-white p-6 sm:p-7 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-colors">
          {/* Inline Actionable Diagnostic Error Alert */}
          {authError && (
            <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-xs text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200 transition-all">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-sm text-rose-900 dark:text-rose-200">
                      {authError.title}
                    </p>
                    <button
                      type="button"
                      onClick={() => setAuthError(null)}
                      className="text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 transition-colors p-0.5 rounded"
                      title="Dismiss alert"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-rose-800 dark:text-rose-300 leading-relaxed font-medium">
                    {authError.message}
                  </p>

                  {/* Contextual Quick Actions */}
                  {authError.action === 'register' && (
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <Link
                        to={`/register?email=${encodeURIComponent(watchedFields.email || '')}`}
                        className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 underline"
                      >
                        Create an account with this email &rarr;
                      </Link>
                    </div>
                  )}

                  {authError.action === 'forgot-password' && (
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <Link
                        to="/forgot-password"
                        className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 underline"
                      >
                        Reset password for this account &rarr;
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(handleLoginSubmit)} className="space-y-4">
            {/* Email Field */}
            <Input
              label="Email Address"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            {/* Password Field with Show/Hide Toggle */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800"
                />
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  Remember my email
                </span>
              </label>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full mt-3 py-2.5 font-bold shadow-xs"
              size="md"
            >
              Sign In
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>
        </div>


        {/* Footer Link */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          Don't have an account yet?{' '}
          <Link
            to="/register"
            className="font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition-colors"
          >
            Create an account
          </Link>
        </div>
      </div>

      {/* Page Footer */}
      <div className="text-center text-xs text-gray-400 dark:text-gray-600 pb-2">
        &copy; {new Date().getFullYear()} EasyTrack. Production-ready career pipeline tracker.
      </div>
    </div>
  );
};

