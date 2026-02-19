# Customization Guide

How to adapt StockPath Navigator to your specific situation, preferences, and platform.

## Personalizing the User Profile

Open the system prompt and find the `<user_profile>` section. Modify these values to match your situation:

```xml
<user_profile>
- Currently employed earning approximately $[YOUR_DAILY_INCOME]/day
- Starting capital: $[YOUR_AMOUNT]
- Primary goal: [YOUR_GOAL]
- Timeline preference: [YOUR_TIMELINE]
- Experience level: [beginner / intermediate / advanced]
</user_profile>
```

**Examples:**

Part-time worker, ultra-low capital:
```
- Currently employed earning approximately $120/day (~$31K/year)
- Starting capital: $200
- Primary goal: supplement income by $50/day from trading
- Timeline preference: 6-12 month horizon, willing to learn slowly
- Experience level: complete beginner
```

Experienced trader scaling up:
```
- Currently employed earning approximately $600/day (~$156K/year)
- Starting capital: $25,000
- Primary goal: grow to $500/day passive income within 2 years
- Timeline preference: medium-term, already comfortable with short-term trades
- Experience level: intermediate (50+ stock trades, no options experience)
```

## Adjusting Phase Thresholds

In the `<strategy_framework>` section, modify the capital ranges and graduation criteria:

```
PHASE 1 — FOUNDATION ($[MIN]–$[MAX])
  Graduation: [X] completed trades, >[X]% win rate, capital > $[MAX]

PHASE 2 — MOMENTUM ($[MIN]–$[MAX])
  ...
```

**Conservative approach** (lower risk, slower progression):
- Phase 1: $500–$5,000, 20 trades, >60% win rate
- Phase 2: $5,000–$25,000, 50 trades, >58% win rate
- Phase 3: $25,000–$100,000, 100 trades
- Phase 4: $100,000+

**Aggressive approach** (faster progression, higher risk tolerance):
- Phase 1: $500–$1,500, 8 trades, >50% win rate
- Phase 2: $1,500–$8,000, 20 trades, >52% win rate
- Phase 3: $8,000–$30,000, 40 trades
- Phase 4: $30,000+

## Adding Sector Preferences

Add a new `<user_preferences>` tag after `<user_profile>`:

```xml
<user_preferences>
SECTOR FOCUS:
- Preferred sectors: Technology, Clean Energy, Healthcare
- Avoid sectors: Tobacco, Gambling, Weapons manufacturers

STOCK FILTERS:
- Only US-listed stocks (no ADRs)
- Minimum market cap: $1B
- No stocks under $5/share

SCHEDULE:
- Available to check markets: 9:30 AM – 10:30 AM ET and 3:00 PM – 4:00 PM ET
- Preferred trading days: Monday through Thursday (avoid Friday volatility)
</user_preferences>
```

## Ethical / ESG Investing Constraints

Add to `<user_preferences>`:

```xml
ESG CONSTRAINTS:
- Exclude companies with major environmental violations
- Exclude private prison operators
- Prefer companies with strong diversity metrics
- Consider ESG ETFs (ESGU, SUSA, ESGD) as core holdings
- When screening stocks, flag any recent ESG controversies
```

## Non-US Markets

The default prompt assumes US markets. For international users, add:

```xml
<market_context>
PRIMARY MARKET: [London Stock Exchange / TSX / ASX / etc.]
CURRENCY: [GBP / CAD / AUD / etc.]
TRADING HOURS: [local market hours]
TAX CONTEXT: [e.g., "UK ISA wrapper available" or "Canadian TFSA eligible"]
REGULATORY NOTES:
- [e.g., "No PDT rule in UK markets"]
- [e.g., "Stamp duty of 0.5% on UK share purchases"]
INDEX BENCHMARKS: [FTSE 100, S&P/TSX, ASX 200, etc.]
</market_context>
```

Also update the search workflow in `<real_time_data_protocol>` to reference your local indices.

## Adjusting Income Target

The default target is $400/day. To change it, find these references throughout the prompt and update:

1. `<user_profile>` — daily income figure
2. `<capital_growth_framework>` Phase 4 — target math
3. `<first_message_protocol>` — honest math calculation
4. `<portfolio_dashboard>` — goal progress tracker target

The formula: Target Daily Income × 21 trading days = Monthly Target. Monthly Target ÷ Expected Monthly Return = Required Portfolio Size.

| Daily Target | Monthly Target | At 5%/mo Required | At 8%/mo Required |
|-------------|---------------|-------------------|-------------------|
| $100/day | $2,100 | $42,000 | $26,250 |
| $200/day | $4,200 | $84,000 | $52,500 |
| $400/day | $8,400 | $168,000 | $105,000 |
| $600/day | $12,600 | $252,000 | $157,500 |
| $1,000/day | $21,000 | $420,000 | $262,500 |

## Dashboard Customization

### Changing Colors

In `StockPathDashboard.jsx`, the color constants are defined inline. Key colors to modify:

- Background: `#0A0B0F` (near-black)
- Phase colors: `#3B82F6` (blue), `#8B5CF6` (purple), `#F59E0B` (amber), `#10B981` (emerald)
- Win/Loss: `#10B981` (green) / `#EF4444` (red)
- Text: `rgba(255,255,255,0.7)` (primary), `rgba(255,255,255,0.4)` (secondary)

### Adding Real Trade Data

Replace the `SAMPLE_TRADES` and `SAMPLE_PLANS` constants with your actual data, or connect to an API/localStorage for persistence.

### Font Customization

The dashboard uses Space Grotesk (headings) and JetBrains Mono (data). To change fonts, modify the Google Fonts import URL in the component and update the `fontFamily` values.

## Platform-Specific Adjustments

### Claude.ai
No changes needed — the prompt is optimized for Claude with web search.

### ChatGPT Custom GPT
- Remove XML tags (GPT handles them less consistently) and replace with markdown headers
- Replace "Use web search" instructions with "Use your browsing capability"
- The `<response_protocol>` may need to be shortened due to instruction limits

### API Usage
- Set `temperature: 0.3` for consistent analytical output
- Set `max_tokens: 3000` minimum to accommodate dashboards
- For Claude API: use `system` parameter for the prompt
- For OpenAI API: use `system` role message

### Local Models (Llama, Mistral)
- Remove all `<real_time_data_protocol>` content (no web search available)
- Add: "You do not have access to live market data. Provide educational analysis based on general principles and ask the user to provide current prices."
- Reduce `<response_protocol>` to 4 steps (skip live data steps)
- Expect lower quality on the emotional detection protocol
