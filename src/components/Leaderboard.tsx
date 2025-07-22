import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, Star, ArrowUp, Users, MessageSquare } from 'lucide-react';
import UserProfileCard from './UserProfileCard';

// Extended mock data with 20+ users for the leaderboard
const leaderboardUsers = [
  { rank: 1, username: 'logic_police', points: 3421, cases: 67, karma: 15420 },
  { rank: 2, username: 'contradictory_carl', points: 2847, cases: 43, karma: 12850 },
  { rank: 3, username: 'truth_seeker_99', points: 1923, cases: 31, karma: 9640 },
  { rank: 4, username: 'fact_checker_pro', points: 1856, cases: 38, karma: 8950 },
  { rank: 5, username: 'reality_guardian', points: 1743, cases: 35, karma: 7830 },
  { rank: 6, username: 'evidence_hunter', points: 1689, cases: 33, karma: 7420 },
  { rank: 7, username: 'logic_master_01', points: 1542, cases: 29, karma: 6890 },
  { rank: 8, username: 'contradiction_cop', points: 1434, cases: 28, karma: 6340 },
  { rank: 9, username: 'truth_detective', points: 1387, cases: 26, karma: 5960 },
  { rank: 10, username: 'fallacy_finder', points: 1291, cases: 24, karma: 5420 },
  { rank: 11, username: 'debate_sheriff', points: 1205, cases: 23, karma: 4980 },
  { rank: 12, username: 'argument_analyst', points: 1156, cases: 22, karma: 4650 },
  { rank: 13, username: 'logic_enforcer', points: 1089, cases: 21, karma: 4320 },
  { rank: 14, username: 'truth_patrol', points: 1034, cases: 19, karma: 3890 },
  { rank: 15, username: 'fact_vigilante', points: 987, cases: 18, karma: 3560 },
  { rank: 16, username: 'reasoning_ranger', points: 943, cases: 17, karma: 3240 },
  { rank: 17, username: 'logic_lieutenant', points: 896, cases: 16, karma: 2980 },
  { rank: 18, username: 'truth_tracker', points: 852, cases: 15, karma: 2670 },
  { rank: 19, username: 'evidence_expert', points: 809, cases: 14, karma: 2350 },
  { rank: 20, username: 'contradiction_hunter', points: 763, cases: 13, karma: 2120 },
  { rank: 21, username: 'logic_investigator', points: 721, cases: 12, karma: 1890 },
  { rank: 22, username: 'truth_officer', points: 685, cases: 11, karma: 1650 },
  { rank: 23, username: 'fact_detective', points: 642, cases: 10, karma: 1420 },
  { rank: 24, username: 'logic_sentinel', points: 598, cases: 9, karma: 1180 },
  { rank: 25, username: 'truth_guardian_x', points: 554, cases: 8, karma: 980 }
];

// Fallback avatars
const fallbackAvatars = [
  "https://ik.imagekit.io/2ovnzhrgn/download%20(2).png",
  "https://ik.imagekit.io/2ovnzhrgn/download%20(6).jfif",
  "https://ik.imagekit.io/2ovnzhrgn/download%20(3).png"
];

const Leaderboard: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [failedAvatars, setFailedAvatars] = useState<Set<string>>(new Set());

  const handleUserClick = (user: any) => {
    setSelectedUser(user);
    setIsCardOpen(true);
  };

  const handleCloseCard = () => {
    setIsCardOpen(false);
    setTimeout(() => setSelectedUser(null), 300);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="relative">
            <Crown className="h-6 w-6 text-yellow-500 drop-shadow-lg" />
            <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-sm animate-pulse"></div>
          </div>
        );
      case 2:
        return (
          <div className="relative">
            <Trophy className="h-5 w-5 text-gray-400 drop-shadow-lg" />
            <div className="absolute inset-0 bg-gray-400/20 rounded-full blur-sm"></div>
          </div>
        );
      case 3:
        return (
          <div className="relative">
            <Medal className="h-5 w-5 text-amber-600 drop-shadow-lg" />
            <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-sm"></div>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-reddit-light-bg-hover dark:bg-reddit-dark-bg-hover border border-reddit-light-border dark:border-reddit-dark-border flex items-center justify-center">
            <span className="text-sm font-bold text-reddit-light-text dark:text-reddit-dark-text">
              {rank}
            </span>
          </div>
        );
    }
  };

  const getRankBackground = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 via-amber-50 to-yellow-50 dark:from-yellow-900/20 dark:via-amber-900/30 dark:to-yellow-900/20 border-l-4 border-l-yellow-400 shadow-lg';
      case 2:
        return 'bg-gradient-to-r from-gray-50 via-slate-50 to-gray-50 dark:from-gray-800/30 dark:via-slate-800/40 dark:to-gray-800/30 border-l-4 border-l-gray-400 shadow-lg';
      case 3:
        return 'bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 dark:from-amber-900/20 dark:via-orange-900/30 dark:to-amber-900/20 border-l-4 border-l-amber-400 shadow-lg';
      default:
        return 'bg-reddit-light-bg dark:bg-reddit-dark-bg-paper border border-reddit-light-border dark:border-reddit-dark-border hover:bg-reddit-light-bg-hover dark:hover:bg-reddit-dark-bg-hover';
    }
  };

  const getRedditAvatar = (username: string) => {
    // Generate a consistent avatar based on username
    const avatarIndex = username.charCodeAt(0) % 10;
    return `https://www.redditstatic.com/avatars/defaults/v2/avatar_default_${avatarIndex}.png`;
  };

  const getFallbackAvatar = (username: string) => {
    // Use username to consistently select a fallback avatar
    const fallbackIndex = username.charCodeAt(0) % fallbackAvatars.length;
    return fallbackAvatars[fallbackIndex];
  };

  const handleAvatarError = (username: string) => {
    setFailedAvatars(prev => new Set(prev).add(username));
  };

  const getAvatarSrc = (username: string) => {
    if (failedAvatars.has(username)) {
      return getFallbackAvatar(username);
    }
    return getRedditAvatar(username);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Reddit-style Header */}
        <div className="text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <h1 className="text-4xl font-bold text-reddit-light-text dark:text-reddit-dark-text mb-4">
              🏆 r/ThoughtPolice Leaderboard
            </h1>
            <div className="flex justify-center items-center space-x-6 mb-6">
              <div className="flex items-center space-x-2 bg-reddit-light-bg-hover dark:bg-reddit-dark-bg-hover px-4 py-2 rounded-full border border-reddit-light-border dark:border-reddit-dark-border">
                <Users className="h-4 w-4 text-reddit-orange" />
                <span className="text-sm font-medium text-reddit-light-text dark:text-reddit-dark-text">25 Active Users</span>
              </div>
              <div className="flex items-center space-x-2 bg-reddit-light-bg-hover dark:bg-reddit-dark-bg-hover px-4 py-2 rounded-full border border-reddit-light-border dark:border-reddit-dark-border">
                <MessageSquare className="h-4 w-4 text-reddit-orange" />
                <span className="text-sm font-medium text-reddit-light-text dark:text-reddit-dark-text">12.4K Total Points</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reddit-style Leaderboard */}
        <div className="bg-reddit-light-bg dark:bg-reddit-dark-bg-paper rounded-lg border border-reddit-light-border dark:border-reddit-dark-border overflow-hidden">
          {/* Header Row */}
          <div className="bg-reddit-light-bg-hover dark:bg-reddit-dark-bg-hover border-b border-reddit-light-border dark:border-reddit-dark-border px-4 py-3">
            <div className="flex items-center justify-between text-sm font-medium text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary uppercase tracking-wide">
              <span>User</span>
              <div className="flex items-center space-x-12">
                <span>Points</span>
                <span>Cases</span>
                <span>Karma</span>
              </div>
            </div>
          </div>

          {/* Leaderboard Entries */}
          <div className="divide-y divide-reddit-light-border dark:divide-reddit-dark-border">
            {leaderboardUsers.map((user, index) => (
              <motion.div
                key={user.username}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`${getRankBackground(user.rank)} transition-all duration-200 group relative cursor-pointer hover:scale-[1.02] hover:shadow-lg`}
                onClick={() => handleUserClick(user)}
              >
                {/* Special badge for top 3 */}
                {user.rank <= 3 && (
                  <div className="absolute top-2 right-2">
                    <Star className="h-4 w-4 text-reddit-orange animate-pulse" />
                  </div>
                )}

                <div className="px-4 py-4 flex items-center justify-between">
                  {/* Left side: Rank, Avatar, and Username - Made Wider */}
                  <div className="flex items-center space-x-6 flex-1 max-w-2xl">
                    {/* Rank */}
                    <div className="flex items-center justify-center w-10 flex-shrink-0">
                      {getRankIcon(user.rank)}
                    </div>

                    {/* Reddit-style upvote indicator */}
                    <div className="flex flex-col items-center space-y-1 flex-shrink-0">
                      <ArrowUp className="h-4 w-4 text-reddit-orange" />
                      <div className="text-xs font-bold text-reddit-orange">
                        {Math.floor(user.points / 10)}
                      </div>
                    </div>

                    {/* Avatar and Username - Expanded */}
                    <div className="flex items-center space-x-5 flex-1 min-w-0">
                      <img
                        src={getAvatarSrc(user.username)}
                        alt={user.username}
                        className="w-12 h-12 rounded-full bg-reddit-light-bg-hover dark:bg-reddit-dark-bg-hover border border-reddit-light-border dark:border-reddit-dark-border flex-shrink-0"
                        onError={() => handleAvatarError(user.username)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 flex-wrap">
                          <span className="font-medium text-reddit-light-text dark:text-reddit-dark-text group-hover:text-reddit-orange transition-colors text-base truncate">
                            u/{user.username}
                          </span>
                          {user.rank <= 3 && (
                            <span className="px-2 py-1 text-xs bg-reddit-orange text-white rounded-full font-medium flex-shrink-0">
                              TOP {user.rank}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary mt-1">
                          Rank #{user.rank} • Active contradiction hunter
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right side: Stats in Reddit-style */}
                  <div className="flex items-center space-x-12">
                    {/* Points */}
                    <div className="text-center min-w-[60px]">
                      <div className="text-lg font-bold text-reddit-orange">
                        {user.points.toLocaleString()}
                      </div>
                      <div className="text-xs text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">
                        pts
                      </div>
                    </div>

                    {/* Cases */}
                    <div className="text-center min-w-[50px]">
                      <div className="text-lg font-bold text-green-600">
                        {user.cases}
                      </div>
                      <div className="text-xs text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">
                        cases
                      </div>
                    </div>

                    {/* Karma */}
                    <div className="text-center min-w-[60px]">
                      <div className="text-lg font-bold text-blue-600">
                        {user.karma.toLocaleString()}
                      </div>
                      <div className="text-xs text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">
                        karma
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Reddit-style Stats Footer */}
        <div className="bg-reddit-light-bg dark:bg-reddit-dark-bg-paper rounded-lg border border-reddit-light-border dark:border-reddit-dark-border p-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-reddit-light-text dark:text-reddit-dark-text">
              📊 Community Stats
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center bg-reddit-light-bg-hover dark:bg-reddit-dark-bg-hover rounded-lg p-4 border border-reddit-light-border dark:border-reddit-dark-border">
              <div className="text-2xl font-bold text-reddit-orange mb-1">25</div>
              <div className="text-sm text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">Active Users</div>
            </div>
            <div className="text-center bg-reddit-light-bg-hover dark:bg-reddit-dark-bg-hover rounded-lg p-4 border border-reddit-light-border dark:border-reddit-dark-border">
              <div className="text-2xl font-bold text-green-600 mb-1">456</div>
              <div className="text-sm text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">Cases Solved</div>
            </div>
            <div className="text-center bg-reddit-light-bg-hover dark:bg-reddit-dark-bg-hover rounded-lg p-4 border border-reddit-light-border dark:border-reddit-dark-border">
              <div className="text-2xl font-bold text-blue-600 mb-1">89%</div>
              <div className="text-sm text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">Avg Accuracy</div>
            </div>
            <div className="text-center bg-reddit-light-bg-hover dark:bg-reddit-dark-bg-hover rounded-lg p-4 border border-reddit-light-border dark:border-reddit-dark-border">
              <div className="text-2xl font-bold text-reddit-orange mb-1">12.4K</div>
              <div className="text-sm text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">Total Points</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3D User Profile Card */}
      <UserProfileCard
        user={selectedUser}
        isOpen={isCardOpen}
        onClose={handleCloseCard}
      />
    </>
  );
};

export default Leaderboard;