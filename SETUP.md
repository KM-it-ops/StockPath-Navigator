# Setup Guide

Detailed instructions for getting StockPath Navigator running on different platforms.

## Prerequisites

- Access to a reasoning-capable AI model with web search (Claude, GPT-4, or Gemini)
- For the dashboard: Node.js 18+ and npm/yarn

## Prompt Setup

### Claude.ai (Recommended)

1. Go to [claude.ai](https://claude.ai)
2. Click the **Projects** tab → Create a new project
3. In the project settings, find the **Custom Instructions** or **System Prompt** field
4. Open `prompts/v3.0/stockpath-navigator-v3.0.md`
5. Copy everything between the ` ``` ` code fences (the system prompt block)
6. Paste into the system prompt field
7. Make sure **Web Search** is enabled in your Claude settings
8. Start a new conversation within the project

**Tip:** Claude.ai supports artifacts — you can paste the dashboard JSX directly into a conversation and ask Claude to render it as an interactive artifact.

### ChatGPT / GPT-4

1. Go to [chat.openai.com](https://chat.openai.com) (requires Plus subscription for GPT-4)
2. Click your profile → **Customize ChatGPT** → **Custom Instructions**
3. In "How would you like ChatGPT to respond?", paste the system prompt
4. Note: GPT-4's custom instructions have a character limit (~1,500 chars). For the full v3.0 prompt, you may need to use the API or paste it at the start of each conversation.
5. Alternatively, use the **GPTs** feature to create a custom GPT with the full system prompt.

### Claude API

```python
import anthropic

client = anthropic.Anthropic()

# Read the system prompt from file
with open("prompts/v3.0/stockpath-navigator-v3.0.md", "r") as f:
    content = f.read()
    # Extract text between ``` fences
    start = content.index("```\n") + 4
    end = content.rindex("```")
    system_prompt = content[start:end]

message = client.messages.create(
    model="claude-sonnet-4-5-20250514",
    max_tokens=3000,
    system=system_prompt,
    messages=[
        {"role": "user", "content": "Hi, I have $1,500 to start trading. I've never traded before."}
    ]
)

print(message.content[0].text)
```

### OpenAI API

```python
from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-4-turbo-preview",
    temperature=0.3,
    max_tokens=3000,
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": "Hi, I have $1,500 to start trading."}
    ]
)

print(response.choices[0].message.content)
```

## Dashboard Setup

### Option A: Claude Artifact (Zero Setup)

1. Start a conversation with Claude
2. Paste the contents of `dashboard/StockPathDashboard.jsx`
3. Ask: "Please render this as an interactive artifact"
4. The dashboard will appear inline in the conversation

### Option B: Vite + React (Local Development)

```bash
# Create a new Vite project
npm create vite@latest stockpath-dashboard -- --template react
cd stockpath-dashboard

# Replace the default App with the dashboard
cp ../dashboard/StockPathDashboard.jsx src/App.jsx

# Install and run
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Option C: Create React App

```bash
npx create-react-app stockpath-dashboard
cd stockpath-dashboard
cp ../dashboard/StockPathDashboard.jsx src/App.js
npm start
```

Open `http://localhost:3000` in your browser.

## Verifying the Setup

After setting up the prompt, test with this message:

> "Hi, I have $1,200 to invest. I've never traded stocks before but I've been reading about it for a few months. I don't have a brokerage account yet."

A properly configured StockPath Navigator should respond with:

1. A brief introduction identifying itself as StockPath Navigator
2. A financial disclaimer (AI, not a financial advisor)
3. Acknowledgment of your capital level and experience
4. Phase 1 assignment with explanation
5. An immediate actionable step (likely: open a brokerage account + paper trade)
6. Honest math about the $400/day goal
7. An offer to generate a Monday Briefing or first watchlist

If the response is generic or doesn't include these elements, verify the system prompt was pasted correctly and completely.

## Troubleshooting

**Prompt is too long for the system prompt field:**
Some platforms have character limits. Use the v1.0 prompt as a starting point (shorter), or paste the prompt as the first user message prefixed with "Please follow these instructions for our entire conversation:"

**AI is not searching the web:**
Make sure web search / browsing is enabled in your model's settings. Without it, the AI will still provide analysis but cannot verify current prices.

**Dashboard doesn't render:**
Ensure you have React 18+ and that the import at the top uses the correct hook syntax (`import { useState } from "react"`).

**ASCII dashboards look broken:**
Use a monospaced font in your chat interface. On Claude.ai, code blocks use monospace by default.
