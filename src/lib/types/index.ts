export interface User {
  id: string;
  redditUsername: string;
  joinDate: string;
  totalPoints: number;
  rank: UserRank;
  badgeCount: number;
  casesSolved: number;
  accuracyRate: number;
  avatar?: string;
}

export interface Analysis {
  id: string;
  targetUsername: string;
  analyzerUserId: string;
  contradictionsFound: number;
  confidenceScore: number;
  analysisDate: string;
  reportData: AnalysisReport;
  status: 'processing' | 'completed' | 'failed';
}

export interface AnalysisReport {
  summary: string;
  contradictions: Contradiction[];
  timeline: TimelineEvent[];
  stats: AnalysisStats;
}

export interface Contradiction {
  id: string;
  statement1: string;
  statement2: string;
  dates: [string, string];
  subreddits: [string, string];
  confidenceScore: number;
  context: string;
  upvotes: number;
  downvotes: number;
  verified: boolean;
  category: ContradictionCategory;
  requiresHumanReview?: boolean;
}

export interface TimelineEvent {
  date: string;
  event: string;
  subreddit: string;
  score: number;
}

export interface AnalysisStats {
  totalComments: number;
  timespan: string;
  topSubreddits: string[];
  sentimentTrend: number;
}

export interface LeaderboardEntry {
  user: User;
  period: 'daily' | 'weekly' | 'monthly' | 'alltime';
  rank: number;
  points: number;
  category: LeaderboardCategory;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string;
}

export type UserRank = 
  | 'rookie-cop'
  | 'patrol-officer' 
  | 'detective'
  | 'sergeant'
  | 'lieutenant'
  | 'captain'
  | 'chief-inspector';

export type ContradictionCategory = 
  | 'political'
  | 'personal-preference'
  | 'factual'
  | 'opinion'
  | 'lifestyle'
  | 'relationship'
  | 'technology'
  | 'entertainment';

export type LeaderboardCategory = 
  | 'total-points'
  | 'contradictions-found'
  | 'accuracy-rate'
  | 'cases-solved';

export interface PoliceCard {
  user: User;
  badgeNumber: string;
  department: string;
  issued: string;
  expires: string;
  specializations: string[];
}