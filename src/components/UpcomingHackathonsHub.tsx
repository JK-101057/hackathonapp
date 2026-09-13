import { useState, useMemo } from 'react';
import {
  Rocket,
  Calendar,
  Clock,
  Trophy,
  Sparkles,
  ExternalLink,
  CalendarPlus,
  Bookmark,
  BookmarkCheck,
  Send,
  Loader2,
  CheckCircle2,
  ChevronRight,
  Lightbulb,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import { Hackathon } from '../types';
import { getGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';

interface UpcomingHackathonsHubProps {
  hackathons: Hackathon[];
  savedHackathons: Hackathon[];
  onToggleSave: (hackathon: Hackathon) => void;
  onOpenDetails: (hackathon: Hackathon) => void;
}

interface ScoutRecommendation {
  id: string;
  title: string;
  organizer: string;
  prizePool: string;
  daysLeft: number;
  whyJoin: string;
  prepTip: string;
}

interface ScoutResponse {
  summary: string;
  recommendations: ScoutRecommendation[];
}

export function UpcomingHackathonsHub({
  hackathons,
  savedHackathons,
  onToggleSave,
  onOpenDetails,
}: UpcomingHackathonsHubProps) {
  // Timeline filter: 'all' | 'week' | 'month' | 'future'
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'week' | 'month' | 'future'>('all');

  // AI Scout State
  const [scoutPrompt, setScoutPrompt] = useState('');
  const [isScouting, setIsScouting] = useState(false);
  const [scoutResult, setScoutResult] = useState<ScoutResponse | null>(null);

  // Filter only upcoming hackathons (status === 'upcoming' or registration deadline in future)
  const upcomingList = useMemo(() => {
    return hackathons.filter(
      (h) => h.status === 'upcoming' || (h.daysLeftToRegister !== undefined && h.daysLeftToRegister > 0)
    );
  }, [hackathons]);

  // Group by timeline
  const filteredUpcoming = useMemo(() => {
    return upcomingList.filter((h) => {
      const days = h.daysLeftToRegister ?? 14;
      if (timelineFilter === 'week') return days <= 7;
      if (timelineFilter === 'month') return days > 7 && days <= 30;
      if (timelineFilter === 'future') return days > 30;
      return true;
    }).sort((a, b) => {
      const dateA = a.startDate ? new Date(a.startDate).getTime() : 9999999999999;
      const dateB = b.startDate ? new Date(b.startDate).getTime() : 9999999999999;
      return dateA - dateB;
    });
  }, [upcomingList, timelineFilter]);

  // Query Upcoming Scout API
  const handleRunScout = async (promptQuery: string) => {
    setIsScouting(true);
    try {
      const res = await fetch('/api/upcoming-scout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptQuery }),
      });
      if (res.ok) {
        const data = await res.json();
        setScoutResult(data);
      }
    } catch (e) {
      console.error('Error querying upcoming scout:', e);
    } finally {
      setIsScouting(false);
    }
  };

  const PRESET_QUERIES = [
    { label: '🚀 AI & Agent Hackathons', prompt: 'What are the top upcoming AI and autonomous agent hackathons?' },
    { label: '🎓 Students & Beginners', prompt: 'Which upcoming hackathons are beginner and student friendly with free mentorship?' },
    { label: '⚡ Starting in 7 Days', prompt: 'Tell me about upcoming hackathons starting within the next week.' },
    { label: '🏆 Highest Prize Pools', prompt: 'Show upcoming hackathons with the largest prize pools and grants.' },
    { label: '🎮 Game Jams & Creative', prompt: 'Are there any upcoming game jams or creative coding hackathons?' },
  ];

  return (
    <div id="upcoming-hackathons-hub" className="space-y-6">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 rounded-2xl border border-emerald-800/40 p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 mb-2">
              <Rocket className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              Upcoming Hackathons Hub
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              What's Coming Up on the Horizon
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Discover and pre-register for upcoming hackathons before spots fill up. All events are verified 100% free to enter with real prizes and starter workshops.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 text-center flex-1 md:flex-initial">
              <div className="text-xs text-slate-400 font-medium">Upcoming Events</div>
              <div className="text-lg font-bold text-emerald-400">{upcomingList.length} Competitions</div>
            </div>
            <div className="bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 text-center flex-1 md:flex-initial">
              <div className="text-xs text-slate-400 font-medium">Free Entry</div>
              <div className="text-lg font-bold text-white">$0 Guaranteed</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Upcoming Scout Section */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-lg">
        <div className="flex items-center space-x-2 mb-3">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Ask Upcoming Hackathon Scout</h3>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
            Live AI Analysis
          </span>
        </div>

        {/* Preset Query Chips */}
        <div className="flex flex-wrap gap-2 mb-3">
          {PRESET_QUERIES.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setScoutPrompt(q.prompt);
                handleRunScout(q.prompt);
              }}
              disabled={isScouting}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-emerald-300 border border-slate-800 hover:border-emerald-800/60 transition-colors disabled:opacity-50"
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Custom Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask anything about upcoming hackathons (e.g. 'Any student hackathons in October with hardware tracks?')..."
            value={scoutPrompt}
            onChange={(e) => setScoutPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && scoutPrompt.trim() && handleRunScout(scoutPrompt)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
          <button
            onClick={() => scoutPrompt.trim() && handleRunScout(scoutPrompt)}
            disabled={isScouting || !scoutPrompt.trim()}
            className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-semibold text-xs rounded-xl flex items-center space-x-1 transition-colors"
          >
            {isScouting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Ask Scout</span>
          </button>
        </div>

        {/* Scout Result Display */}
        {scoutResult && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3 animate-fade-in">
            <div className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-emerald-400 font-semibold">Scout Outlook: </strong>
              {scoutResult.summary}
            </div>

            {scoutResult.recommendations && scoutResult.recommendations.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-800/80">
                {scoutResult.recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{rec.title}</span>
                      <span className="text-[10px] text-amber-300 font-semibold">{rec.prizePool}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">{rec.whyJoin}</div>
                    <div className="text-[10px] text-emerald-400 flex items-start space-x-1">
                      <Lightbulb className="w-3 h-3 shrink-0 mt-0.5" />
                      <span>{rec.prepTip}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Timeline Filter Controls */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-400">Timeline:</span>
          {[
            { id: 'all', label: `All Upcoming (${upcomingList.length})` },
            { id: 'week', label: 'Starting in ≤ 7 Days' },
            { id: 'month', label: 'Next 2–4 Weeks' },
            { id: 'future', label: 'Next Month & Beyond' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTimelineFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                timelineFilter === tab.id
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500">
          Showing {filteredUpcoming.length} upcoming hackathons sorted by start date
        </span>
      </div>

      {/* Upcoming Hackathons List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredUpcoming.map((hackathon) => {
          const isSaved = savedHackathons.some((h) => h.id === hackathon.id);
          const daysLeft = hackathon.daysLeftToRegister ?? 14;

          return (
            <div
              key={hackathon.id}
              id={`upcoming-card-${hackathon.id}`}
              className="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-slate-700 p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-slate-950/50"
            >
              <div>
                {/* Header Badge Row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/80">
                      <Clock className="w-3 h-3 mr-1 text-emerald-400" />
                      Starts in {daysLeft} days
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      {hackathon.categoryLabel || hackathon.category}
                    </span>
                  </div>

                  <button
                    onClick={() => onToggleSave(hackathon)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isSaved
                        ? 'text-amber-400 bg-amber-500/10'
                        : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
                    }`}
                    title={isSaved ? 'Remove from saved' : 'Save to tracker'}
                  >
                    {isSaved ? <BookmarkCheck className="w-4 h-4 fill-amber-400/20" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>

                {/* Title & Organizer */}
                <div className="mb-2">
                  <h3
                    onClick={() => onOpenDetails(hackathon)}
                    className="text-base font-bold text-white hover:text-emerald-400 cursor-pointer transition-colors leading-snug"
                  >
                    {hackathon.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Organized by <span className="text-slate-300">{hackathon.organizer}</span>
                  </p>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                  {hackathon.tagline || hackathon.description}
                </p>

                {/* Specs Box */}
                <div className="space-y-1.5 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800/60 mb-4">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400 flex items-center">
                      <Trophy className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
                      Prize Pool
                    </span>
                    <span className="font-bold text-amber-300">{hackathon.prizePool}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400 flex items-center">
                      <Calendar className="w-3.5 h-3.5 text-purple-400 mr-1.5" />
                      Starts On
                    </span>
                    <span className="font-medium text-slate-200">{hackathon.startDate || 'Upcoming'}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400 flex items-center">
                      <Clock className="w-3.5 h-3.5 text-rose-400 mr-1.5" />
                      Registration Due
                    </span>
                    <span className="font-medium text-slate-300">{hackathon.registrationDeadline || 'Soon'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <a
                  href={getGoogleCalendarUrl(hackathon)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
                  title="Add registration reminder to Google Calendar"
                >
                  <CalendarPlus className="w-3.5 h-3.5 text-purple-400" />
                  <span className="hidden sm:inline">Set Reminder</span>
                </a>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => onOpenDetails(hackathon)}
                    className="px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 rounded-lg border border-slate-700 hover:bg-slate-750 transition-colors"
                  >
                    Overview
                  </button>

                  <a
                    href={hackathon.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg shadow-sm shadow-emerald-500/20 transition-colors"
                  >
                    <span>Pre-Register</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
