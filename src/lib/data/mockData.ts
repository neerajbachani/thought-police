import { User, Analysis, LeaderboardEntry, Achievement, Contradiction } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    redditUsername: 'contradictory_carl',
    joinDate: '2024-01-15',
    totalPoints: 2847,
    rank: 'detective',
    badgeCount: 12,
    casesSolved: 43,
    accuracyRate: 89.2,
    avatar: 'https://ik.imagekit.io/2ovnzhrgn/download%20(2).png'
  },
  {
    id: '2',
    redditUsername: 'truth_seeker_99',
    joinDate: '2024-02-03',
    totalPoints: 1923,
    rank: 'sergeant',
    badgeCount: 8,
    casesSolved: 31,
    accuracyRate: 92.1,
    avatar: 'https://ik.imagekit.io/2ovnzhrgn/download%20(6).jfif'
  },
  {
    id: '3',
    redditUsername: 'logic_police',
    joinDate: '2024-01-28',
    totalPoints: 3421,
    rank: 'lieutenant',
    badgeCount: 15,
    casesSolved: 67,
    accuracyRate: 87.5,
    avatar: 'https://ik.imagekit.io/2ovnzhrgn/download%20(3).png'
  }
];

export const mockContradictions: Contradiction[] = [
  {
    id: '1',
    statement1: "I absolutely hate pineapple on pizza. It's disgusting and shouldn't exist.",
    statement2: "Just had the most amazing Hawaiian pizza! The pineapple really makes it special.",
    dates: ['2024-01-15', '2024-03-02'],
    subreddits: ['unpopularopinion', 'food'],
    confidenceScore: 94,
    context: 'User changed opinion on pineapple pizza',
    upvotes: 23,
    downvotes: 2,
    verified: true,
    category: 'personal-preference'
  },
  {
    id: '2',
    statement1: "Climate change is completely overblown. The earth has natural cycles.",
    statement2: "We need to act NOW on climate change before it's too late for our planet.",
    dates: ['2024-01-20', '2024-02-28'],
    subreddits: ['conservative', 'environment'],
    confidenceScore: 91,
    context: 'Major shift in climate change stance',
    upvotes: 45,
    downvotes: 7,
    verified: true,
    category: 'political'
  }
];

export const mockAchievements: Achievement[] = [
  {
    id: '1',
    name: 'First Case',
    description: 'Solved your first contradiction case',
    icon: 'award',
    rarity: 'common',
    unlockedAt: '2024-01-16'
  },
  {
    id: '2',
    name: 'Eagle Eye',
    description: 'Found 10 contradictions with 95%+ accuracy',
    icon: 'eye',
    rarity: 'rare',
    unlockedAt: '2024-02-15'
  },
  {
    id: '3',
    name: 'Truth Hunter',
    description: 'Reached 1000 total points',
    icon: 'target',
    rarity: 'epic'
  }
];

export const mockLeaderboard: LeaderboardEntry[] = [
  {
    user: mockUsers[2],
    period: 'alltime',
    rank: 1,
    points: 3421,
    category: 'total-points'
  },
  {
    user: mockUsers[0],
    period: 'alltime',
    rank: 2,
    points: 2847,
    category: 'total-points'
  },
  {
    user: mockUsers[1],
    period: 'alltime',
    rank: 3,
    points: 1923,
    category: 'total-points'
  }
];

export const rankInfo = {
  'rookie-cop': { name: 'Rookie Cop', minPoints: 0, color: '#64748b' },
  'patrol-officer': { name: 'Patrol Officer', minPoints: 100, color: '#06b6d4' },
  'detective': { name: 'Detective', minPoints: 500, color: '#8b5cf6' },
  'sergeant': { name: 'Sergeant', minPoints: 1000, color: '#f59e0b' },
  'lieutenant': { name: 'Lieutenant', minPoints: 2000, color: '#ef4444' },
  'captain': { name: 'Captain', minPoints: 5000, color: '#10b981' },
  'chief-inspector': { name: 'Chief Inspector', minPoints: 10000, color: '#dc2626' }
};