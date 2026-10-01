import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Sun,
  Moon,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';

const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().trim().email('Please enter a valid email address').toLowerCase(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const { register: registerUser, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: searchParams.get('email') || '',
    },
  });


  // Clear auth error when user types
  const watchedFields = watch();
  React.useEffect(() => {
    if (authError) {
      setAuthError(null);
    }
  }, [watchedFields.email, watchedFields.password, watchedFields.name, watchedFields.confirmPassword]);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      await registerUser(data);
      navigate('/dashboard');
    } catch (err: any) {
      setAuthError(err?.message || 'Registration failed. Please check your information and try again.');
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

      <div className="w-full max-w-md mx-auto my-auto space-y-6">
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
            Create your account
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Start organizing your applications and interview pipeline.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200/80 bg-white p-6 sm:p-7 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-colors">
          {/* Inline Error Alert */}
          {authError && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50/90 p-3.5 text-xs text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">Registration failed</p>
                <p className="mt-0.5 leading-relaxed">{authError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Alex Morgan"
              leftIcon={<User className="w-4 h-4" />}
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="alex@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password (min. 8 characters)"
              type={showPassword ? 'text' : 'password'}
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

            <Input
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button type="submit" isLoading={isLoading} className="w-full mt-3 py-2.5 font-bold shadow-xs" size="md">
              Create Account
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>
        </div>


        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 dark:text-gray-600 pb-2">
        &copy; {new Date().getFullYear()} EasyTrack. All rights reserved.
      </div>
    </div>
  );
};

