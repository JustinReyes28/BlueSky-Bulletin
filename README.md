# BlueSky Bulletin - AI Weather Insights Agent

![BlueSky Bulletin Logo](https://via.placeholder.com/150) *// Add your actual logo here*

## 🌤️ About the Project

**BlueSky Bulletin** is an intelligent weather forecast platform that transforms raw meteorological data into actionable insights. Using AI-powered analysis, we provide personalized weather summaries, activity recommendations, and proactive alerts to help you make informed daily decisions.

## 🚀 Key Features

### ✨ AI-Powered Weather Insights
- **Natural Language Summaries**: Get human-readable weather narratives like "Perfect hiking conditions this morning, but bring a jacket for afternoon wind"
- **Personalized Recommendations**: Activity suggestions based on current and forecasted weather patterns
- **Proactive Alerts**: AI-generated notifications for significant weather changes that might impact your plans
- **Comparative Analysis**: Contextual insights like "Warmer than yesterday" or "10% more rainfall than average"

### 📍 Smart Location Handling
- Automatic geolocation detection (with user permission)
- Manual location search with intelligent suggestions
- Location-based weather insights and recommendations

### 💬 Interactive Weather Assistant
- Ask follow-up questions like "Best time for outdoor photography tomorrow?"
- Get instant, context-aware responses
- Provide feedback to improve future recommendations

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript 5.3+
- **Styling**: Tailwind CSS 3.4
- **Mapping**: Leaflet.js 1.9
- **Weather Data**: Open-Meteo API
- **AI Processing**: Openrouter LLM integration
- **Hosting**: Vercel Free Tier
- **Caching**: Redis/resizable LRU caching

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Vercel account (for deployment)
- Open-Meteo API access
- Openrouter API key

### Local Development

```bash
# Clone the repository
git clone https://github.com/your-username/bluesky-bulletin.git
cd bluesky-bulletin

# Install dependencies
npm install
# or
yarn install

# Set up environment variables
# Create a .env.local file in the root directory
cp .env.example .env.local

# Add your API keys to .env.local
NEXT_PUBLIC_OPEN_METEO_API_KEY=your_open_meteo_key
OPENROUTER_API_KEY=your_openrouter_key

# Run the development server
npm run dev
# or
yarn dev

# Open http://localhost:3000 in your browser
```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Open-Meteo API
NEXT_PUBLIC_OPEN_METEO_API_KEY=your_api_key_here

# Openrouter AI API
OPENROUTER_API_KEY=your_api_key_here

# Application settings
NEXT_PUBLIC_APP_NAME=BlueSky Bulletin
NEXT_PUBLIC_APP_VERSION=0.0.39
```

## 🎯 Usage

### Basic Usage
1. Visit the BlueSky Bulletin website
2. Allow location access or search for your desired location
3. View AI-generated weather insights and recommendations
4. Ask specific questions about weather conditions
5. Provide feedback to improve future recommendations

### Advanced Features
- **7-Day Forecast Analysis**: Get insights for the entire week
- **Historical Comparisons**: See how current weather compares to historical norms
- **Activity Planning**: Get recommendations for outdoor activities, travel, and health precautions
- **Custom Alerts**: Set up notifications for specific weather conditions

## 📁 Project Structure

```
bluesky-bulletin/
├── app/                  # Next.js app router pages
│   ├── api/              # API routes
│   │   └── insights/     # AI insights endpoints
│   └── page.tsx          # Main dashboard
├── components/           # React components
│   ├── ai-insights/      # AI insights components
│   │   ├── WeatherInsightPanel.tsx
│   │   ├── DailyBriefingCard.tsx
│   │   └── InsightChat.tsx
│   └── map/              # Map components
│       └── WeatherMap.tsx
├── lib/                  # Core logic and utilities
│   ├── ai/               # AI processing
│   │   ├── weather-insight-agent.ts
│   │   └── prompt-templates.ts
│   ├── cache/            # Caching layer
│   │   └── insight-cache.ts
│   └── weather/          # Weather data processing
│       └── open-meteo.ts
├── hooks/                # Custom React hooks
│   └── useWeatherInsights.ts
└── public/               # Static assets
```

## 🔧 Configuration

### API Configuration

Configure API endpoints in `lib/weather/open-meteo.ts`:

```typescript
// Example configuration
const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1';
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
```

### Caching Settings

Adjust cache settings in `lib/cache/insight-cache.ts`:

```typescript
// Cache duration (30 minutes by default)
export const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in ms

// Maximum cache size
export const MAX_CACHE_SIZE = 1000; // items
```

## 🚀 Deployment

### Vercel Deployment

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy to Vercel:
   ```bash
   vercel
   ```

3. Set environment variables in Vercel dashboard:
   - `OPEN_METEO_API_KEY`
   - `OPENROUTER_API_KEY`

### Production Build

```bash
npm run build
npm start
```

## 📊 Performance Optimization

- **Caching**: AI insights are cached for 30 minutes to reduce API costs
- **Lazy Loading**: Components are loaded on-demand
- **Efficient Data Fetching**: Optimized Open-Meteo API calls
- **Streaming Responses**: For large AI-generated content

## 🛡️ Security Features

- **Input Validation**: All user inputs are validated and sanitized
- **Secure API Keys**: Stored in environment variables, never in code
- **Rate Limiting**: 30 requests per minute per IP
- **Content Security**: CSP headers and output escaping
- **Privacy-First**: No permanent storage of personal data or location history

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

### Development Guidelines

- Follow TypeScript best practices
- Write unit tests for new features
- Document your code with JSDoc comments
- Keep components small and focused
- Use Tailwind CSS for styling

## 📋 Roadmap

### Current Version (v0.0.39)
- ✅ AI Weather Insights Agent
- ✅ Interactive chat interface
- ✅ Location-based recommendations
- ✅ 7-day forecast analysis
- ✅ Soft delete and trash management system

### Upcoming Features
- 📅 User accounts and preferences
- 🔔 Custom alert notifications
- 🌍 Multi-language support
- 📊 Advanced weather analytics
- 🤖 Enhanced AI personalization

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For questions, issues, or feature requests:

- Open an issue on GitHub
- Contact us at support@bluesky-bulletin.com
- Join our community Discord

## 🙏 Acknowledgments

- Open-Meteo for providing excellent weather data
- Vercel for hosting infrastructure
- The open-source community for amazing tools and libraries

---

**BlueSky Bulletin** - Making weather intelligence accessible to everyone! 🌤️🌧️☀️
"# BlueSky-Bulletin" 
