import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { applicationApi } from '../services/applicationApi';
import {
  Sun,
  Moon,
  Laptop,
  Download,
  LogOut,
  Bell,
  Shield,
} from 'lucide-react';
import { toast } from 'sonner';

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleExportData = async () => {
    try {
      const res = await applicationApi.list({ limit: 1000 });
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(res.data, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `easytrack_export_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success('Your job search data has been exported successfully.');
    } catch {
      toast.error('Failed to export data.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
          Application Settings
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Configure interface appearance, data backups, and account settings.
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance Card */}
        <Card className="p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
              Appearance
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Customize the look and feel of the EasyTrack user interface.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                theme === 'light'
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                  : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
              }`}
            >
              <div className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-xs text-amber-500">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-xs">Light Theme</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Crisp, high-contrast light palette</p>
              </div>
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                theme === 'dark'
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                  : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
              }`}
            >
              <div className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-xs text-indigo-400">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-xs">Dark Theme</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Easy on the eyes in low-light</p>
              </div>
            </button>
          </div>
        </Card>

        {/* Data Management */}
        <Card className="p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
              Data Management & Backup
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Export your applications, status timeline, and notes for personal backup.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div>
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                Export Applications as JSON
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Download all your application history and interview logs in open JSON format.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleExportData} className="shrink-0">
              <Download className="w-4 h-4 mr-1.5" />
              Export My Data
            </Button>
          </div>
        </Card>

        {/* Account & Session */}
        <Card className="p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
              Account Security & Session
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Authenticated as <span className="font-semibold text-gray-800 dark:text-gray-200">{user?.email}</span>
            </p>
          </div>

          <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                Sign Out
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Securely clear your session cookie and log out of EasyTrack.
              </p>
            </div>
            <Button variant="danger" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-1.5" />
              Log Out
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
