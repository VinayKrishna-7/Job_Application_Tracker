import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '../services/authApi';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Briefcase, Lock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const resetSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof resetSchema>;

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: FormData) => {
    if (!token) {
      toast.error('Reset token is missing from the URL.');
      return;
    }

    try {
      setIsLoading(true);
      await authApi.resetPassword(token, data.password);
      toast.success('Password reset successfully! Please sign in.');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50/50 dark:bg-gray-950 transition-colors">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
              EasyTrack
            </span>
          </Link>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Set new password
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Please enter your new password below.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button type="submit" isLoading={isLoading} className="w-full mt-2" size="md">
              Update Password
            </Button>
          </form>
        </div>

        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};
