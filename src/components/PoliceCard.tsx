import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Star, QrCode } from 'lucide-react';


import { User } from '@/lib/types';
import { rankInfo } from '@/lib/data/mockData';

interface PoliceCardProps {
  user: User;
  className?: string;
}

const PoliceCard: React.FC<PoliceCardProps> = ({ user, className = '' }) => {
  const rank = rankInfo[user.rank];
  const badgeNumber = `TP${user.id.padStart(6, '0')}`;
  const issueDate = new Date(user.joinDate).toLocaleDateString();
  const expireDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString();

  return (
    <motion.div
      initial={{ opacity: 0, rotateY: -180 }}
      animate={{ opacity: 1, rotateY: 0 }}
      transition={{ duration: 0.8, type: "spring" }}
      className={`relative perspective-1000 ${className}`}
    >
      <div className="relative w-96 h-72 mx-auto">
        {/* Card Background - Adaptive for light/dark mode */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-black dark:from-slate-700 dark:via-slate-800 dark:to-slate-900 rounded-2xl shadow-2xl transform-gpu transition-colors duration-200">
          <div className="absolute inset-0 bg-gradient-to-br from-reddit-blue/20 via-reddit-orange/20 to-yellow-600/20 dark:from-reddit-blue/30 dark:via-reddit-orange/30 dark:to-yellow-600/30 rounded-2xl animate-pulse transition-colors duration-200"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,121,211,0.1),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(0,121,211,0.2),transparent_70%)] rounded-2xl transition-colors duration-200"></div>
        </div>

        {/* Holographic Overlay - Enhanced for dark mode */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 dark:via-white/10 to-transparent transform -skew-x-12 animate-shimmer rounded-2xl transition-colors duration-200"></div>

        {/* Card Content - Always light text on dark background for authenticity */}
        <div className="relative z-10 p-5 h-full flex flex-col text-white">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-reddit-orange drop-shadow-lg" />
              <span className="text-xs font-bold text-reddit-orange drop-shadow-md">THOUGHT POLICE</span>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-300 dark:text-slate-200 transition-colors duration-200">BADGE #</div>
              <div className="text-sm font-bold text-reddit-orange drop-shadow-md">{badgeNumber}</div>
            </div>
          </div>

          {/* Officer Info */}
          <div className="flex items-center space-x-3 mb-3">
            <div className="relative flex-shrink-0">
              <img
                src={user.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=2'}
                alt={user.redditUsername}
                className="w-14 h-14 rounded-full border-2 border-reddit-orange shadow-lg ring-2 ring-white/20"
              />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-reddit-orange rounded-full flex items-center justify-center shadow-lg">
                <Star className="h-2.5 w-2.5 text-white drop-shadow-sm" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-base font-bold text-white drop-shadow-md truncate">Officer {user.redditUsername}</div>
              <div className="text-sm text-slate-300 dark:text-slate-200 transition-colors duration-200 truncate" style={{ color: rank.color }}>
                {rank.name}
              </div>
              <div className="text-xs text-slate-400 dark:text-slate-300 transition-colors duration-200 truncate">
                Accuracy: {user.accuracyRate}% • Cases: {user.casesSolved}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-3 flex-1">
            <div className="text-center bg-black/20 dark:bg-black/30 rounded-lg p-2 backdrop-blur-sm transition-colors duration-200">
              <div className="text-base font-bold text-reddit-orange drop-shadow-md">{user.totalPoints}</div>
              <div className="text-xs text-slate-400 dark:text-slate-300 transition-colors duration-200">Points</div>
            </div>
            <div className="text-center bg-black/20 dark:bg-black/30 rounded-lg p-2 backdrop-blur-sm transition-colors duration-200">
              <div className="text-base font-bold text-reddit-orange drop-shadow-md">{user.badgeCount}</div>
              <div className="text-xs text-slate-400 dark:text-slate-300 transition-colors duration-200">Badges</div>
            </div>
            <div className="text-center bg-black/20 dark:bg-black/30 rounded-lg p-2 backdrop-blur-sm transition-colors duration-200">
              <div className="text-base font-bold text-green-400 drop-shadow-md">{user.casesSolved}</div>
              <div className="text-xs text-slate-400 dark:text-slate-300 transition-colors duration-200">Cases</div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-end justify-between mt-auto">
            <div className="text-xs text-slate-400 dark:text-slate-300 transition-colors duration-200">
              <div>Issued: {issueDate}</div>
              <div>Expires: {expireDate}</div>
            </div>
            <div className="flex items-center space-x-2">
              <QrCode className="h-6 w-6 text-slate-400 dark:text-slate-300 transition-colors duration-200" />
              <div className="text-xs text-slate-400 dark:text-slate-300 text-right transition-colors duration-200">
                <div>DEPT. OF</div>
                <div>DIGITAL TRUTH</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements - Enhanced for dark mode */}
        <div className="absolute top-4 right-4 w-6 h-6 border-2 border-reddit-orange/30 dark:border-reddit-orange/50 rounded-full animate-ping transition-colors duration-200"></div>
        <div className="absolute bottom-4 left-4 w-4 h-4 border border-reddit-blue/30 dark:border-reddit-blue/50 rounded-full animate-pulse transition-colors duration-200"></div>
        
        {/* Additional glow effects for dark mode */}
        <div className="absolute top-2 left-2 w-3 h-3 bg-reddit-orange/20 dark:bg-reddit-orange/40 rounded-full blur-sm animate-pulse transition-colors duration-200"></div>
        <div className="absolute bottom-2 right-2 w-2 h-2 bg-reddit-blue/20 dark:bg-reddit-blue/40 rounded-full blur-sm animate-pulse transition-colors duration-200"></div>
      </div>
    </motion.div>
  );
};

export default PoliceCard;