import { cacheService } from './cacheService';
import { tokenBudget } from './tokenBudget';
import { Analysis } from '../types';

export class AnalysisService {
  private verbose = false;

  setVerbose(verbose: boolean) {
    this.verbose = verbose;
  }

  private debug(...args: any[]) {
    if (this.verbose) {
      console.log('[AnalysisService]', ...args);
    }
  }

  async analyzeUser(username: string, analyzerUserId: string = '1'): Promise<Analysis> {
    try {
      // Validate username
      if (!username || username.trim().length === 0) {
        throw new Error('Username is required');
      }

      const cleanUsername = username.trim().replace(/^u\//, '');
      this.debug(`Starting analysis for ${cleanUsername} via server API`);

      // Check budget status
      const budgetStatus = tokenBudget.getBudgetStatus();
      this.debug('Budget status:', budgetStatus);

      if (budgetStatus.isWarning) {
        console.warn(`Budget warning: ${budgetStatus.percentage.toFixed(1)}% used`);
      }

      // Call server-side API for analysis
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: cleanUsername,
          verbose: this.verbose 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Analysis failed with status ${response.status}`);
      }

      const reportData = await response.json();
      
      // Create analysis result
      const analysis: Analysis = {
        id: `analysis-${Date.now()}-${cleanUsername}`,
        targetUsername: cleanUsername,
        analyzerUserId,
        contradictionsFound: reportData.contradictions?.length || 0,
        confidenceScore: this.calculateWeightedConfidence(reportData.contradictions || []),
        analysisDate: new Date().toISOString(),
        reportData,
        status: 'completed'
      };

      this.debug(`Analysis complete for ${cleanUsername}:`, {
        contradictionsFound: analysis.contradictionsFound,
        weightedConfidence: analysis.confidenceScore,
        status: analysis.status
      });
      
      return analysis;

    } catch (error) {
      this.debug('Analysis failed:', error);
      
      // Return failed analysis with error info
      return {
        id: `analysis-failed-${Date.now()}`,
        targetUsername: username,
        analyzerUserId,
        contradictionsFound: 0,
        confidenceScore: 0,
        analysisDate: new Date().toISOString(),
        reportData: {
          summary: `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
          contradictions: [],
          timeline: [],
          stats: {
            totalComments: 0,
            timespan: '0 days',
            topSubreddits: [],
            sentimentTrend: 0
          }
        },
        status: 'failed'
      };
    }
  }

  private calculateWeightedConfidence(contradictions: any[]): number {
    if (contradictions.length === 0) return 0;

    // Weight by recency and verification status
    let totalWeight = 0;
    let weightedSum = 0;

    for (const contradiction of contradictions) {
      let weight = 1;
      
      // Higher weight for verified contradictions
      if (contradiction.verified) {
        weight *= 1.5;
      }
      
      // Higher weight for recent contradictions
      if (contradiction.dates && contradiction.dates.length >= 2) {
        const dates = contradiction.dates.map((d: string) => new Date(d).getTime());
        const avgDate = (dates[0] + dates[1]) / 2;
        const ageInDays = (Date.now() - avgDate) / (24 * 60 * 60 * 1000);
        
        if (ageInDays < 30) {
          weight *= 1.3; // Recent contradictions are more significant
        } else if (ageInDays > 365) {
          weight *= 0.8; // Older contradictions less significant
        }
      }
      
      // Weight by confidence score
      const confidenceScore = contradiction.confidenceScore || 50;
      weight *= (confidenceScore / 100);
      
      weightedSum += confidenceScore * weight;
      totalWeight += weight;
    }

    return Math.round(weightedSum / totalWeight);
  }

  async validateUsername(username: string): Promise<boolean> {
    try {
      const cleanUsername = username.trim().replace(/^u\//, '');
      const response = await fetch(`/api/reddit/user/${cleanUsername}/about.json`);
      return response.ok;
    } catch {
      return false;
    }
  }

  async getUserPreview(username: string): Promise<{
    exists: boolean;
    karma: number;
    accountAge: string;
    recentActivity: boolean;
    estimatedComments: number;
  }> {
    try {
      const cleanUsername = username.trim().replace(/^u\//, '');
      
      // Get user info
      const userResponse = await fetch(`/api/reddit/user/${cleanUsername}/about.json`);
      if (!userResponse.ok) {
        return {
          exists: false,
          karma: 0,
          accountAge: 'Unknown',
          recentActivity: false,
          estimatedComments: 0
        };
      }

      const userData = await userResponse.json();
      const user = userData.data;
      
      // Get a small sample of comments to check for recent activity
      const commentsResponse = await fetch(`/api/reddit/user/${cleanUsername}/comments.json?limit=5`);
      const commentsData = commentsResponse.ok ? await commentsResponse.json() : null;
      const hasRecentActivity = commentsData?.data?.children?.length > 0;

      const accountAge = Math.floor((Date.now() / 1000 - user.created_utc) / (24 * 60 * 60));
      const ageString = accountAge < 30 ? `${accountAge} days` : 
                       accountAge < 365 ? `${Math.floor(accountAge / 30)} months` : 
                       `${Math.floor(accountAge / 365)} years`;

      // Better estimation based on karma and account age
      const dailyKarma = user.comment_karma / Math.max(accountAge, 1);
      const estimatedComments = Math.min(Math.max(dailyKarma * 2, 100), 8000);

      return {
        exists: true,
        karma: user.total_karma || 0,
        accountAge: ageString,
        recentActivity: hasRecentActivity,
        estimatedComments: Math.floor(estimatedComments)
      };
    } catch (error) {
      this.debug('getUserPreview failed:', error);
      return {
        exists: false,
        karma: 0,
        accountAge: 'Unknown',
        recentActivity: false,
        estimatedComments: 0
      };
    }
  }

  // Enhanced cache management
  clearUserCache(username: string): void {
    const cleanUsername = username.trim().replace(/^u\//, '');
    cacheService.clearAnalysis(cleanUsername);
  }

  getCacheStats() {
    return cacheService.getStats();
  }

  getBudgetStats() {
    return {
      budget: tokenBudget.getBudgetStatus(),
      usage: tokenBudget.getUsageStats()
    };
  }

  resetBudget(): void {
    tokenBudget.resetBudget();
  }

  setBudget(maxDollar: number, warningThreshold: number = 80): void {
    tokenBudget.setBudget({ maxDollar, warningThreshold });
  }

  // Debug and monitoring methods
  getDebugInfo() {
    return {
      cache: cacheService.getDebugInfo(),
      budget: this.getBudgetStats(),
      verbose: this.verbose
    };
  }

  // Streaming analysis for large datasets
  async* analyzeUserStream(username: string): AsyncGenerator<{
    stage: string;
    progress: number;
    data?: any;
  }, void, unknown> {
    const cleanUsername = username.trim().replace(/^u\//, '');
    
    yield { stage: 'validation', progress: 0 };
    
    try {
      // Validate user
      const isValid = await this.validateUsername(cleanUsername);
      if (!isValid) {
        throw new Error('User not found');
      }
      
      yield { stage: 'validation', progress: 100 };
      
      // Get user preview
      yield { stage: 'fetching', progress: 0 };
      const preview = await this.getUserPreview(cleanUsername);
      yield { stage: 'fetching', progress: 50, data: preview };
      
      // Perform analysis
      yield { stage: 'analyzing', progress: 0 };
      const analysis = await this.analyzeUser(cleanUsername);
      yield { stage: 'analyzing', progress: 100, data: analysis.reportData };
      
      // Complete
      yield { stage: 'complete', progress: 100, data: analysis.reportData };
      
    } catch (error) {
      yield { stage: 'error', progress: 0, data: { error: error instanceof Error ? error.message : 'Unknown error' } };
    }
  }

  // Batch analysis for multiple users
  async analyzeBatch(usernames: string[]): Promise<Analysis[]> {
    const results: Analysis[] = [];
    
    for (const username of usernames) {
      try {
        const analysis = await this.analyzeUser(username);
        results.push(analysis);
        
        // Add delay between analyses to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        this.debug(`Batch analysis failed for ${username}:`, error);
        // Continue with other users even if one fails
      }
    }
    
    return results;
  }

  // Get cached analysis if available
  getCachedAnalysis(username: string): Analysis | null {
    const cleanUsername = username.trim().replace(/^u\//, '');
    
    // This would need to be implemented based on your cache structure
    // For now, return null to indicate no cached analysis
    return null;
  }

  // Health check for the analysis service
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    services: {
      reddit: boolean;
      openrouter: boolean;
      cache: boolean;
    };
    budget: any;
  }> {
    const services = {
      reddit: false,
      openrouter: false,
      cache: true // Cache is always available locally
    };

    // Test Reddit API
    try {
      const response = await fetch('/api/reddit/r/test.json', { method: 'HEAD' });
      services.reddit = response.ok;
    } catch {
      services.reddit = false;
    }

    // Test OpenRouter (would need a test endpoint)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'test', healthCheck: true })
      });
      services.openrouter = response.status !== 500;
    } catch {
      services.openrouter = false;
    }

    const budget = this.getBudgetStats();
    const healthyServices = Object.values(services).filter(Boolean).length;
    
    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (healthyServices === 3) {
      status = 'healthy';
    } else if (healthyServices >= 2) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }

    return {
      status,
      services,
      budget
    };
  }
}

export const analysisService = new AnalysisService();