import { useState } from 'react';
import { X, Trash2, ExternalLink, Calendar, Bookmark, CheckCircle2 } from 'lucide-react';
import { Hackathon } from '../types';
import { downloadIcsFile } from '../utils/calendar';

interface SavedHackathonsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedHackathons: Hackathon[];
  onRemove: (id: string) => void;
  onOpenDetails: (hackathon: Hackathon) => void;
}

export function SavedHackathonsDrawer({
  isOpen,
  onClose,
  savedHackathons,
  onRemove,
  onOpenDetails,
}: SavedHackathonsDrawerProps) {
  if (!isOpen) return null;

  return (
    <div
      id="saved-drawer-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <div
        id="saved-drawer-content"
        className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 flex flex-col justify-between shadow-2xl text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <div className="flex items-center space-x-2">
              <Bookmark className="w-5 h-5 text-amber-400" />
              <h2 className="font-bold text-lg text-white">Saved Hackathons</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300">
                {savedHackathons.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer List */}
          <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-140px)] pr-1">
            {savedHackathons.length === 0 ? (
              <div className="text-center py-12 px-4">
                <Bookmark className="w-10 h-10 text-slate-600 mx-auto mb-3 stroke-[1.5]" />
                <h3 className="text-sm font-semibold text-slate-300 mb-1">No Saved Hackathons Yet</h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                  Click the bookmark icon on any hackathon card to save it here for quick tracking and calendar reminders.
                </p>
              </div>
            ) : (
              savedHackathons.map((h) => (
                <div
                  key={h.id}
                  className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between"
                >
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span className="text-emerald-400 font-semibold">{h.prizePool}</span>
                      <span>Due {h.registrationDeadline || 'Soon'}</span>
                    </div>
                    <h4
                      onClick={() => {
                        onClose();
                        onOpenDetails(h);
                      }}
                      className="text-sm font-bold text-white hover:text-emerald-400 transition-colors cursor-pointer leading-snug"
                    >
                      {h.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">{h.organizer}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-900 mt-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => downloadIcsFile(h)}
                        className="text-slate-400 hover:text-slate-200 flex items-center space-x-1"
                        title="Download calendar event"
                      >
                        <Calendar className="w-3.5 h-3.5 text-purple-400" />
                        <span>Cal</span>
                      </button>

                      <a
                        href={h.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                      >
                        <span>Official Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <button
                      onClick={() => onRemove(h.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Drawer Bottom Note */}
        <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 text-center">
          Saved data is stored securely in your browser with zero subscription fees.
        </div>
      </div>
    </div>
  );
}
