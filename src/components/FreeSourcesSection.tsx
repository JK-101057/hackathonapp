import { ShieldCheck, ExternalLink, Globe, Sparkles, CheckCircle2 } from 'lucide-react';

const LIVE_SOURCES = [
  { name: 'Devpost', url: 'https://devpost.com', desc: 'World largest open hackathon community' },
  { name: 'Major League Hacking (MLH)', url: 'https://mlh.io', desc: 'Student hackathon league & weekend sprints' },
  { name: 'Devfolio', url: 'https://devfolio.co', desc: 'Asia & global developer hackathons' },
  { name: 'Kaggle Competitions', url: 'https://www.kaggle.com', desc: 'Free machine learning challenges & GPU compute' },
  { name: 'ETHGlobal', url: 'https://ethglobal.com', desc: 'Decentralized hackathons & grants' },
  { name: 'NASA Space Apps', url: 'https://www.spaceappschallenge.org', desc: 'Global open science challenge' },
  { name: 'itch.io Game Jams', url: 'https://itch.io/jams', desc: 'Free community game jams & indie showcases' },
  { name: 'HackerEarth', url: 'https://www.hackerearth.com', desc: 'Global enterprise & developer challenges' },
];

export function FreeSourcesSection() {
  return (
    <div id="free-sources-section" className="mt-12 pt-8 border-t border-slate-800/80 space-y-6">
      {/* Zero Expense Pledge */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">100% Free & Zero Expense Commitment</h3>
              <p className="text-xs text-slate-400">
                Guaranteed zero subscription fees, zero hidden paywalls, and zero entry costs
              </p>
            </div>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/80">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" />
            Verified Free Entry Only
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          Daily Hackathon Tracker automatically searches the live internet every day using Google Search Grounding to find real, active, and upcoming hackathons. Every event featured in this directory is strictly verified to be 100% free to enter with zero participant fees, open access to workshops, and real prize pools.
        </p>
      </div>

      {/* Live Net Sources Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
            <Globe className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
            Live Net Indexing Sources
          </h4>
          <span className="text-[11px] text-slate-500">Live Web Grounding Active</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {LIVE_SOURCES.map((source) => (
            <a
              key={source.name}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-slate-900/50 hover:bg-slate-800/60 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                    {source.name}
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-slate-300" />
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                  {source.desc}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
