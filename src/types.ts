export type HackathonCategory =
  | 'all'
  | 'ai'
  | 'web3'
  | 'opensource'
  | 'students'
  | 'climate'
  | 'mobile'
  | 'gamejam'
  | 'cybersecurity'
  | 'fintech';

export type HackathonFormat = 'all' | 'online' | 'in-person' | 'hybrid';

export type HackathonStatus = 'active' | 'upcoming' | 'closing-soon';

export interface Hackathon {
  id: string;
  title: string;
  organizer: string;
  tagline: string;
  description: string;
  category: HackathonCategory;
  categoryLabel: string;
  format: 'Online' | 'In-Person' | 'Hybrid';
  location: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  prizePool: string;
  entryFee: 'Free' | string;
  url: string;
  tags: string[];
  status: HackathonStatus;
  daysLeftToRegister?: number;
  featured?: boolean;
  participantsCount?: string;
  sourceUrl?: string;
  updatedAt: string;
}

export interface DailyDigest {
  date: string;
  headline: string;
  summary: string;
  newCount: number;
  closingSoonCount: number;
  topPicks: string[]; // hackathon IDs
  keyHighlights: string[];
}

export interface HackathonResponse {
  hackathons: Hackathon[];
  digest: DailyDigest;
  lastUpdated: string;
  source: 'live-net' | 'cache' | 'fallback';
  totalFound: number;
}
