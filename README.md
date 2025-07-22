# 🚔 Thought Police

**Advanced Reddit User Analysis Platform**

A sophisticated web application that analyzes Reddit user comment histories to detect contradictions, inconsistencies, and behavioral patterns using AI-powered analysis pipelines.

## 🎯 Overview

Thought Police is a gamified platform where users become "digital detectives" analyzing Reddit accounts for contradictions in their posting history. The application combines real-time Reddit API integration with advanced AI analysis to provide comprehensive reports on user behavior patterns.

## ✨ Key Features

### 🔍 Real-Time Reddit Analysis
- Live integration with Reddit API
- Analyzes up to 5,000 comments and posts per user
- Comprehensive data fetching with intelligent caching
- Support for users across all subreddits

### 🤖 AI-Powered Detection
- Multi-model analysis pipeline using Google Gemini AI
- Advanced contradiction detection algorithms
- Context-aware analysis with confidence scoring
- Token budget management for cost optimization

### 📊 Comprehensive Reporting
- Detailed contradiction reports with evidence
- Timeline visualization of user behavior
- Statistical analysis and sentiment trends
- Categorized contradictions (political, personal, factual, etc.)

### 🏆 Gamification System
- Rank progression system (Rookie Cop → Chief Inspector)
- Achievement badges and leaderboards
- Point-based scoring system
- User profiles with police-themed cards

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Smooth animations with Framer Motion
- Interactive data visualizations with Recharts
- Dark/light theme support

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animation library
- **Recharts** - Data visualization
- **Lucide React** - Icon library

### Backend Services
- **Reddit API** - Real-time data fetching
- **Google Gemini AI** - LLM analysis pipeline
- **Axios** - HTTP client with retry logic
- **Local Storage** - Client-side caching

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Google AI API key (for Gemini integration)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/thought-police.git
   cd thought-police
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_GOOGLE_AI_API_KEY=your_gemini_api_key_here
   VITE_REDDIT_CLIENT_ID=your_reddit_client_id (optional)
   VITE_REDDIT_CLIENT_SECRET=your_reddit_client_secret (optional)
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## 📱 Usage

### Basic Analysis
1. Enter a Reddit username (with or without u/ prefix)
2. Click "Analyze User" to start the investigation
3. Wait for the AI analysis to complete
4. Review the detailed contradiction report

### Understanding Results
- **Contradictions**: Conflicting statements with evidence
- **Confidence Score**: AI's certainty in the findings (0-100%)
- **Timeline**: Chronological view of user behavior
- **Categories**: Classification of contradiction types

### Navigation
- **Home**: Main analysis interface
- **Leaderboard**: Top-performing officers
- **Stats**: Platform-wide statistics
- **Profile**: User profile and achievements

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AnalysisResults.tsx
│   ├── SearchForm.tsx
│   ├── Navigation.tsx
│   └── ...
├── pages/              # Route-based page components
│   ├── HomePage.tsx
│   ├── LeaderboardPage.tsx
│   └── ...
├── services/           # Business logic and API integrations
│   ├── analysisService.ts
│   ├── redditApi.ts
│   ├── multiModelPipeline.ts
│   └── ...
├── types/              # TypeScript type definitions
├── data/               # Mock data and constants
└── App.tsx             # Main application component
```

## 🔧 Configuration

### Analysis Parameters
- **Max Items**: Up to 5,000 comments/posts per analysis
- **Max Age**: Content up to 365 days old
- **Cache Duration**: 24 hours for repeated analyses
- **Token Budget**: Configurable spending limits

### Customization
- Modify `src/services/tokenBudget.ts` for cost controls
- Adjust cache settings in `src/services/cacheService.ts`
- Update UI themes in `tailwind.config.js`

## 🚨 Important Notes

### Ethical Usage
- This tool is for educational and entertainment purposes
- Respect Reddit's Terms of Service and API limits
- Do not use for harassment or malicious purposes
- Consider privacy implications when analyzing users

### Rate Limiting
- Reddit API has built-in rate limiting
- The application includes automatic retry logic
- Large analyses may take several minutes

### Data Privacy
- No user data is stored permanently
- Cache is cleared automatically after 24 hours
- All analysis is performed client-side

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind for styling
- Implement proper error handling
- Add types for all new interfaces
- Test components thoroughly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Reddit API for providing access to user data
- Google Gemini AI for advanced language analysis
- The React and TypeScript communities
- All contributors and testers

## 📞 Support

For questions, issues, or feature requests:
- Open an issue on GitHub
- Check existing documentation
- Review the code comments for implementation details

---

**Disclaimer**: This application is for educational purposes. Always respect user privacy and platform terms of service.
