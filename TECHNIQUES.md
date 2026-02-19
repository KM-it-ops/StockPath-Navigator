# Prompt Engineering Techniques

This document explains every prompt engineering technique used in StockPath Navigator, why it was chosen, and where it appears in the prompt.

## 1. Role Priming (Persona Adoption)

**What:** Assigning the AI a specific expert identity that constrains its vocabulary, reasoning patterns, and tone.

**Where:** `<core_identity>` tag — "You are StockPath Navigator — a seasoned, plain-speaking financial markets analyst with 20+ years of experience..."

**Why:** Without role priming, the AI defaults to a generic assistant voice. By specifying a disciplined analyst with fiduciary instincts, we get domain-specific language, cautious risk management, and authoritative delivery. The "treats your user's money as if it were your own" framing invokes protective reasoning.

**Reference:** Sadovsky Concept #1 (Role Priming); Google Guide (Role Prompting, p.21)

## 2. XML Tag Structure

**What:** Using XML-style tags to create clear boundaries between different instruction domains.

**Where:** 7 major sections: `<core_identity>`, `<user_profile>`, `<real_time_data_protocol>`, `<proactive_alerts_system>`, `<emotional_check_in_protocol>`, `<strategy_framework>`, `<response_protocol>`, etc.

**Why:** Prevents "instruction bleed" — where the model confuses guidelines from one section with another. Each tagged section is a self-contained module that the model can reference independently.

**Reference:** Anthropic Guide (Use XML Tags); Sadovsky Concept #4 (Context Framing & Delimiters)

## 3. Chain-of-Thought (CoT) Reasoning

**What:** Forcing the model to generate intermediate reasoning steps before producing a final answer.

**Where:** `<response_protocol>` — 8 mandatory steps from emotional check through self-audit to plain-language summary.

**Why:** Financial analysis requires systematic thinking. Without CoT, the model might skip directly to "buy AAPL" without considering market conditions, sector performance, or the user's risk capacity. The 8-step chain ensures comprehensive reasoning.

**Reference:** Sadovsky Concept #3 (CoT); Google Guide (Chain of Thought, p.29); Anthropic Guide (Let Claude Think)

## 4. Self-Reflection

**What:** Instructing the model to critically evaluate its own output before delivery.

**Where:** Step 7 of the response protocol — "What could go wrong? Would I put MY limited savings into this?"

**Why:** LLMs can generate confidently wrong answers. The self-audit step forces the model to stress-test recommendations against the user's actual situation, catching overconfident or inappropriate suggestions before they're delivered.

**Reference:** Sadovsky Concept (Self-Reflection); Google Guide (Self-Consistency, p.32)

## 5. Hallucination Guardrails

**What:** Explicit instructions to prevent the model from fabricating facts.

**Where:** `<mandatory_disclaimers>` — "NEVER fabricate specific stock prices, earnings dates, options premiums, or financial data." Also: data freshness rules requiring timestamps and source citations.

**Why:** In financial contexts, hallucinated data can directly cause monetary loss. The guardrails force the model to say "I don't have this data" rather than guessing, and to cite where information came from so users can verify.

**Reference:** Sadovsky Concept #10 (Hallucination Guardrails); Anthropic Guide (Avoiding Hallucinations)

## 6. ReAct (Reason + Act)

**What:** A pattern where the model reasons about what information it needs, takes action (searches), then reasons about the results.

**Where:** `<real_time_data_protocol>` search workflow — 6 mandatory searches (indices → VIX → sectors → tickers → options → economic calendar). Also the Monday Briefing search checklist (7 searches).

**Why:** Financial markets change by the minute. The ReAct pattern ensures the AI actively gathers fresh data before reasoning, rather than relying on stale training knowledge. The structured search workflow prevents the model from skipping research steps.

**Reference:** Google Guide (ReAct, p.37)

## 7. Emotional Prompting (Context Framing)

**What:** Providing emotional context about the user to influence how the model frames its responses.

**Where:** `<user_profile>` — "Emotional state: likely anxious about money, eager but vulnerable to scams and hype. Risk reality: CANNOT afford to lose their starting capital."

**Why:** This primes the model to err on the side of caution. Every recommendation is filtered through the lens of "this person is financially vulnerable" rather than the default assumption of a well-capitalized investor.

**Reference:** Sadovsky Concept (Emotional Prompting / EmotionPrompt)

## 8. Output Specification

**What:** Explicitly defining the structure, format, and components of every response type.

**Where:** `<output_format>` (recommendation template), `<portfolio_dashboard>` (ASCII layouts), `<weekly_monday_briefing>` (briefing template), `<proactive_alerts_system>` (conditional plan format).

**Why:** Without rigid output templates, the model produces inconsistent formats that are hard to scan and act on. The watchlist template ensures every recommendation includes the same critical fields (entry, stop, target, R:R, position size), making comparison and execution straightforward.

**Reference:** Sadovsky Concept #6 (Output Specification); Google Guide (Be Specific About Output, p.56)

## 9. Few-Shot (Implicit Examples)

**What:** Providing examples of how output should evolve over time, rather than static in/out pairs.

**Where:** `<teaching_integration>` — Shows first-mention (full explanation) vs. later-mention (shorthand) for RSI and options concepts.

**Why:** True few-shot with financial data would be too token-expensive and quickly outdated. Instead, we demonstrate the *pattern* of progressive teaching, letting the model generalize it across all concepts.

**Reference:** Sadovsky Concept #2 (Few-Shot); Anthropic Guide (Use Examples)

## 10. Negative Constraints

**What:** Explicitly listing what the model must NOT do.

**Where:** `<prohibited_behaviors>` — 15 specific banned behaviors including penny stocks, day trading under $25K, YOLO positions, skipping the self-audit, and matching the user's emotional intensity.

**Why:** LLMs optimize for helpfulness, which can lead them to comply with harmful requests. Negative constraints create hard boundaries that override the model's default "be helpful" drive.

**Reference:** Sadovsky Concept #5 (Instruction Tuning — Negative Constraints); Google Guide (Use Instructions Over Constraints, p.56)

## 11. Least-to-Most Prompting

**What:** Scaffolding complexity so the model introduces concepts progressively.

**Where:** `<strategy_framework>` — 4 phases with explicit graduation criteria. Phase 1 users only get swing trading; options aren't mentioned until Phase 3.

**Why:** Overwhelming a beginner with options Greeks and credit spreads when they haven't placed their first stock trade is counterproductive and dangerous. The phase system prevents premature complexity exposure.

**Reference:** Sadovsky Concept #11 (Least-to-Most Prompting)

## 12. External Memory

**What:** Maintaining persistent state across conversation turns using structured logs.

**Where:** `<trade_journal_system>` — trade entries with standardized fields that accumulate over the conversation. Also `<portfolio_dashboard>` metrics derived from journal data.

**Why:** LLMs have no native memory between turns. By instructing the model to maintain a running journal, we create a simulated persistent state that enables portfolio tracking, performance metrics, and lesson extraction.

**Reference:** Sadovsky Concept #13 (External Memory)

## 13. ASCII Visualization

**What:** Using monospaced text art to convey information-dense visual dashboards.

**Where:** All dashboard components — portfolio overview, allocation bars, goal progress tracker, trade journal tables, conditional plan cards, weekly briefings.

**Why:** Most LLM interfaces render monospaced code blocks reliably. ASCII dashboards provide visual hierarchy, progress tracking, and at-a-glance portfolio status without requiring external tools, images, or rendering engines.

**Reference:** Sadovsky Concept (Generating Visualizations with ASCII Art)

## 14. Prompt Chaining

**What:** Breaking complex tasks into dependent sequential steps where each step's output feeds the next.

**Where:** The 8-step response protocol (emotional check → market context → sector scan → stock screening → entry thesis → conditional plan → self-audit → summary). Also the 7-step Monday Briefing search checklist.

**Why:** A single "analyze the market and recommend stocks" instruction invites cognitive overload and context drift. Chaining ensures each analytical layer is completed before the next begins, preventing skipped reasoning.

**Reference:** Sadovsky Concept #8 (Prompt Chaining); Anthropic Guide (Chain Complex Prompts)

## 15. Proactive Planning

**What:** Instructing the model to generate action plans before the user needs them.

**Where:** `<proactive_alerts_system>` — conditional trade plans with bullish/bearish/sideways scenarios. `<weekly_monday_briefing>` — preparation reports generated before market open.

**Why:** Most AI interactions are reactive (user asks → AI responds). Proactive planning transforms the AI into a preparation tool, ensuring the user has decision frameworks ready when price triggers hit, rather than scrambling to analyze in the moment.

**Purpose-built:** This technique was designed specifically for StockPath Navigator's use case.

## 16. Behavioral Detection

**What:** Pattern matching on user language to detect emotional states.

**Where:** `<emotional_check_in_protocol>` — 4 emotional state categories with specific linguistic indicators (ALL CAPS, "I should just quit", "this can't lose", etc.).

**Why:** Emotional trading is the #1 cause of retail investor losses. By explicitly cataloging language patterns associated with frustration, anxiety, euphoria, and defeat, we enable the model to detect these states and adapt before the user makes an emotional financial decision.

**Purpose-built:** Adapted from sentiment analysis principles for real-time conversational use.

## 17. Adaptive Tone Shifting

**What:** Delivering the same information with different framing based on detected user state.

**Where:** The 4 adaptive response frameworks in `<emotional_check_in_protocol>` — each state has a numbered protocol for how to adjust communication style.

**Why:** Telling a frustrated user "your stop-loss was hit" vs. telling a calm user the same fact requires completely different delivery. The frustrated user needs acknowledgment first, then data; the calm user just needs the data. Same information, different emotional wrapping.

**Purpose-built:** Combines emotional prompting with conditional response logic.
