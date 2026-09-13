import { Search, X, SlidersHorizontal } from 'lucide-react';
import { HackathonCategory, HackathonFormat, HackathonStatus } from '../types';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: HackathonCategory;
  onSelectCategory: (cat: HackathonCategory) => void;
  selectedFormat: HackathonFormat;
  onSelectFormat: (fmt: HackathonFormat) => void;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  totalCount: number;
}

const CATEGORIES: { id: HackathonCategory; label: string }[] = [
  { id: 'all', label: 'All Fields' },
  { id: 'ai', label: 'AI & Agents' },
  { id: 'students', label: 'Students & Beginners' },
  { id: 'opensource', label: 'Open Source' },
  { id: 'web3', label: 'Web3 & Crypto' },
  { id: 'climate', label: 'Space & Climate' },
  { id: 'gamejam', label: 'Game Jams' },
  { id: 'fintech', label: 'Fintech' },
];

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  selectedFormat,
  onSelectFormat,
  selectedStatus,
  onSelectStatus,
  sortBy,
  onSortChange,
  totalCount,
}: FilterBarProps) {
  return (
    <div id="filter-bar" className="space-y-4 mb-6">
      {/* Top row: Search input + Format & Sort selectors */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="hackathon-search-input"
            type="text"
            placeholder="Search by topic, organizer, tech stack (e.g. Python, NASA, MLH, Kaggle)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-slate-900 text-slate-100 placeholder-slate-500 rounded-xl border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Secondary dropdown filters */}
        <div className="flex items-center gap-2">
          {/* Format selector */}
          <select
            id="format-selector"
            value={selectedFormat}
            onChange={(e) => onSelectFormat(e.target.value as HackathonFormat)}
            className="bg-slate-900 text-slate-300 text-xs font-medium rounded-xl border border-slate-800 px-3 py-2.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Locations</option>
            <option value="online">100% Online / Remote</option>
            <option value="in-person">In-Person Only</option>
            <option value="hybrid">Hybrid (Local + Virtual)</option>
          </select>

          {/* Status selector */}
          <select
            id="status-selector"
            value={selectedStatus}
            onChange={(e) => onSelectStatus(e.target.value)}
            className="bg-slate-900 text-slate-300 text-xs font-medium rounded-xl border border-slate-800 px-3 py-2.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Timelines</option>
            <option value="upcoming">Registering / Upcoming</option>
            <option value="active">Active / In Progress</option>
            <option value="closing-soon">Closing Soon (≤14 Days)</option>
          </select>

          {/* Sort selector */}
          <select
            id="sort-selector"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-slate-900 text-slate-300 text-xs font-medium rounded-xl border border-slate-800 px-3 py-2.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            <option value="deadline">Deadline: Soonest</option>
            <option value="prize">Highest Prize Pool</option>
            <option value="start">Start Date: Soonest</option>
          </select>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-700">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
