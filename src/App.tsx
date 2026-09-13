import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { DailyDigestBanner } from './components/DailyDigestBanner';
import { FilterBar } from './components/FilterBar';
import { HackathonCard } from './components/HackathonCard';
import { HackathonModal } from './components/HackathonModal';
import { SavedHackathonsDrawer } from './components/SavedHackathonsDrawer';
import { NotificationModal } from './components/NotificationModal';
import { FreeSourcesSection } from './components/FreeSourcesSection';
import { Hackathon, DailyDigest, HackathonCategory, HackathonFormat } from './types';
import { Sparkles, RefreshCw, AlertCircle, Compass, Search } from 'lucide-react';

export default function App() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [digest, setDigest] = useState<DailyDigest | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<HackathonCategory>('all');
  const [selectedFormat, setSelectedFormat] = useState<HackathonFormat>('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');

  // Saved / Bookmarks
  const [savedHackathons, setSavedHackathons] = useState<Hackathon[]>([]);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);

  // Modals
  const [activeModalHackathon, setActiveModalHackathon] = useState<Hackathon | null>(null);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Show temporary toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load saved bookmarks from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('dht_saved_hackathons');
      if (stored) {
        setSavedHackathons(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load saved hackathons', e);
    }
  }, []);

  // Fetch hackathons from backend
  const fetchHackathons = async (forceRefresh = false) => {
    if (forceRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setErrorMessage(null);

    try {
      const url = `/api/hackathons${forceRefresh ? '?forceRefresh=true' : ''}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to fetch live hackathons`);
      }
      const data = await res.json();
      setHackathons(data.hackathons || []);
      setDigest(data.digest || null);
      setLastUpdated(data.lastUpdated || new Date().toISOString());

      if (forceRefresh) {
        showToast('✓ Live net synchronized with latest hackathons!');
      }
    } catch (err: any) {
      console.error('Error fetching hackathons:', err);
      setErrorMessage(err.message || 'Failed to connect to live radar. Showing local records.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchHackathons(false);
  }, []);

  // Toggle save
  const handleToggleSave = (hackathon: Hackathon) => {
    const exists = savedHackathons.some((h) => h.id === hackathon.id);
    let updated: Hackathon[];
    if (exists) {
      updated = savedHackathons.filter((h) => h.id !== hackathon.id);
      showToast('Removed from saved hackathons');
    } else {
      updated = [...savedHackathons, hackathon];
      showToast('✓ Saved to your hackathon tracker');
    }
    setSavedHackathons(updated);
    localStorage.setItem('dht_saved_hackathons', JSON.stringify(updated));
  };

  const handleRemoveSaved = (id: string) => {
    const updated = savedHackathons.filter((h) => h.id !== id);
    setSavedHackathons(updated);
    localStorage.setItem('dht_saved_hackathons', JSON.stringify(updated));
    showToast('Removed from saved');
  };

  // Filter and sort computation
  const filteredHackathons = useMemo(() => {
    return hackathons
      .filter((h) => {
        // Category filter
        if (selectedCategory !== 'all' && h.category !== selectedCategory) {
          return false;
        }

        // Format filter
        if (selectedFormat !== 'all') {
          if (selectedFormat === 'online' && h.format !== 'Online') return false;
          if (selectedFormat === 'in-person' && h.format !== 'In-Person') return false;
          if (selectedFormat === 'hybrid' && h.format !== 'Hybrid') return false;
        }

        // Status filter
        if (selectedStatus !== 'all') {
          if (selectedStatus === 'closing-soon') {
            if (h.status !== 'closing-soon' && (h.daysLeftToRegister === undefined || h.daysLeftToRegister > 14)) {
              return false;
            }
          } else if (h.status !== selectedStatus) {
            return false;
          }
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesTitle = h.title?.toLowerCase().includes(q);
          const matchesOrg = h.organizer?.toLowerCase().includes(q);
          const matchesDesc = h.description?.toLowerCase().includes(q);
          const matchesTags = h.tags?.some((t) => t.toLowerCase().includes(q));
          const matchesLocation = h.location?.toLowerCase().includes(q);
          if (!matchesTitle && !matchesOrg && !matchesDesc && !matchesTags && !matchesLocation) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'deadline') {
          const daysA = a.daysLeftToRegister !== undefined ? a.daysLeftToRegister : 999;
          const daysB = b.daysLeftToRegister !== undefined ? b.daysLeftToRegister : 999;
          return daysA - daysB;
        }
        if (sortBy === 'start') {
          const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
          const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
          return dateA - dateB;
        }
        if (sortBy === 'prize') {
          const extractNum = (str: string) => {
            const match = str.replace(/,/g, '').match(/\d+/);
            return match ? parseInt(match[0], 10) : 0;
          };
          return extractNum(b.prizePool) - extractNum(a.prizePool);
        }
        return 0;
      });
  }, [hackathons, selectedCategory, selectedFormat, selectedStatus, searchQuery, sortBy]);

  const closingSoonCount = useMemo(() => {
    return hackathons.filter(
      (h) => h.status === 'closing-soon' || (h.daysLeftToRegister !== undefined && h.daysLeftToRegister <= 14)
    ).length;
  }, [hackathons]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-xl font-semibold text-xs shadow-xl animate-fade-in flex items-center space-x-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        lastUpdated={lastUpdated}
        isRefreshing={isRefreshing}
        onRefresh={() => fetchHackathons(true)}
        savedCount={savedHackathons.length}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Daily Digest Briefing Banner */}
        <DailyDigestBanner
          digest={digest}
          totalHackathons={hackathons.length}
          closingSoonCount={closingSoonCount}
          totalPrizePoolEstimated="$450,000+"
        />

        {/* Filter and Search Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedFormat={selectedFormat}
          onSelectFormat={setSelectedFormat}
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalCount={filteredHackathons.length}
        />

        {/* Error Alert if any */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-900/50 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => fetchHackathons(true)}
              className="text-white underline font-semibold hover:text-rose-200"
            >
              Retry Live Scan
            </button>
          </div>
        )}

        {/* Results Count & Active Status */}
        <div className="flex items-center justify-between mb-4 text-xs text-slate-400">
          <div>
            Showing <strong className="text-slate-200">{filteredHackathons.length}</strong> free hackathons
            {selectedCategory !== 'all' && <span> in {selectedCategory}</span>}
          </div>
          <div className="flex items-center space-x-1.5 text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>100% Free Entry Verified</span>
          </div>
        </div>

        {/* Hackathon Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 py-12 text-center">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-64 rounded-2xl bg-slate-900/40 border border-slate-800/60 animate-pulse p-6 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="h-4 bg-slate-800 rounded w-1/3" />
                  <div className="h-6 bg-slate-800 rounded w-3/4" />
                  <div className="h-4 bg-slate-800 rounded w-full" />
                </div>
                <div className="h-10 bg-slate-800/80 rounded" />
              </div>
            ))}
          </div>
        ) : filteredHackathons.length === 0 ? (
          <div className="text-center py-16 px-4 bg-slate-900/30 rounded-2xl border border-slate-800">
            <Compass className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-200 mb-1">No Hackathons Match Your Filters</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4 leading-relaxed">
              We couldn't find any events matching your current search or category selections.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedFormat('all');
                setSelectedStatus('all');
              }}
              className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredHackathons.map((hackathon) => (
              <HackathonCard
                key={hackathon.id}
                hackathon={hackathon}
                isSaved={savedHackathons.some((h) => h.id === hackathon.id)}
                onToggleSave={handleToggleSave}
                onOpenDetails={(h) => setActiveModalHackathon(h)}
              />
            ))}
          </div>
        )}

        {/* Free Sources & Zero Cost Commitment Footer Section */}
        <FreeSourcesSection />
      </main>

      {/* Hackathon Detail Modal */}
      <HackathonModal
        hackathon={activeModalHackathon}
        isOpen={!!activeModalHackathon}
        onClose={() => setActiveModalHackathon(null)}
        isSaved={activeModalHackathon ? savedHackathons.some((h) => h.id === activeModalHackathon.id) : false}
        onToggleSave={handleToggleSave}
      />

      {/* Saved Hackathons Drawer */}
      <SavedHackathonsDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedHackathons={savedHackathons}
        onRemove={handleRemoveSaved}
        onOpenDetails={(h) => setActiveModalHackathon(h)}
      />

      {/* Notification Preferences Modal */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />

      {/* Global Simple Footer */}
      <footer className="bg-slate-900/60 border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Daily Hackathon Tracker • 100% Free • Zero Subscriptions</span>
          <span>Live net updates via Google Search Grounding</span>
        </div>
      </footer>
    </div>
  );
}
