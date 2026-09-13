import { useState } from 'react';
import {
  X,
  Trophy,
  Calendar,
  Globe,
  MapPin,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  CalendarPlus,
  Share2,
  Check,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { Hackathon } from '../types';
import { getGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';

interface HackathonModalProps {
  hackathon: Hackathon | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (hackathon: Hackathon) => void;
}

export function HackathonModal({
  hackathon,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
}: HackathonModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !hackathon) return null;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(hackathon.url || window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div
      id="hackathon-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="hackathon-modal-content"
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl text-slate-100 overflow-hidden relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Header Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-y-1 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                100% Free Entry
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                {hackathon.categoryLabel || hackathon.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-950 text-blue-300 border border-blue-800">
                {hackathon.format}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {hackathon.title}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Organized by <strong className="text-slate-200">{hackathon.organizer}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
            <div>
              <div className="text-[11px] font-medium text-slate-400 flex items-center mb-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400 mr-1" />
                Prize Pool
              </div>
              <div className="text-sm font-bold text-amber-300">{hackathon.prizePool}</div>
            </div>

            <div>
              <div className="text-[11px] font-medium text-slate-400 flex items-center mb-1">
                <Calendar className="w-3.5 h-3.5 text-purple-400 mr-1" />
                Dates
              </div>
              <div className="text-sm font-bold text-slate-200">
                {hackathon.startDate ? `${hackathon.startDate}` : 'Ongoing'}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-medium text-slate-400 flex items-center mb-1">
                <Globe className="w-3.5 h-3.5 text-emerald-400 mr-1" />
                Format
              </div>
              <div className="text-sm font-bold text-slate-200">
                {hackathon.format}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-medium text-slate-400 flex items-center mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mr-1" />
                Entry Cost
              </div>
              <div className="text-sm font-bold text-emerald-400">$0.00 (Zero Expense)</div>
            </div>
          </div>

          {/* Tagline / Pitch */}
          {hackathon.tagline && (
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-emerald-200 text-sm italic">
              "{hackathon.tagline}"
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              About This Hackathon
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {hackathon.description}
            </p>
          </div>

          {/* Location details */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Eligibility & Location
            </h4>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{hackathon.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Free registration for all qualified global builders, students, and professionals.</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Solo participants and teams welcome. Teammate matchmaking available on official site.</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {hackathon.tags && hackathon.tags.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Focus Areas & Tech
              </h4>
              <div className="flex flex-wrap gap-2">
                {hackathon.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-950/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleSave(hackathon)}
              className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                isSaved
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              <span>{isSaved ? 'Saved to Tracker' : 'Save for Later'}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors"
              title="Copy official link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedLink ? 'Copied!' : 'Share'}</span>
            </button>

            <a
              href={getGoogleCalendarUrl(hackathon)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors"
            >
              <CalendarPlus className="w-4 h-4 text-purple-400" />
              <span>Google Cal</span>
            </a>

            <button
              onClick={() => downloadIcsFile(hackathon)}
              className="hidden sm:inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors"
            >
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>.ICS File</span>
            </button>
          </div>

          <a
            href={hackathon.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all"
          >
            <span>Register Free on Official Site</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
