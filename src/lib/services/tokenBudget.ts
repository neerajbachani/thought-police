interface ModelPricing {
  inputTokens: number;  // per 1M tokens
  outputTokens: number; // per 1M tokens
}

interface BudgetConfig {
  maxDollar: number;
  warningThreshold: number; // percentage (e.g., 80 for 80%)
}

interface BudgetUsage {
  model: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  timestamp: number;
}

class TokenBudgetService {
  private budget: BudgetConfig;
  private usage: BudgetUsage[] = [];
  private modelPricing: Record<string, ModelPricing> = {
    // Free models (estimated costs for tracking)
    'mistralai/mistral-7b-instruct:free': { inputTokens: 0, outputTokens: 0 },
    'mistralai/mistral-small-3.2-24b-instruct:free': { inputTokens: 0, outputTokens: 0 },
    'google/gemma-7b-it:free': { inputTokens: 0, outputTokens: 0 },
    'deepseek/deepseek-llm-7b-instruct:free': { inputTokens: 0, outputTokens: 0 },
    'openchat/openchat-3.5-1210:free': { inputTokens: 0, outputTokens: 0 },
    
    // Paid models (actual pricing)
    'openai/gpt-4o': { inputTokens: 2.50, outputTokens: 10.00 },
    'openai/gpt-4o-mini': { inputTokens: 0.15, outputTokens: 0.60 },
    'anthropic/claude-3.5-sonnet': { inputTokens: 3.00, outputTokens: 15.00 },
    'google/gemini-pro-1.5': { inputTokens: 1.25, outputTokens: 5.00 },
    'mistralai/mixtral-8x7b-instruct': { inputTokens: 0.24, outputTokens: 0.24 },
  };

  constructor(config: BudgetConfig = { maxDollar: 5.00, warningThreshold: 80 }) {
    this.budget = config;
    this.loadUsageFromStorage();
  }

  private loadUsageFromStorage() {
    try {
      const stored = localStorage.getItem('tokenBudgetUsage');
      if (stored) {
        this.usage = JSON.parse(stored);
        // Clean up old usage (older than 24 hours)
        const cutoff = Date.now() - (24 * 60 * 60 * 1000);
        this.usage = this.usage.filter(u => u.timestamp > cutoff);
      }
    } catch (error) {
      console.warn('Failed to load token budget usage:', error);
      this.usage = [];
    }
  }

  private saveUsageToStorage() {
    try {
      localStorage.setItem('tokenBudgetUsage', JSON.stringify(this.usage));
    } catch (error) {
      console.warn('Failed to save token budget usage:', error);
    }
  }

  estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token for English text
    // More accurate would be to use tiktoken, but this is good enough
    return Math.ceil(text.length / 4);
  }

  getCurrentSpend(): number {
    return this.usage.reduce((total, usage) => total + usage.cost, 0);
  }

  getRemainingBudget(): number {
    return Math.max(0, this.budget.maxDollar - this.getCurrentSpend());
  }

  getBudgetStatus(): {
    spent: number;
    remaining: number;
    percentage: number;
    isWarning: boolean;
    isExceeded: boolean;
  } {
    const spent = this.getCurrentSpend();
    const remaining = this.getRemainingBudget();
    const percentage = (spent / this.budget.maxDollar) * 100;
    
    return {
      spent,
      remaining,
      percentage,
      isWarning: percentage >= this.budget.warningThreshold,
      isExceeded: spent >= this.budget.maxDollar
    };
  }

  canAfford(model: string, estimatedInputTokens: number, estimatedOutputTokens: number = 500): boolean {
    const cost = this.calculateCost(model, estimatedInputTokens, estimatedOutputTokens);
    return this.getRemainingBudget() >= cost;
  }

  calculateCost(model: string, inputTokens: number, outputTokens: number): number {
    const pricing = this.modelPricing[model];
    if (!pricing) {
      console.warn(`No pricing info for model: ${model}, assuming free`);
      return 0;
    }

    const inputCost = (inputTokens / 1_000_000) * pricing.inputTokens;
    const outputCost = (outputTokens / 1_000_000) * pricing.outputTokens;
    
    return inputCost + outputCost;
  }

  recordUsage(model: string, inputTokens: number, outputTokens: number): void {
    const cost = this.calculateCost(model, inputTokens, outputTokens);
    
    const usage: BudgetUsage = {
      model,
      inputTokens,
      outputTokens,
      cost,
      timestamp: Date.now()
    };

    this.usage.push(usage);
    this.saveUsageToStorage();

    console.log(`Token usage recorded:`, {
      model,
      inputTokens,
      outputTokens,
      cost: cost.toFixed(4),
      totalSpent: this.getCurrentSpend().toFixed(4),
      remaining: this.getRemainingBudget().toFixed(4)
    });
  }

  getUsageStats(): {
    totalRequests: number;
    totalInputTokens: number;
    totalOutputTokens: number;
    totalCost: number;
    modelBreakdown: Record<string, { requests: number; cost: number; tokens: number }>;
  } {
    const modelBreakdown: Record<string, { requests: number; cost: number; tokens: number }> = {};
    
    let totalRequests = 0;
    let totalInputTokens = 0;
    let totalOutputTokens = 0;
    let totalCost = 0;

    for (const usage of this.usage) {
      totalRequests++;
      totalInputTokens += usage.inputTokens;
      totalOutputTokens += usage.outputTokens;
      totalCost += usage.cost;

      if (!modelBreakdown[usage.model]) {
        modelBreakdown[usage.model] = { requests: 0, cost: 0, tokens: 0 };
      }
      
      modelBreakdown[usage.model].requests++;
      modelBreakdown[usage.model].cost += usage.cost;
      modelBreakdown[usage.model].tokens += usage.inputTokens + usage.outputTokens;
    }

    return {
      totalRequests,
      totalInputTokens,
      totalOutputTokens,
      totalCost,
      modelBreakdown
    };
  }

  resetBudget(): void {
    this.usage = [];
    this.saveUsageToStorage();
  }

  setBudget(config: Partial<BudgetConfig>): void {
    this.budget = { ...this.budget, ...config };
  }
}

export const tokenBudget = new TokenBudgetService();