import { useState } from 'react';
import { RefreshCw, Bookmark, Bell, Radio, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  lastUpdated: string;
  isRefreshing: boolean;
  onRefresh: () => void;
  savedCount: number;
  onOpenSaved: () => void;
  onOpenNotifications: () => void;
}

export function Header({
  lastUpdated,
  isRefreshing,
  onRefresh,
  savedCount,
  onOpenSaved,
  onOpenNotifications,
}: HeaderProps) {
  const [copiedNotification, setCopiedNotification] = useState(false);

  const formatLastUpdated = (isoString: string) => {
    if (!isoString) return 'Just now';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Just now';
    }
  };

  return (
    <header id="app-header" className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo and Status */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Radio className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-900" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-lg text-slate-100 tracking-tight">Daily Hackathon Tracker</h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                100% Free
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Daily live net scans across Devpost, MLH, Kaggle, and open web
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Live Sync Status */}
          <div className="hidden md:flex items-center text-xs text-slate-400 mr-1 bg-slate-800/50 px-2.5 py-1.5 rounded-lg border border-slate-700/50">
            <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-ping" />
            <span>Updated {formatLastUpdated(lastUpdated)}</span>
          </div>

          {/* Sync Button */}
          <button
            id="refresh-live-net-btn"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-colors disabled:opacity-50"
            title="Scan live internet for newly announced hackathons"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">{isRefreshing ? 'Scanning Net...' : 'Check Live Net'}</span>
          </button>

          {/* Saved Bookmarks */}
          <button
            id="open-saved-btn"
            onClick={onOpenSaved}
            className="relative inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-colors"
            title="View saved hackathons"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Saved</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {savedCount}
              </span>
            )}
          </button>

          {/* Daily Notifications */}
          <button
            id="daily-alerts-btn"
            onClick={onOpenNotifications}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/50 hover:border-emerald-600 transition-colors"
            title="Daily alert preferences"
          >
            <Bell className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Daily Alerts</span>
          </button>
        </div>
      </div>
    </header>
  );
}
