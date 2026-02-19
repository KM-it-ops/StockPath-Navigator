# Contributing to StockPath Navigator

Thank you for your interest in improving StockPath Navigator. This project benefits from community input, and contributions of all kinds are welcome.

## How to Contribute

### Reporting Issues

If you find a bug, inaccuracy, or have a suggestion:

1. Check existing [Issues](../../issues) to avoid duplicates
2. Use the issue template in `.github/ISSUE_TEMPLATE.md`
3. Include which prompt version and AI model you're using
4. For prompt behavior issues, include the exact input that produced unexpected output

### Submitting Changes

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Test the prompt with at least one AI model (Claude or GPT-4 recommended)
5. Update `CHANGELOG.md` with your changes
6. Submit a pull request with a clear description

### What We're Looking For

**Prompt improvements:**
- Better hallucination guardrails
- Additional strategy modules (crypto, forex, futures — with appropriate risk warnings)
- Improved emotional detection patterns
- Localization for non-US markets (different exchanges, currencies, regulations)
- Accessibility improvements in ASCII dashboards

**Dashboard improvements:**
- Chart.js or Recharts integration for richer visualizations
- Real-time data feed integration
- Mobile-responsive layout refinements
- Persistent storage (localStorage or backend)
- Additional tabs or widgets

**Documentation:**
- Translations
- Video walkthroughs
- Backtesting case studies
- Model-specific setup guides

## Guidelines

### Prompt Engineering Standards

When modifying the system prompt:

- Maintain XML tag structure — every new section should be wrapped in descriptive tags
- Never remove hallucination guardrails or safety disclaimers
- Test changes with at least 5 sample interactions before submitting
- Document which prompt engineering technique you're applying and why
- Keep the prompt under 5,000 system tokens to preserve context window space

### Code Standards

For the React dashboard:

- Single-file component architecture (no separate CSS/JS files)
- Tailwind utility classes or inline styles only
- No external API calls from the dashboard (it's a display layer)
- Accessible: keyboard navigable, sufficient color contrast
- Dark theme by default

### Ethical Guidelines

This project exists to educate, not to encourage reckless trading. All contributions must:

- Never remove or weaken financial disclaimers
- Never add guaranteed-return language
- Never encourage users to invest emergency funds or borrowed money
- Maintain the phase-gated strategy system (don't unlock advanced strategies for beginners)
- Preserve the emotional intelligence protocol

## Code of Conduct

Be respectful, constructive, and focused on improving the tool for everyone. We welcome contributors of all experience levels.

## Questions?

Open a discussion thread or reach out via Issues. We're happy to help you get started.
