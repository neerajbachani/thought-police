interface CacheEntry {
  data: any;
  timestamp: number;
  expiresAt: number;
  contentHash: string;
  version: string;
}

interface CacheStats {
  totalEntries: number;
  validEntries: number;
  expiredEntries: number;
  totalSize: number;
  hitRate: number;
}

class CacheService {
  private cache = new Map<string, CacheEntry>();
  private readonly DEFAULT_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days
  private readonly CACHE_VERSION = '2.0';
  private readonly MAX_CACHE_SIZE = 50;
  private hits = 0;
  private misses = 0;
  private isClient = typeof window !== 'undefined';

  constructor() {
    // Only load from storage on client-side
    if (this.isClient) {
      this.loadFromStorage();
      this.setupPeriodicCleanup();
    }
  }

  private loadFromStorage(): void {
    if (!this.isClient) return;
    
    try {
      const stored = localStorage.getItem('thoughtPoliceCache');
      if (stored) {
        const data = JSON.parse(stored);
        
        // Validate cache version
        if (data.version !== this.CACHE_VERSION) {
          console.log('Cache version mismatch, clearing cache');
          this.clearAll();
          return;
        }

        // Load entries
        if (data.entries) {
          for (const [key, entry] of Object.entries(data.entries)) {
            this.cache.set(key, entry as CacheEntry);
          }
        }

        console.log(`Loaded ${this.cache.size} cache entries from storage`);
        this.cleanupExpired();
      }
    } catch (error) {
      console.warn('Failed to load cache from storage:', error);
      this.clearAll();
    }
  }

  private saveToStorage(): void {
    if (!this.isClient) return;
    
    const data = {
      version: this.CACHE_VERSION,
      entries: Object.fromEntries(this.cache.entries()),
      lastSaved: Date.now()
    };
    
    try {
      localStorage.setItem('thoughtPoliceCache', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save cache to storage:', error);
      
      // If storage is full, try to free up space
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        this.evictOldest(Math.floor(this.cache.size / 2));
        try {
          localStorage.setItem('thoughtPoliceCache', JSON.stringify(data));
        } catch {
          console.warn('Cache storage still full after eviction');
        }
      }
    }
  }

  private setupPeriodicCleanup(): void {
    // Clean up expired entries every 10 minutes
    setInterval(() => {
      this.cleanupExpired();
    }, 10 * 60 * 1000);
  }

  private generateContentHash(comments: any[], posts: any[]): string {
    // Create a hash based on the latest content timestamps
    const latestComment = comments.length > 0 ? Math.max(...comments.map(c => c.created_utc)) : 0;
    const latestPost = posts.length > 0 ? Math.max(...posts.map(p => p.created_utc)) : 0;
    const latest = Math.max(latestComment, latestPost);
    
    // Include content count for additional validation
    const contentSignature = `${latest}-${comments.length}-${posts.length}`;
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < contentSignature.length; i++) {
      const char = contentSignature.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36);
  }

  private getAnalysisKey(username: string, contentHash: string): string {
    return `analysis:${username.toLowerCase()}:${contentHash}`;
  }

  private evictOldest(count: number): void {
    const entries = Array.from(this.cache.entries())
      .sort(([,a], [,b]) => a.timestamp - b.timestamp);
    
    for (let i = 0; i < Math.min(count, entries.length); i++) {
      this.cache.delete(entries[i][0]);
    }
    
    console.log(`Evicted ${Math.min(count, entries.length)} oldest cache entries`);
  }

  private cleanupExpired(): void {
    const now = Date.now();
    let cleanedCount = 0;
    
    this.cache.forEach((entry, key) => {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        cleanedCount++;
      }
    });
    
    if (cleanedCount > 0) {
      console.log(`Cleaned up ${cleanedCount} expired cache entries`);
      this.saveToStorage();
    }
  }

  setAnalysis(username: string, data: any, comments: any[] = [], posts: any[] = [], ttl: number = this.DEFAULT_TTL): void {
    const contentHash = this.generateContentHash(comments, posts);
    const key = this.getAnalysisKey(username, contentHash);
    
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
      contentHash,
      version: this.CACHE_VERSION
    };
    
    // Enforce cache size limit
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.evictOldest(1);
    }
    
    this.cache.set(key, entry);
    console.log(`Cached analysis for user: ${username}, hash: ${contentHash}`);
    
    this.saveToStorage();
  }

  getAnalysis(username: string, comments: any[] = [], posts: any[] = []): any | null {
    const contentHash = this.generateContentHash(comments, posts);
    const key = this.getAnalysisKey(username, contentHash);
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.misses++;
      return null;
    }
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.misses++;
      this.saveToStorage();
      return null;
    }
    
    this.hits++;
    return entry.data;
  }

  hasValidAnalysis(username: string, comments: any[] = [], posts: any[] = []): boolean {
    return this.getAnalysis(username, comments, posts) !== null;
  }

  clearAnalysis(username: string): void {
    const userKeys = Array.from(this.cache.keys()).filter(k => 
      k.startsWith(`analysis:${username.toLowerCase()}:`)
    );
    
    userKeys.forEach(key => this.cache.delete(key));
    console.log(`Cleared ${userKeys.length} cache entries for user: ${username}`);
    this.saveToStorage();
  }

  clearAll(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
    console.log('Cleared all cached analyses');
    this.saveToStorage();
  }

  getStats(): CacheStats {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;
    let totalSize = 0;
    
    this.cache.forEach(entry => {
      if (now <= entry.expiresAt) {
        validEntries++;
      } else {
        expiredEntries++;
      }
      totalSize += JSON.stringify(entry).length;
    });
    
    const totalRequests = this.hits + this.misses;
    const hitRate = totalRequests > 0 ? (this.hits / totalRequests) * 100 : 0;
    
    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
      totalSize,
      hitRate
    };
  }

  getDebugInfo(): Array<{
    key: string;
    username: string;
    contentHash: string;
    age: string;
    size: number;
    isExpired: boolean;
  }> {
    const now = Date.now();
    
    return Array.from(this.cache.entries()).map(([key, entry]) => {
      const parts = key.split(':');
      const username = parts[1] || 'unknown';
      const contentHash = parts[2] || 'unknown';
      const ageMs = now - entry.timestamp;
      const age = ageMs < 60000 ? `${Math.round(ageMs / 1000)}s` :
                  ageMs < 3600000 ? `${Math.round(ageMs / 60000)}m` :
                  `${Math.round(ageMs / 3600000)}h`;
      
      return {
        key,
        username,
        contentHash,
        age,
        size: JSON.stringify(entry).length,
        isExpired: now > entry.expiresAt
      };
    }).sort((a, b) => a.username.localeCompare(b.username));
  }
}

export const cacheService = new CacheService();