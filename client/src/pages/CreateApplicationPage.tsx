import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { applicationApi } from '../services/applicationApi';
import { ApplicationForm } from '../components/applications/ApplicationForm';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export const CreateApplicationPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const newApp = await applicationApi.create(data);
      toast.success('Job application created successfully!');
      navigate(`/applications/${newApp._id}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create application.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <Link
          to="/applications"
          className="p-2 rounded-lg text-gray-500 hover:bg-white hover:text-gray-900 dark:hover:bg-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
            Log New Job Application
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Capture company specifications, compensation boundaries, and notes.
          </p>
        </div>
      </div>

      <ApplicationForm onSubmit={handleSubmit} isLoading={isLoading} submitLabel="Save Application" />
    </div>
  );
};
