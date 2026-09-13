import { useState, useEffect } from 'react';
import { X, Bell, BellRing, Check, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [dailyTime, setDailyTime] = useState('09:00');
  const [subscribedCategories, setSubscribedCategories] = useState<string[]>([
    'ai',
    'students',
    'opensource',
  ]);
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
    const savedTime = localStorage.getItem('dht_alert_time');
    if (savedTime) setDailyTime(savedTime);
    const savedCats = localStorage.getItem('dht_alert_categories');
    if (savedCats) {
      try {
        setSubscribedCategories(JSON.parse(savedCats));
      } catch {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const res = await Notification.requestPermission();
      setPermission(res);
      if (res === 'granted') {
        new Notification('Daily Hackathon Tracker Activated', {
          body: "You'll receive 100% free daily updates on newly announced hackathons!",
          icon: '/favicon.ico',
        });
      }
    }
  };

  const handleTimeChange = (t: string) => {
    setDailyTime(t);
    localStorage.setItem('dht_alert_time', t);
  };

  const toggleCategory = (cat: string) => {
    const updated = subscribedCategories.includes(cat)
      ? subscribedCategories.filter((c) => c !== cat)
      : [...subscribedCategories, cat];
    setSubscribedCategories(updated);
    localStorage.setItem('dht_alert_categories', JSON.stringify(updated));
  };

  const sendTestNotification = () => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification("Today's Top Free Hackathon Radar", {
        body: '3 new global hackathons active today with $250k+ in free prizes! Click to open.',
        icon: '/favicon.ico',
      });
      setTestSent(true);
      setTimeout(() => setTestSent(false), 3000);
    } else {
      requestNotificationPermission();
    }
  };

  return (
    <div
      id="notification-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="notification-modal-content"
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl text-slate-100 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Daily Hackathon Alerts</h3>
              <p className="text-xs text-slate-400">100% Free • No Subscription • Zero Expense</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Permission Status */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-200 mb-0.5">
                Browser Push Notifications
              </div>
              <div className="text-[11px] text-slate-400">
                {permission === 'granted'
                  ? 'Active - you will receive free daily updates'
                  : permission === 'denied'
                  ? 'Blocked in browser settings'
                  : 'Requires one-click approval'}
              </div>
            </div>

            {permission !== 'granted' ? (
              <button
                onClick={requestNotificationPermission}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors"
              >
                Enable Free Alerts
              </button>
            ) : (
              <span className="inline-flex items-center text-xs font-semibold text-emerald-400">
                <Check className="w-4 h-4 mr-1" />
                Enabled
              </span>
            )}
          </div>

          {/* Daily Delivery Time */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              Daily Briefing Delivery Time
            </label>
            <input
              type="time"
              value={dailyTime}
              onChange={(e) => handleTimeChange(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl px-3 py-2 w-full focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Your browser will alert you every day at this time with newly added hackathons.
            </p>
          </div>

          {/* Topic Subscriptions */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Select Categories to Track
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'ai', label: 'AI & Machine Learning' },
                { id: 'students', label: 'Students & Beginners' },
                { id: 'opensource', label: 'Open Source' },
                { id: 'web3', label: 'Web3 & Blockchain' },
                { id: 'climate', label: 'Space & Climate' },
                { id: 'gamejam', label: 'Game Jams' },
              ].map((cat) => {
                const isChecked = subscribedCategories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs text-left transition-colors ${
                      isChecked
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Zero Expense Guarantee */}
          <div className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-xl flex items-start space-x-2.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>100% Free Guarantee:</strong> Alerts run locally inside your browser cache.
              No credit card, no SMS charges, no account signup, and no hidden subscriptions.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
          <button
            onClick={sendTestNotification}
            className="text-xs text-slate-400 hover:text-slate-200 underline font-medium"
          >
            {testSent ? '✓ Notification Dispatched!' : 'Send Test Notification'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
