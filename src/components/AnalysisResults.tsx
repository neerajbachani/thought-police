import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Calendar, 
  ExternalLink, 
  ThumbsUp, 
  ThumbsDown, 
  TrendingUp,
  Clock,
  MessageSquare,
  Target,
  Eye,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Analysis, Contradiction } from '../lib/types';

interface AnalysisResultsProps {
  analysis: Analysis;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysis }) => {
  const { reportData } = analysis;

  const getConfidenceColor = (score: number) => {
    if (score >= 90) return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
    if (score >= 70) return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
    return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      political: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
      'personal-preference': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
      factual: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
      opinion: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      lifestyle: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
      relationship: 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300',
      technology: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300',
      entertainment: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
  };

  const verifiedCount = reportData.contradictions.filter(c => c.verified).length;
  const humanReviewCount = reportData.contradictions.filter(c => c.requiresHumanReview).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      {/* Analysis Summary */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 border border-slate-200 dark:border-slate-700 transition-colors duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 transition-colors duration-200">Analysis Results</h2>
          <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400 transition-colors duration-200">
            <Clock className="h-4 w-4" />
            <span>{new Date(analysis.analysisDate).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg transition-colors duration-200">
            <div className="flex items-center justify-between">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
              <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                {analysis.contradictionsFound}
              </span>
            </div>
            <p className="text-sm text-red-700 dark:text-red-300 mt-2 transition-colors duration-200">Contradictions Found</p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg transition-colors duration-200">
            <div className="flex items-center justify-between">
              <Target className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {analysis.confidenceScore}%
              </span>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-2 transition-colors duration-200">Avg Confidence</p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg transition-colors duration-200">
            <div className="flex items-center justify-between">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                {verifiedCount}
              </span>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300 mt-2 transition-colors duration-200">Verified</p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg transition-colors duration-200">
            <div className="flex items-center justify-between">
              <Eye className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {humanReviewCount}
              </span>
            </div>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-2 transition-colors duration-200">Needs Review</p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg transition-colors duration-200">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-3 transition-colors duration-200">Executive Summary</h3>
          <p className="text-slate-700 dark:text-slate-300 transition-colors duration-200">{reportData.summary}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-200">Top Subreddits:</span>
            {reportData.stats.topSubreddits.map((sub, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded text-sm transition-colors duration-200"
              >
                r/{sub}
              </span>
            ))}
          </div>
        </div>

        {/* Quality Indicators */}
        {(verifiedCount > 0 || humanReviewCount > 0) && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {verifiedCount > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800 transition-colors duration-200">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="font-medium text-green-800 dark:text-green-200 transition-colors duration-200">High Confidence Findings</span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1 transition-colors duration-200">
                  {verifiedCount} contradictions verified with 80%+ confidence and clear evidence
                </p>
              </div>
            )}
            
            {humanReviewCount > 0 && (
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800 transition-colors duration-200">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <span className="font-medium text-amber-800 dark:text-amber-200 transition-colors duration-200">Complex Context Detected</span>
                </div>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1 transition-colors duration-200">
                  {humanReviewCount} findings require human review due to nuanced context
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Contradictions List */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 transition-colors duration-200">Detailed Contradictions</h3>
        {reportData.contradictions.map((contradiction, index) => (
          <ContradictionCard key={contradiction.id} contradiction={contradiction} index={index} />
        ))}
      </div>
    </motion.div>
  );
};

interface ContradictionCardProps {
  contradiction: Contradiction;
  index: number;
}

const ContradictionCard: React.FC<ContradictionCardProps> = ({ contradiction, index }) => {
  const getConfidenceColor = (score: number) => {
    if (score >= 90) return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
    if (score >= 70) return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
    return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      political: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
      'personal-preference': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
      factual: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
      opinion: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      lifestyle: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
      relationship: 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300',
      technology: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300',
      entertainment: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border-2 hover:shadow-xl transition-all duration-200 ${
        contradiction.requiresHumanReview ? 'border-amber-200 dark:border-amber-800' : 
        contradiction.verified ? 'border-green-200 dark:border-green-800' : 'border-slate-200 dark:border-slate-700'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full transition-colors duration-200">
            <span className="text-red-600 dark:text-red-400 font-bold text-sm">#{index + 1}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${getCategoryColor(contradiction.category)}`}>
              {contradiction.category.replace('-', ' ')}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${getConfidenceColor(contradiction.confidenceScore)}`}>
              {contradiction.confidenceScore}% confidence
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400 transition-colors duration-200">
          <div className="flex items-center space-x-1">
            <ThumbsUp className="h-4 w-4" />
            <span>{contradiction.upvotes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <ThumbsDown className="h-4 w-4" />
            <span>{contradiction.downvotes}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg transition-colors duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-red-700 dark:text-red-300 transition-colors duration-200">Earlier Statement</span>
            <div className="flex items-center space-x-2 text-xs text-red-600 dark:text-red-400 transition-colors duration-200">
              <Calendar className="h-3 w-3" />
              <span>{new Date(contradiction.dates[0]).toLocaleDateString()}</span>
              <span>r/{contradiction.subreddits[0]}</span>
            </div>
          </div>
          <p className="text-slate-800 dark:text-slate-100 italic transition-colors duration-200">"{contradiction.statement1}"</p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg transition-colors duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300 transition-colors duration-200">Later Statement</span>
            <div className="flex items-center space-x-2 text-xs text-blue-600 dark:text-blue-400 transition-colors duration-200">
              <Calendar className="h-3 w-3" />
              <span>{new Date(contradiction.dates[1]).toLocaleDateString()}</span>
              <span>r/{contradiction.subreddits[1]}</span>
            </div>
          </div>
          <p className="text-slate-800 dark:text-slate-100 italic transition-colors duration-200">"{contradiction.statement2}"</p>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg transition-colors duration-200">
        <h4 className="font-medium text-slate-800 dark:text-slate-100 mb-2 transition-colors duration-200">Analysis Context</h4>
        <p className="text-slate-700 dark:text-slate-300 text-sm transition-colors duration-200">{contradiction.context}</p>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 transition-colors duration-200">
        <div className="flex items-center space-x-2">
          {contradiction.verified && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 transition-colors duration-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Verified
            </span>
          )}
          {contradiction.requiresHumanReview && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 transition-colors duration-200">
              <Eye className="h-3 w-3 mr-1" />
              Needs Review
            </span>
          )}
        </div>
        
        <button className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-200">
          <ExternalLink className="h-4 w-4" />
          <span>View on Reddit</span>
        </button>
      </div>
    </motion.div>
  );
};

export default AnalysisResults;