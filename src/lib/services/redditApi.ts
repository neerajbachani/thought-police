import axios from 'axios';
import axiosRetry from 'axios-retry';

export interface RedditComment {
  id: string;
  body: string;
  created_utc: number;
  subreddit: string;
  score: number;
  permalink: string;
  author: string;
  link_title?: string;
}

export interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  created_utc: number;
  subreddit: string;
  score: number;
  permalink: string;
  author: string;
  num_comments: number;
}

export interface RedditUser {
  name: string;
  created_utc: number;
  comment_karma: number;
  link_karma: number;
  total_karma: number;
  verified: boolean;
  is_gold: boolean;
  is_mod: boolean;
}

interface FetchOptions {
  maxItems?: number;
  maxAge?: number; // days
  verbose?: boolean;
}

class RedditApiService {
  private baseUrl = 'https://www.reddit.com'
  private axiosInstance;
  private verbose = false;

  constructor() {
    this.axiosInstance = axios.create({
      timeout: 30000,
    });

    // Enhanced retry configuration
    axiosRetry(this.axiosInstance, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
        return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
               error.code === 'ECONNRESET' ||
               error.code === 'ENOTFOUND' ||
               error.code === 'ECONNABORTED' ||
               error.message.includes('socket hang up') ||
               error.response?.status === 503 || // Reddit overload
               error.response?.status === 502 || // Bad gateway
               error.response?.status === 504;   // Gateway timeout
      },
      onRetry: (retryCount, error, requestConfig) => {
        if (this.verbose) {
          console.log(`Retrying request (attempt ${retryCount}):`, requestConfig.url);
        }
      },
    });
  }

  setVerbose(verbose: boolean) {
    this.verbose = verbose;
  }

  private debug(...args: any[]) {
    if (this.verbose) {
      console.log('[RedditAPI]', ...args);
    }
  }

  private async makeRequest(url: string, source: 'reddit' = 'reddit'): Promise<any> {
    try {
      this.debug('Making request to:', url);
      const response = await this.axiosInstance.get(url);
      this.debug('Request successful:', { url, status: response.status });
      return response.data;
    } catch (error) {
      this.debug('Request failed:', { url, error: error instanceof Error ? error.message : 'Unknown error' });
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error('User not found');
        } else if (error.response?.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        } else if (error.response?.status === 503) {
          throw new Error('Service temporarily unavailable. Please try again later.');
        } else if (error.response?.status && error.response.status >= 500) {
          throw new Error(`Server error occurred (${error.response.status}). Please try again.`);
        } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          throw new Error('Request timeout. Please try again.');
        }
      }
      throw new Error(`Failed to fetch data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Streaming iterator for Reddit comments (Reddit API only)
  async* iterateComments(username: string, options: FetchOptions = {}): AsyncGenerator<RedditComment[], void, unknown> {
    const { maxItems = 10000, maxAge = 365 } = options;
    let totalFetched = 0;
    let after: string | null = null;
    let before: string | null = null;
    const cutoffDate = Date.now() / 1000 - (maxAge * 24 * 60 * 60);

    this.debug(`Starting Reddit comment iteration for ${username}, max: ${maxItems}, maxAge: ${maxAge} days`);

    // Use Reddit official API only
    let requestCount = 0;
    const maxRequests = 50; // Limit to prevent infinite loops

    while (totalFetched < maxItems && requestCount < maxRequests) {
      try {
        let url = `${this.baseUrl}/user/${username}/comments.json?limit=100&sort=new`;
        if (after) {
          url += `&after=${after}`;
        }
        if (before) {
          url += `&before=${before}`;
        }

        const data = await this.makeRequest(url, 'reddit');
        
        if (!data.data || !data.data.children || data.data.children.length === 0) {
          this.debug('No more comments from Reddit API');
          break;
        }

        const batch = data.data.children
          .map((child: any) => child.data)
          .filter((comment: any) => {
            return comment.body && 
                   comment.body !== '[deleted]' && 
                   comment.body !== '[removed]' &&
                   comment.body.length > 20 &&
                   comment.created_utc >= cutoffDate;
          })
          .map((comment: any) => ({
            id: comment.id,
            body: comment.body,
            created_utc: comment.created_utc,
            subreddit: comment.subreddit,
            score: comment.score,
            permalink: comment.permalink,
            author: comment.author,
            link_title: comment.link_title,
          }));

        if (batch.length > 0) {
          yield batch;
          totalFetched += batch.length;
          this.debug(`Reddit batch yielded: ${batch.length}, total: ${totalFetched}`);
        }

        // Update pagination
        after = data.data.after;
        before = data.data.before;
        
        if (!after && !before) {
          this.debug('Reddit pagination complete - no more pages');
          break;
        }

        requestCount++;
        await this.delay(1000); // Rate limiting
      } catch (error) {
        this.debug('Reddit API error:', error instanceof Error ? error.message : 'Unknown error');
        break;
      }
    }

    this.debug(`Comment iteration complete: ${totalFetched} total comments, ${requestCount} requests made`);
  }

  // Streaming iterator for posts
  async* iteratePosts(username: string, options: FetchOptions = {}): AsyncGenerator<RedditPost[], void, unknown> {
    const { maxItems = 2000, maxAge = 365 } = options;
    let totalFetched = 0;
    let after: string | null = null;
    const cutoffDate = Date.now() / 1000 - (maxAge * 24 * 60 * 60);

    this.debug(`Starting Reddit post iteration for ${username}, max: ${maxItems}`);

    let requestCount = 0;
    const maxRequests = 20; // Posts are typically less numerous

    while (totalFetched < maxItems && requestCount < maxRequests) {
      try {
        let url = `${this.baseUrl}/user/${username}/submitted.json?limit=100&sort=new`;
        if (after) {
          url += `&after=${after}`;
        }

        const data = await this.makeRequest(url, 'reddit');
        
        if (!data.data || !data.data.children || data.data.children.length === 0) {
          this.debug('No more posts from Reddit API');
          break;
        }

        const batch = data.data.children
          .map((child: any) => child.data)
          .filter((post: any) => {
            return post.selftext && 
                   post.selftext !== '[deleted]' && 
                   post.selftext !== '[removed]' &&
                   post.selftext.length > 20 &&
                   post.created_utc >= cutoffDate;
          })
          .map((post: any) => ({
            id: post.id,
            title: post.title,
            selftext: post.selftext,
            created_utc: post.created_utc,
            subreddit: post.subreddit,
            score: post.score,
            permalink: post.permalink,
            author: post.author,
            num_comments: post.num_comments,
          }));

        if (batch.length > 0) {
          yield batch;
          totalFetched += batch.length;
          this.debug(`Reddit post batch yielded: ${batch.length}, total: ${totalFetched}`);
        }

        after = data.data.after;
        if (!after) {
          this.debug('Reddit post pagination complete');
          break;
        }

        requestCount++;
        await this.delay(1000);
      } catch (error) {
        this.debug('Posts API error:', error instanceof Error ? error.message : 'Unknown error');
        break;
      }
    }

    this.debug(`Post iteration complete: ${totalFetched} total posts, ${requestCount} requests made`);
  }

  // User info method
  async getUserInfo(username: string): Promise<RedditUser> {
    const url = `${this.baseUrl}/user/${username}/about.json`;
    this.debug('Fetching user info for:', username);
    const data = await this.makeRequest(url, 'reddit');
    
    if (!data.data) {
      throw new Error('User not found');
    }

    return {
      name: data.data.name,
      created_utc: data.data.created_utc,
      comment_karma: data.data.comment_karma,
      link_karma: data.data.link_karma,
      total_karma: data.data.total_karma,
      verified: data.data.verified,
      is_gold: data.data.is_gold,
      is_mod: data.data.is_mod,
    };
  }

  // Legacy method for compatibility
  async getUserComments(username: string, maxComments: number = 5000): Promise<RedditComment[]> {
    const comments: RedditComment[] = [];
    
    for await (const batch of this.iterateComments(username, { maxItems: maxComments })) {
      comments.push(...batch);
      if (comments.length >= maxComments) break;
    }
    
    return comments.slice(0, maxComments);
  }

  // Legacy method for compatibility
  async getUserPosts(username: string, maxPosts: number = 2000): Promise<RedditPost[]> {
    const posts: RedditPost[] = [];
    
    for await (const batch of this.iteratePosts(username, { maxItems: maxPosts })) {
      posts.push(...batch);
      if (posts.length >= maxPosts) break;
    }
    
    return posts.slice(0, maxPosts);
  }

  // Get full user data
  async getFullUserData(username: string, options: FetchOptions = {}): Promise<{
    user: RedditUser;
    comments: RedditComment[];
    posts: RedditPost[];
  }> {
    try {
      this.debug('Fetching comprehensive user data for:', username);
      
      // Fetch user info first
      const user = await this.getUserInfo(username);
      
      // Stream all content
      const comments: RedditComment[] = [];
      const posts: RedditPost[] = [];

      // Collect comments
      for await (const batch of this.iterateComments(username, options)) {
        comments.push(...batch);
        if (comments.length >= (options.maxItems || 5000)) break;
      }

      // Collect posts
      for await (const batch of this.iteratePosts(username, options)) {
        posts.push(...batch);
        if (posts.length >= 1000) break;
      }

      this.debug('Comprehensive data complete:', {
        username,
        comments: comments.length,
        posts: posts.length,
        totalContent: comments.length + posts.length
      });

      return { user, comments, posts };
    } catch (error) {
      this.debug('Failed to fetch comprehensive user data:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  // Get user preview
  async getUserPreview(username: string): Promise<{
    exists: boolean;
    karma: number;
    accountAge: string;
    recentActivity: boolean;
    estimatedComments: number;
  }> {
    try {
      const user = await this.getUserInfo(username);
      
      // Get a small sample to check for recent activity
      const sampleComments: RedditComment[] = [];
      let batchCount = 0;
      
      for await (const batch of this.iterateComments(username, { maxItems: 20 })) {
        sampleComments.push(...batch);
        batchCount++;
        if (batchCount >= 1) break; // Just first batch for preview
      }
      
      const accountAge = Math.floor((Date.now() / 1000 - user.created_utc) / (24 * 60 * 60));
      const ageString = accountAge < 30 ? `${accountAge} days` : 
                       accountAge < 365 ? `${Math.floor(accountAge / 30)} months` : 
                       `${Math.floor(accountAge / 365)} years`;

      // Better estimation based on karma and account age
      const dailyKarma = user.comment_karma / Math.max(accountAge, 1);
      const estimatedComments = Math.min(Math.max(dailyKarma * 2, 100), 8000);

      return {
        exists: true,
        karma: user.total_karma,
        accountAge: ageString,
        recentActivity: sampleComments.length > 0,
        estimatedComments: Math.floor(estimatedComments)
      };
    } catch {
      return {
        exists: false,
        karma: 0,
        accountAge: 'Unknown',
        recentActivity: false,
        estimatedComments: 0
      };
    }
  }

  // Check if user exists
  async userExists(username: string): Promise<boolean> {
    try {
      await this.getUserInfo(username);
      return true;
    } catch {
      return false;
    }
  }

  // Get subreddit info (bonus method)
  async getSubredditInfo(subreddit: string): Promise<any> {
    try {
      const url = `${this.baseUrl}/r/${subreddit}/about.json`;
      const data = await this.makeRequest(url, 'reddit');
      return data.data;
    } catch (error) {
      this.debug('Failed to fetch subreddit info:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.axiosInstance.get(`${this.baseUrl}/r/test.json`, { timeout: 5000 });
      return response.status === 200;
    } catch {
      return false;
    }
  }
}

export const redditApi = new RedditApiService();