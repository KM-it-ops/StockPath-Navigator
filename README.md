# StockPath Navigator

**An AI-powered stock trading companion built through advanced prompt engineering, designed for retail investors starting from minimal capital with the goal of replacing a $400/day income.**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Prompt Version](https://img.shields.io/badge/Prompt-v3.0-blue.svg)](prompts/v3.0/stockpath-navigator-v3.0.md)
[![Dashboard](https://img.shields.io/badge/Dashboard-React-61DAFB.svg)](dashboard/StockPathDashboard.jsx)

---

## What Is This?

StockPath Navigator is a meticulously engineered system prompt that transforms any reasoning-capable LLM (Claude, GPT-4, Gemini) into a disciplined stock market analyst and trading coach. It's not a trading bot — it's an AI companion that provides real-time analysis, tracks your trades, manages your emotional state, and progressively teaches you to trade independently.

The project includes:

- **System Prompt (v3.0)** — A ~4,200-token prompt using 17 advanced prompt engineering techniques
- **Interactive React Dashboard** — A companion UI for portfolio tracking, trade journaling, and goal visualization
- **Version History** — Full evolution from v1.0 → v3.0 with documented engineering decisions

## Key Features

### Prompt System
- **Real-time data integration** — Mandatory web search workflow before every recommendation, with timestamped citations and cross-verification
- **4-Phase progressive strategy system** — Swing Trading → Momentum/Breakout → Options → Dividend/Growth Hybrid, unlocked as you build capital and experience
- **Proactive conditional trade plans** — "If/Then" action plans with bullish, bearish, and sideways scenarios for every watchlisted stock
- **Weekly Monday Briefings** — Comprehensive market prep reports with macro outlook, event calendar, sector heat map, and fresh watchlist
- **Emotional intelligence protocol** — Detects frustration, anxiety, euphoria, and defeat through language patterns, adapts response tone accordingly
- **Trade journal with lesson extraction** — Logs every trade with entry/exit, P/L, and a retrospective lesson learned
- **Visual ASCII dashboards** — Portfolio overview, allocation chart, performance metrics, and goal progress tracker
- **Hallucination guardrails** — Never fabricates prices, dates, or data; cites sources; timestamps all information
- **Built-in circuit breaker** — Pauses trading recommendations when 3+ emotional signals are detected in a single message

### React Dashboard
- Portfolio overview with live stat cards
- Trade journal with color-coded outcomes
- Conditional trade plan viewer with 3-scenario cards
- Emotional health tracker with dynamic advice
- $400/day goal progress with transparent return math
- Dark theme, responsive layout, zero external dependencies beyond React + Tailwind

## Quick Start

### Using the Prompt

1. Open your preferred AI model with web search enabled (Claude.ai recommended)
2. Copy the contents of [`prompts/v3.0/stockpath-navigator-v3.0.md`](prompts/v3.0/stockpath-navigator-v3.0.md)
3. Extract the text between the ` ``` ` code fences (the system prompt itself)
4. Paste it into the **System Prompt** or **Custom Instructions** field
5. Start chatting — the AI will guide you through onboarding

### Using the Dashboard

The React dashboard is designed to run as a [Claude Artifact](https://support.anthropic.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them) or in any React environment.

**Option A — Claude Artifact (easiest):**
Ask Claude to render the JSX file as an artifact directly.

**Option B — Standalone React app:**
```bash
npx create-react-app stockpath-dashboard
cd stockpath-dashboard
cp /path/to/StockPathDashboard.jsx src/App.jsx
npm start
```

**Option C — Vite:**
```bash
npm create vite@latest stockpath-dashboard -- --template react
cd stockpath-dashboard
cp /path/to/StockPathDashboard.jsx src/App.jsx
npm install
npm run dev
```

## Project Structure

```
stockpath-navigator/
├── README.md                 # You are here
├── LICENSE                   # MIT License
├── CHANGELOG.md              # Version history with diffs
├── CONTRIBUTING.md           # Contribution guidelines
├── .gitignore                # Git ignore rules
├── package.json              # Dashboard dependencies
│
├── prompts/
│   ├── v1.0/
│   │   └── stockpath-navigator-v1.0.md   # Base prompt
│   ├── v2.0/
│   │   └── stockpath-navigator-v2.0.md   # + Real-time data, journaling
│   └── v3.0/
│       └── stockpath-navigator-v3.0.md   # + Alerts, briefings, emotional AI
│
├── dashboard/
│   └── StockPathDashboard.jsx            # Interactive React dashboard
│
├── docs/
│   ├── SETUP.md              # Detailed setup instructions
│   ├── TECHNIQUES.md         # Prompt engineering techniques explained
│   └── CUSTOMIZATION.md      # How to adapt for your situation
│
└── .github/
    └── ISSUE_TEMPLATE.md     # Bug/feature request template
```

## Prompt Engineering Techniques Used

This project applies 17 documented prompt engineering techniques. Full explanations in [`docs/TECHNIQUES.md`](docs/TECHNIQUES.md).

| # | Technique | Purpose |
|---|-----------|---------|
| 1 | Role Priming | Constrains model to disciplined analyst persona |
| 2 | XML Tag Structure | Separates 7 instruction domains cleanly |
| 3 | Chain-of-Thought | 8-step mandatory reasoning before recommendations |
| 4 | Self-Reflection | Model audits its own output before delivery |
| 5 | Hallucination Guardrails | Prevents data fabrication, forces citations |
| 6 | ReAct (Reason + Act) | Search → reason → respond workflow |
| 7 | Emotional Prompting | User context drives protective advice framing |
| 8 | Output Specification | Structured templates for every response type |
| 9 | Few-Shot (Implicit) | Teaching examples evolve across conversation |
| 10 | Negative Constraints | Explicit failure mode blocking |
| 11 | Least-to-Most | 4-phase scaffolding by experience |
| 12 | External Memory | Trade journal persists across turns |
| 13 | ASCII Visualization | Info-dense visual dashboards in plain text |
| 14 | Prompt Chaining | Sequential dependent reasoning steps |
| 15 | Proactive Planning | AI generates plans before user needs them |
| 16 | Behavioral Detection | NLP-style emotional signal matching |
| 17 | Adaptive Tone Shifting | Same data, different delivery per emotional state |

## The 4-Phase System

| Phase | Capital | Strategies Unlocked | Max Positions |
|-------|---------|-------------------|---------------|
| 1 — Foundation | $500–$2K | Swing Trading | 2 |
| 2 — Momentum | $2K–$10K | + Momentum/Breakout | 4 |
| 3 — Acceleration | $10K–$50K | + Options (Covered Calls, CSPs, Spreads) | 6 |
| 4 — Income Replace | $50K+ | + Dividends/Growth Hybrid | 8–12 |

Each phase has graduation criteria (trade count, win rate, capital threshold) that must be met before advancing.

## Model Compatibility

| Model | Web Search | Recommended | Notes |
|-------|-----------|-------------|-------|
| Claude 3.5+ (claude.ai) | ✅ | ⭐ Best | Native web search, artifacts for dashboard |
| Claude API | Via tools | ✅ Great | Requires tool configuration for search |
| GPT-4 (ChatGPT Plus) | ✅ Browsing | ✅ Great | Use Custom Instructions field |
| GPT-4 API | Via functions | ✅ Good | Requires function calling setup |
| Gemini Pro/Ultra | ✅ Grounding | ✅ Good | Use system instruction field |
| Local models (Llama, etc.) | ❌ | ⚠️ Limited | No real-time data; education-only mode |

**Recommended settings** (if configurable):
- Temperature: 0.2–0.4 (factual precision)
- Top-P: 0.9
- Max tokens: 3000+

## Important Disclaimers

> **This is an educational tool, not financial advice.**

- StockPath Navigator is an AI prompt — it does not execute trades, access brokerage accounts, or guarantee returns
- All recommendations should be independently verified before execution
- Never invest money you cannot afford to lose
- Past performance does not guarantee future results
- The authors are not licensed financial advisors
- Consult a qualified financial professional for personalized investment advice

## Customization

See [`docs/CUSTOMIZATION.md`](docs/CUSTOMIZATION.md) for detailed instructions on adapting the prompt to your situation, including:

- Adjusting starting capital and income targets
- Modifying phase thresholds
- Adding sector preferences or ethical investing constraints
- Configuring for different AI platforms
- Customizing dashboard colors and layout

## Contributing

Contributions welcome! See [`CONTRIBUTING.md`](CONTRIBUTING.md) for guidelines.

Areas especially open for contribution:
- Additional strategy modules (crypto, forex, futures)
- Dashboard enhancements (chart.js integration, real-time data feeds)
- Translations / localization
- Backtesting frameworks for strategy validation
- Mobile-responsive dashboard improvements

## Version History

See [`CHANGELOG.md`](CHANGELOG.md) for full version history.

- **v3.0** — Proactive alerts, weekly briefings, emotional intelligence protocol
- **v2.0** — Real-time data integration, multi-strategy phasing, trade journal, visual dashboards
- **v1.0** — Core analyst persona, 6-step reasoning chain, capital growth framework

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

*Built with advanced prompt engineering techniques. Engineered for the retail investor who can't afford to lose.*
