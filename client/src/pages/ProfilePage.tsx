import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { profileApi } from '../services/profileApi';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import {
  User,
  Mail,
  Briefcase,
  MapPin,
  Phone,
  Linkedin,
  Github,
  Globe,
  Camera,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

const profileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  title: z.string().trim().max(100).optional(),
  bio: z.string().trim().max(500).optional(),
  phone: z.string().trim().max(30).optional(),
  location: z.string().trim().max(100).optional(),
  linkedIn: z.string().trim().max(200).optional(),
  gitHub: z.string().trim().max(200).optional(),
  portfolio: z.string().trim().max(200).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      title: user?.title || '',
      bio: user?.bio || '',
      phone: user?.phone || '',
      location: user?.location || '',
      linkedIn: user?.linkedIn || '',
      gitHub: user?.gitHub || '',
      portfolio: user?.portfolio || '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        title: user.title || '',
        bio: user.bio || '',
        phone: user.phone || '',
        location: user.location || '',
        linkedIn: user.linkedIn || '',
        gitHub: user.gitHub || '',
        portfolio: user.portfolio || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsSaving(true);
      const updatedUser = await profileApi.updateProfile(data);
      updateUser(updatedUser);
      toast.success('Profile details saved successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Avatar file size must be less than 2MB.');
      return;
    }

    try {
      setIsUploadingAvatar(true);
      const res = await profileApi.uploadAvatar(file);
      updateUser(res.user);
      toast.success('Avatar uploaded successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload avatar.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
          Your Profile
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Manage your personal information, links, and portfolio presence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Card: Avatar & Summary */}
        <Card className="p-6 flex flex-col items-center text-center space-y-4 h-fit">
          <div className="relative group">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-28 w-28 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950 font-black text-3xl text-indigo-700 dark:text-indigo-300 border-4 border-white dark:border-gray-800 shadow-md">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}

            <label className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg cursor-pointer hover:bg-indigo-700 transition-colors">
              <Camera className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={isUploadingAvatar}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">
              {user?.name}
            </h3>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
              {user?.title || 'Professional Title Not Set'}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>

          {user?.bio && (
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-3">
              {user.bio}
            </p>
          )}
        </Card>

        {/* Right Form: Editable Profile Details */}
        <div className="md:col-span-2">
          <Card className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  leftIcon={<User className="w-4 h-4" />}
                  error={errors.name?.message}
                  {...register('name')}
                />

                <Input
                  label="Email (Account ID)"
                  value={user?.email || ''}
                  disabled
                  helperText="Email cannot be changed."
                  leftIcon={<Mail className="w-4 h-4" />}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Professional Title"
                  placeholder="e.g. Senior Software Engineer"
                  leftIcon={<Briefcase className="w-4 h-4" />}
                  error={errors.title?.message}
                  {...register('title')}
                />

                <Input
                  label="Location"
                  placeholder="e.g. San Francisco, CA"
                  leftIcon={<MapPin className="w-4 h-4" />}
                  error={errors.location?.message}
                  {...register('location')}
                />
              </div>

              <Input
                label="Phone Number"
                placeholder="+1 (555) 012-3456"
                leftIcon={<Phone className="w-4 h-4" />}
                error={errors.phone?.message}
                {...register('phone')}
              />

              <Textarea
                label="Professional Bio"
                rows={3}
                placeholder="A brief summary of your tech stack, years of experience, and career aspirations..."
                error={errors.bio?.message}
                {...register('bio')}
              />

              <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Online Profiles & Portfolio
                </h4>

                <Input
                  label="LinkedIn URL"
                  placeholder="https://linkedin.com/in/username"
                  leftIcon={<Linkedin className="w-4 h-4" />}
                  error={errors.linkedIn?.message}
                  {...register('linkedIn')}
                />

                <Input
                  label="GitHub URL"
                  placeholder="https://github.com/username"
                  leftIcon={<Github className="w-4 h-4" />}
                  error={errors.gitHub?.message}
                  {...register('gitHub')}
                />

                <Input
                  label="Portfolio / Personal Website"
                  placeholder="https://yourportfolio.dev"
                  leftIcon={<Globe className="w-4 h-4" />}
                  error={errors.portfolio?.message}
                  {...register('portfolio')}
                />
              </div>

              <div className="flex items-center justify-end pt-3 border-t border-gray-100 dark:border-gray-800">
                <Button type="submit" isLoading={isSaving} disabled={!isDirty}>
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
