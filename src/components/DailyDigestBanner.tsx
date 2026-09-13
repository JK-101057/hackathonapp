import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, TrendingUp, DollarSign, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { DailyDigest, Hackathon } from '../types';

interface DailyDigestBannerProps {
  digest: DailyDigest | null;
  totalHackathons: number;
  closingSoonCount: number;
  totalPrizePoolEstimated: string;
}

export function DailyDigestBanner({
  digest,
  totalHackathons,
  closingSoonCount,
  totalPrizePoolEstimated,
}: DailyDigestBannerProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setHasSpeechSupport(true);
    }
  }, []);

  const toggleAudioBriefing = () => {
    if (!hasSpeechSupport || !digest) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToRead = `${digest.headline}. ${digest.summary}. Key highlights: ${digest.keyHighlights.join('. ')}. All competitions listed are 100% free to enter with zero charges.`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  if (!digest) return null;

  return (
    <div id="daily-digest-banner" className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl mb-8 relative overflow-hidden">
      {/* Decorative top ambient glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Top bar with date and listen button */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              Daily Net Briefing
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {digest.date || new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>

          {hasSpeechSupport && (
            <button
              id="listen-briefing-btn"
              onClick={toggleAudioBriefing}
              className={`inline-flex items-center space-x-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                isPlayingAudio
                  ? 'bg-emerald-600 text-white border-emerald-500 animate-pulse'
                  : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border-slate-700'
              }`}
              title="Listen to today's hackathon audio briefing"
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-white" />
                  <span>Stop Briefing</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Listen to Today's Update</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Headline */}
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mb-2">
          {digest.headline}
        </h2>

        {/* Summary */}
        <p className="text-sm text-slate-300 leading-relaxed max-w-4xl mb-4">
          {digest.summary}
        </p>

        {/* Key metrics grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 mb-4">
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/40">
            <div className="flex items-center text-slate-400 text-xs font-medium mb-1">
              <TrendingUp className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              Active Free Tracks
            </div>
            <div className="text-xl font-bold text-white">{totalHackathons} Competitions</div>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/40">
            <div className="flex items-center text-slate-400 text-xs font-medium mb-1">
              <DollarSign className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              Free Entry Fee
            </div>
            <div className="text-xl font-bold text-emerald-400">$0 Free (100%)</div>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/40">
            <div className="flex items-center text-slate-400 text-xs font-medium mb-1">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-rose-400" />
              Closing in ≤ 14 Days
            </div>
            <div className="text-xl font-bold text-rose-300">{closingSoonCount} Closing Soon</div>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/40">
            <div className="flex items-center text-slate-400 text-xs font-medium mb-1">
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
              Live Net Verification
            </div>
            <div className="text-xl font-bold text-blue-300">Grounded Real Links</div>
          </div>
        </div>

        {/* Highlights */}
        {digest.keyHighlights && digest.keyHighlights.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Today's Key Highlights
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {digest.keyHighlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-2 text-xs text-slate-300 bg-slate-800/30 px-3 py-2 rounded-lg border border-slate-800"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
