import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Settings, 
  User, 
  Sparkles, 
  Download, 
  Bell, 
  Moon, 
  Sun, 
  LogOut, 
  Check, 
  ShieldCheck,
  Mail,
  Baby
} from 'lucide-react';
import { AppState, ChildProfile } from '../../types';

interface SettingsViewProps {
  appState: AppState;
  onLogout: () => void;
  onToggleDarkMode: () => void;
  triggerConfetti: () => void;
}

export default function SettingsView({ appState, onLogout, onToggleDarkMode, triggerConfetti }: SettingsViewProps) {
  const [notifications, setNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [backedUp, setBackedUp] = useState(false);

  const parentName = appState.user?.name || 'Guest Parent';
  const parentEmail = appState.user?.email || 'guest@tinysteps.ai';
  const child = appState.childProfile;

  const handleDownloadBackup = () => {
    // Stringify profile + history for local json exports!
    const backupData = {
      user: appState.user,
      childProfile: appState.childProfile,
      favorites: {
        activities: appState.favoritedActivities,
        stories: appState.favoritedStories
      },
      history: appState.recentHistory,
      exportedAt: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `tinysteps_parent_backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setBackedUp(true);
    triggerConfetti(); // Play confetti!
    setTimeout(() => setBackedUp(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans pb-24">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold mb-3">
          <Settings className="w-3.5 h-3.5" />
          <span>System Settings</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">
          Parent Account Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage system layouts, toggle daily notification digests, and secure backup file archives.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* 1. Account Details Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-premium space-y-5">
          <h2 className="font-display font-bold text-slate-900 text-base flex items-center space-x-2 pb-3 border-b border-slate-50">
            <User className="w-4 h-4 text-primary" />
            <span>Profile Identity</span>
          </h2>

          <div className="flex flex-col sm:flex-row justify-between sm:items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white font-display font-bold text-lg">
                {parentName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-800">{parentName}</h4>
                <p className="text-xs text-slate-500 font-semibold flex items-center mt-0.5">
                  <Mail className="w-3.5 h-3.5 mr-1" />
                  <span>{parentEmail}</span>
                </p>
              </div>
            </div>

            <div className="mt-4 sm:mt-0">
              <span className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Active Secured</span>
              </span>
            </div>
          </div>

          {child && (
            <div className="flex items-center space-x-3 p-4 bg-purple-50/50 rounded-2xl border border-purple-100/50">
              <Baby className="w-5 h-5 text-primary" />
              <div className="text-xs text-slate-700">
                Tracking development milestones for <strong className="font-bold">{child.name}</strong> ({child.age} Years Old, {child.gender}).
              </div>
            </div>
          )}
        </div>

        {/* 2. Style & Display Settings Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-premium space-y-4">
          <h2 className="font-display font-bold text-slate-900 text-base flex items-center space-x-2 pb-3 border-b border-slate-50">
            <Moon className="w-4 h-4 text-violet-500" />
            <span>Visual Theme Preference</span>
          </h2>

          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-xs font-bold text-slate-700 block">Dark Canvas Theme</span>
              <span className="text-[10px] text-slate-400 font-semibold">Switch to dark mode for relaxed evening bedtime reading.</span>
            </div>

            <button
              onClick={onToggleDarkMode}
              className={`w-12 h-6 rounded-full p-1 transition-all ${appState.darkMode ? 'bg-primary' : 'bg-slate-200'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white shadow transition-all ${appState.darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* 3. Alerts & Digests */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-premium space-y-4">
          <h2 className="font-display font-bold text-slate-900 text-base flex items-center space-x-2 pb-3 border-b border-slate-50">
            <Bell className="w-4 h-4 text-amber-500" />
            <span>Notifications & Tips</span>
          </h2>

          {/* Switch 1 */}
          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-xs font-bold text-slate-700 block">Daily Play Recommendations</span>
              <span className="text-[10px] text-slate-400 font-semibold">Get morning notifications when your daily play activity compiles.</span>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full p-1 transition-all ${notifications ? 'bg-primary' : 'bg-slate-200'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white shadow transition-all ${notifications ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Switch 2 */}
          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-xs font-bold text-slate-700 block">Weekly Pediatric Nutrition Summary</span>
              <span className="text-[10px] text-slate-400 font-semibold">Receive allergen-friendly lunchbox ideas and dietary metrics.</span>
            </div>
            <button
              onClick={() => setWeeklyDigest(!weeklyDigest)}
              className={`w-12 h-6 rounded-full p-1 transition-all ${weeklyDigest ? 'bg-primary' : 'bg-slate-200'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white shadow transition-all ${weeklyDigest ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* 4. Archives Backup exports */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-premium space-y-4">
          <h2 className="font-display font-bold text-slate-900 text-base flex items-center space-x-2 pb-3 border-b border-slate-50">
            <Download className="w-4 h-4 text-emerald-500" />
            <span>Parent Archive Backups</span>
          </h2>

          <div className="flex flex-col sm:flex-row justify-between sm:items-center py-2 gap-4">
            <div>
              <span className="text-xs font-bold text-slate-700 block">Export Active Profile & Log History</span>
              <span className="text-[10px] text-slate-400 font-semibold">Downloads child favorites, history metrics, and configurations in JSON format.</span>
            </div>

            <button
              onClick={handleDownloadBackup}
              className="px-4 py-2.5 bg-slate-50 border border-slate-100 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold shadow-soft flex items-center justify-center space-x-1.5 transition-all flex-shrink-0"
            >
              {backedUp ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600">Archive Exported!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download JSON</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* LogOut action button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={onLogout}
            className="px-6 py-3 bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-500 font-bold text-xs rounded-xl shadow-soft flex items-center space-x-1.5 transition-all transform hover:-translate-y-0.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Account</span>
          </button>
        </div>

      </div>

    </div>
  );
}
