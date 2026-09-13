import { useState, MouseEvent } from 'react';
import {
  Calendar,
  Clock,
  Globe,
  MapPin,
  Trophy,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Share2,
  CalendarPlus,
  Check,
  Sparkles,
} from 'lucide-react';
import { Hackathon } from '../types';
import { getGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';

interface HackathonCardProps {
  key?: string;
  hackathon: Hackathon;
  isSaved: boolean;
  onToggleSave: (hackathon: Hackathon) => void;
  onOpenDetails: (hackathon: Hackathon) => void;
}

export function HackathonCard({
  hackathon,
  isSaved,
  onToggleSave,
  onOpenDetails,
}: HackathonCardProps) {
  const [showCalendarMenu, setShowCalendarMenu] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = (e: MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(hackathon.url || window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const getStatusBadge = () => {
    if (hackathon.status === 'closing-soon' || (hackathon.daysLeftToRegister !== undefined && hackathon.daysLeftToRegister <= 5)) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-950 text-rose-300 border border-rose-800 animate-pulse">
          <Clock className="w-3 h-3 mr-1 text-rose-400" />
          {hackathon.daysLeftToRegister !== undefined
            ? `${hackathon.daysLeftToRegister} days left`
            : 'Closing Soon'}
        </span>
      );
    }
    if (hackathon.status === 'upcoming') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-950 text-blue-300 border border-blue-800/80">
          Registering Now
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950 text-emerald-300 border border-emerald-800/80">
        In Progress
      </span>
    );
  };

  return (
    <div
      id={`hackathon-card-${hackathon.id}`}
      className="group bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-slate-700 p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-slate-950/50"
    >
      <div>
        {/* Top Header Row: Category, Status, Free Badge, Save Toggle */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {hackathon.categoryLabel || hackathon.category}
            </span>
            {getStatusBadge()}
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
              Free Entry
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Copy hackathon link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(hackathon);
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                isSaved
                  ? 'text-amber-400 bg-amber-500/10'
                  : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save hackathon'}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4 fill-amber-400/20" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Title and Organizer */}
        <div className="mb-2.5">
          <h3
            onClick={() => onOpenDetails(hackathon)}
            className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors cursor-pointer leading-snug"
          >
            {hackathon.title}
          </h3>
          <p className="text-xs font-medium text-slate-400 mt-0.5">
            Organized by <span className="text-slate-300">{hackathon.organizer}</span>
          </p>
        </div>

        {/* Tagline / Brief summary */}
        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
          {hackathon.tagline || hackathon.description}
        </p>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 bg-slate-950/60 rounded-xl p-3 border border-slate-800/60 mb-4">
          <div className="flex items-center space-x-2">
            <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate font-semibold text-amber-300/90" title={hackathon.prizePool}>
              {hackathon.prizePool}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {hackathon.format === 'Online' ? (
              <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : (
              <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            )}
            <span className="truncate text-slate-300" title={hackathon.location}>
              {hackathon.format} ({hackathon.location})
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span className="truncate text-slate-400">
              {hackathon.startDate ? `${hackathon.startDate}` : 'Dates TBD'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Clock className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="truncate text-slate-400" title={`Deadline: ${hackathon.registrationDeadline}`}>
              Due {hackathon.registrationDeadline || 'Soon'}
            </span>
          </div>
        </div>

        {/* Tags */}
        {hackathon.tags && hackathon.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {hackathon.tags.slice(0, 4).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-800"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Action Row */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 relative">
        {/* Calendar dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowCalendarMenu(!showCalendarMenu)}
            className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 transition-colors"
            title="Export dates to your calendar for free"
          >
            <CalendarPlus className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Add to Cal</span>
          </button>

          {showCalendarMenu && (
            <div
              className="absolute left-0 bottom-full mb-1 w-44 bg-slate-900 border border-slate-700 rounded-xl shadow-xl py-1 z-20 text-xs"
              onMouseLeave={() => setShowCalendarMenu(false)}
            >
              <a
                href={getGoogleCalendarUrl(hackathon)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowCalendarMenu(false)}
                className="block px-3 py-2 text-slate-200 hover:bg-slate-800 transition-colors"
              >
                Google Calendar
              </a>
              <button
                onClick={() => {
                  downloadIcsFile(hackathon);
                  setShowCalendarMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800 transition-colors"
              >
                Apple / Outlook (.ics)
              </button>
            </div>
          )}
        </div>

        {/* Details & Official Link buttons */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => onOpenDetails(hackathon)}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 rounded-lg border border-slate-700 transition-colors"
          >
            Overview
          </button>

          <a
            href={hackathon.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 px-3.5 py-1.5 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg shadow-sm shadow-emerald-500/20 transition-colors"
          >
            <span>Official Page</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
