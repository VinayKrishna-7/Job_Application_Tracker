import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '../services/authApi';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Briefcase, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const schema = z.object({
  email: z.string().trim().email('Please enter a valid email address').toLowerCase(),
});

type FormData = z.infer<typeof schema>;

export const ForgotPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [devToken, setDevToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: searchParams.get('email') || '',
    },
  });


  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const res = await authApi.forgotPassword(data.email);
      setIsSubmitted(true);
      if (res.devResetToken) {
        setDevToken(res.devResetToken);
      }
      toast.success('Password reset email dispatched.');
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
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
            Reset your password
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Enter your email and we'll send you instructions to reset your password.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {isSubmitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                Check your inbox
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                If an account exists with that email, we have sent instructions to reset your password.
              </p>

              {devToken && (
                <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-left border border-indigo-200 dark:border-indigo-800">
                  <p className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
                    Dev Mode Quick Reset Link:
                  </p>
                  <Link
                    to={`/reset-password?token=${devToken}`}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 underline break-all mt-1 block"
                  >
                    Click here to set new password
                  </Link>
                </div>
              )}

              <Link to="/login" className="inline-block mt-4">
                <Button variant="outline" size="sm">
                  Return to sign in
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                leftIcon={<Mail className="w-4 h-4" />}
                error={errors.email?.message}
                {...register('email')}
              />

              <Button type="submit" isLoading={isLoading} className="w-full mt-2" size="md">
                Send Reset Link
              </Button>
            </form>
          )}
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
