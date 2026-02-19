import { useState, useEffect, useRef } from "react";

const PHASES = [
  { id: 1, name: "Foundation", range: "$500–$2K", strategies: ["Swing Trading"], color: "#3B82F6", min: 500, max: 2000 },
  { id: 2, name: "Momentum", range: "$2K–$10K", strategies: ["Swing Trading", "Momentum/Breakout"], color: "#8B5CF6", min: 2000, max: 10000 },
  { id: 3, name: "Acceleration", range: "$10K–$50K", strategies: ["Swing", "Momentum", "Options"], color: "#F59E0B", min: 10000, max: 50000 },
  { id: 4, name: "Income Replace", range: "$50K+", strategies: ["Swing", "Momentum", "Options", "Dividends"], color: "#10B981", min: 50000, max: 200000 },
];

const SAMPLE_TRADES = [
  { id: 1, date: "2026-02-10", ticker: "AAPL", action: "BUY", entry: 182.5, exit: 189.2, shares: 5, strategy: "Swing", status: "closed", pl: 3.67 },
  { id: 2, date: "2026-02-12", ticker: "AMD", action: "BUY", entry: 121.0, exit: 118.5, shares: 8, strategy: "Swing", status: "closed", pl: -2.07 },
  { id: 3, date: "2026-02-14", ticker: "NVDA", action: "BUY", entry: 720.0, exit: 745.0, shares: 1, strategy: "Momentum", status: "closed", pl: 3.47 },
  { id: 4, date: "2026-02-17", ticker: "XLE", action: "BUY", entry: 89.3, exit: null, shares: 10, strategy: "Swing", status: "open", pl: null },
  { id: 5, date: "2026-02-18", ticker: "META", action: "BUY", entry: 510.2, exit: null, shares: 2, strategy: "Momentum", status: "open", pl: null },
];

const SAMPLE_PLANS = [
  { id: 1, ticker: "MSFT", bullish: "Breaks above $420 → Buy 3 shares", bearish: "Drops below $405 → Wait for $395", sideways: "No trigger by Feb 28 → Remove", expiry: "2026-02-28", status: "active" },
  { id: 2, ticker: "GOOGL", bullish: "Breaks above $175 → Buy 6 shares", bearish: "Drops below $168 → Avoid", sideways: "Consolidates 5+ days → Reassess", expiry: "2026-03-01", status: "active" },
  { id: 3, ticker: "AMZN", bullish: "Reclaims $195 with volume → Buy 5 shares", bearish: "Loses $185 → Short-term avoid", sideways: "Range-bound → Wait for Monday briefing", expiry: "2026-02-26", status: "active" },
];

const EMOTION_STATES = {
  calm: { label: "Calm & Focused", icon: "🧘", color: "#10B981", bg: "rgba(16,185,129,0.12)" },
  anxious: { label: "Anxious", icon: "😰", color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
  frustrated: { label: "Frustrated", icon: "😤", color: "#EF4444", bg: "rgba(239,68,68,0.12)" },
  euphoric: { label: "Euphoric", icon: "🚀", color: "#8B5CF6", bg: "rgba(139,92,246,0.12)" },
  defeated: { label: "Defeated", icon: "😞", color: "#6B7280", bg: "rgba(107,114,128,0.12)" },
};

function formatCurrency(val) {
  if (val == null) return "—";
  return val < 0 ? `-$${Math.abs(val).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `$${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function ProgressBar({ value, max, color, height = 6 }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ width: "100%", height, background: "rgba(255,255,255,0.06)", borderRadius: height / 2, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: height / 2, transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)" }} />
    </div>
  );
}

function PhaseIndicator({ currentCapital }) {
  const phase = PHASES.find((p, i) => i === PHASES.length - 1 || currentCapital < PHASES[i + 1].min) || PHASES[0];
  const phaseProgress = Math.min(((currentCapital - phase.min) / (phase.max - phase.min)) * 100, 100);
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 16, padding: "20px 24px", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: "rgba(255,255,255,0.4)", marginBottom: 4, fontFamily: "'JetBrains Mono', monospace" }}>Current Phase</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: phase.color, fontFamily: "'Space Grotesk', sans-serif" }}>Phase {phase.id} — {phase.name}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: "rgba(255,255,255,0.4)", marginBottom: 4, fontFamily: "'JetBrains Mono', monospace" }}>Capital Range</div>
          <div style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", fontFamily: "'JetBrains Mono', monospace" }}>{phase.range}</div>
        </div>
      </div>
      <ProgressBar value={phaseProgress} max={100} color={phase.color} height={8} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
        {PHASES.map((p) => (
          <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.id <= phase.id ? p.color : "rgba(255,255,255,0.1)" }} />
            <span style={{ fontSize: 11, color: p.id <= phase.id ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)", fontFamily: "'JetBrains Mono', monospace" }}>{p.id}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 6 }}>
        {phase.strategies.map((s) => (
          <span key={s} style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, background: `${phase.color}22`, color: phase.color, border: `1px solid ${phase.color}44`, fontFamily: "'JetBrains Mono', monospace" }}>{s}</span>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, color, icon }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: "16px 20px", border: "1px solid rgba(255,255,255,0.06)", flex: 1, minWidth: 140 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: "rgba(255,255,255,0.4)", marginBottom: 6, fontFamily: "'JetBrains Mono', monospace" }}>{label}</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: color || "#fff", fontFamily: "'Space Grotesk', sans-serif" }}>{value}</div>
          {sub && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2, fontFamily: "'JetBrains Mono', monospace" }}>{sub}</div>}
        </div>
        {icon && <span style={{ fontSize: 20, opacity: 0.6 }}>{icon}</span>}
      </div>
    </div>
  );
}

function TradeJournal({ trades }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 4px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
        <thead>
          <tr>
            {["#", "Date", "Ticker", "Strategy", "Entry", "Exit", "P/L", "Status"].map((h) => (
              <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: "rgba(255,255,255,0.35)", fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 500, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {trades.map((t, i) => {
            const isOpen = t.status === "open";
            const isWin = !isOpen && t.pl > 0;
            const isLoss = !isOpen && t.pl < 0;
            return (
              <tr key={t.id} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                <td style={{ padding: "10px 12px", color: "rgba(255,255,255,0.3)" }}>{t.id}</td>
                <td style={{ padding: "10px 12px", color: "rgba(255,255,255,0.7)" }}>{t.date}</td>
                <td style={{ padding: "10px 12px", color: "#fff", fontWeight: 600 }}>{t.ticker}</td>
                <td style={{ padding: "10px 12px" }}>
                  <span style={{ padding: "2px 8px", borderRadius: 10, fontSize: 10, background: t.strategy === "Swing" ? "rgba(59,130,246,0.15)" : "rgba(139,92,246,0.15)", color: t.strategy === "Swing" ? "#3B82F6" : "#8B5CF6" }}>{t.strategy}</span>
                </td>
                <td style={{ padding: "10px 12px", color: "rgba(255,255,255,0.7)" }}>{formatCurrency(t.entry)}</td>
                <td style={{ padding: "10px 12px", color: isOpen ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.7)" }}>{isOpen ? "—" : formatCurrency(t.exit)}</td>
                <td style={{ padding: "10px 12px", color: isOpen ? "rgba(255,255,255,0.3)" : isWin ? "#10B981" : "#EF4444", fontWeight: 600 }}>{isOpen ? "—" : `${t.pl > 0 ? "+" : ""}${t.pl.toFixed(2)}%`}</td>
                <td style={{ padding: "10px 12px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    {isOpen ? "🔵" : isWin ? "✅" : "❌"}
                    <span style={{ color: isOpen ? "#3B82F6" : isWin ? "#10B981" : "#EF4444", fontSize: 11 }}>{isOpen ? "OPEN" : isWin ? "WIN" : "LOSS"}</span>
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ConditionalPlans({ plans }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {plans.map((p) => (
        <div key={p.id} style={{ background: "rgba(255,255,255,0.02)", borderRadius: 12, padding: "16px 20px", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "'Space Grotesk', sans-serif" }}>🎯 {p.ticker}</span>
              <span style={{ padding: "2px 8px", borderRadius: 10, fontSize: 10, background: p.status === "active" ? "rgba(16,185,129,0.15)" : "rgba(107,114,128,0.15)", color: p.status === "active" ? "#10B981" : "#6B7280", fontFamily: "'JetBrains Mono', monospace" }}>{p.status.toUpperCase()}</span>
            </div>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "'JetBrains Mono', monospace" }}>Expires: {p.expiry}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[
              { label: "BULLISH", text: p.bullish, color: "#10B981", icon: "📈" },
              { label: "BEARISH", text: p.bearish, color: "#EF4444", icon: "📉" },
              { label: "SIDEWAYS", text: p.sideways, color: "#F59E0B", icon: "➡️" },
            ].map((s) => (
              <div key={s.label} style={{ padding: "10px 12px", borderRadius: 8, background: `${s.color}08`, border: `1px solid ${s.color}20` }}>
                <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 1.2, color: s.color, marginBottom: 4, fontFamily: "'JetBrains Mono', monospace" }}>{s.icon} {s.label}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", lineHeight: 1.4, fontFamily: "'JetBrains Mono', monospace" }}>{s.text}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function GoalTracker({ current, target = 100000 }) {
  const daily = current > 0 ? ((current * 0.05) / 21).toFixed(2) : "0.00";
  const pct = Math.min((current / target) * 100, 100);
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 16, padding: "20px 24px", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: "rgba(255,255,255,0.4)", marginBottom: 12, fontFamily: "'JetBrains Mono', monospace" }}>Progress to $400/Day Goal</div>
      <div style={{ position: "relative", marginBottom: 8 }}>
        <ProgressBar value={pct} max={100} color="#10B981" height={12} />
        <div style={{ position: "absolute", top: -20, left: `${Math.min(pct, 95)}%`, transform: "translateX(-50%)", fontSize: 10, color: "#10B981", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>▼ {formatCurrency(current)}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "'JetBrains Mono', monospace", marginBottom: 14 }}>
        <span>$0</span>
        <span>$25K</span>
        <span>$50K</span>
        <span>$100K+</span>
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        <div style={{ flex: 1, padding: "10px 14px", background: "rgba(16,185,129,0.08)", borderRadius: 10, border: "1px solid rgba(16,185,129,0.15)" }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 1, color: "rgba(255,255,255,0.4)", fontFamily: "'JetBrains Mono', monospace" }}>Est. Daily Income</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#10B981", fontFamily: "'Space Grotesk', sans-serif" }}>${daily}</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "'JetBrains Mono', monospace" }}>at 5% monthly</div>
        </div>
        <div style={{ flex: 1, padding: "10px 14px", background: "rgba(245,158,11,0.08)", borderRadius: 10, border: "1px solid rgba(245,158,11,0.15)" }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 1, color: "rgba(255,255,255,0.4)", fontFamily: "'JetBrains Mono', monospace" }}>Target Daily</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#F59E0B", fontFamily: "'Space Grotesk', sans-serif" }}>$400.00</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "'JetBrains Mono', monospace" }}>job replacement</div>
        </div>
      </div>
    </div>
  );
}

function EmotionalHealth({ state, onChange }) {
  const current = EMOTION_STATES[state];
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 16, padding: "20px 24px", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: "rgba(255,255,255,0.4)", marginBottom: 12, fontFamily: "'JetBrains Mono', monospace" }}>Emotional Health Check</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, padding: "12px 16px", borderRadius: 10, background: current.bg, border: `1px solid ${current.color}30` }}>
        <span style={{ fontSize: 28 }}>{current.icon}</span>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: current.color, fontFamily: "'Space Grotesk', sans-serif" }}>{current.label}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "'JetBrains Mono', monospace" }}>
            {state === "calm" && "Optimal state for trading decisions"}
            {state === "anxious" && "Consider smaller positions, tighter stops"}
            {state === "frustrated" && "⚠️ Pause recommended — avoid revenge trades"}
            {state === "euphoric" && "⚠️ Stick to position sizing rules"}
            {state === "defeated" && "Review wins in journal. Small steps forward."}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {Object.entries(EMOTION_STATES).map(([key, val]) => (
          <button key={key} onClick={() => onChange(key)} style={{ padding: "6px 12px", borderRadius: 20, border: state === key ? `2px solid ${val.color}` : "1px solid rgba(255,255,255,0.08)", background: state === key ? val.bg : "rgba(255,255,255,0.02)", color: state === key ? val.color : "rgba(255,255,255,0.4)", fontSize: 12, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", transition: "all 0.2s" }}>
            {val.icon} {val.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function AllocationChart({ trades }) {
  const openTrades = trades.filter((t) => t.status === "open");
  const invested = openTrades.reduce((sum, t) => sum + t.entry * t.shares, 0);
  const totalCap = 2450;
  const cash = totalCap - invested;
  const allocations = [
    { label: "Swing", pct: Math.round((openTrades.filter((t) => t.strategy === "Swing").reduce((s, t) => s + t.entry * t.shares, 0) / totalCap) * 100), color: "#3B82F6" },
    { label: "Momentum", pct: Math.round((openTrades.filter((t) => t.strategy === "Momentum").reduce((s, t) => s + t.entry * t.shares, 0) / totalCap) * 100), color: "#8B5CF6" },
    { label: "Options", pct: 0, color: "#F59E0B", locked: true },
    { label: "Dividends", pct: 0, color: "#10B981", locked: true },
    { label: "Cash", pct: Math.round((cash / totalCap) * 100), color: "#6B7280" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {allocations.map((a) => (
        <div key={a.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 80, fontSize: 11, color: a.locked ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.6)", fontFamily: "'JetBrains Mono', monospace", textAlign: "right" }}>
            {a.label} {a.locked && "🔒"}
          </div>
          <div style={{ flex: 1 }}>
            <ProgressBar value={a.pct} max={100} color={a.locked ? "rgba(255,255,255,0.05)" : a.color} height={10} />
          </div>
          <div style={{ width: 35, fontSize: 11, color: a.locked ? "rgba(255,255,255,0.15)" : a.color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{a.pct}%</div>
        </div>
      ))}
    </div>
  );
}

function TabButton({ active, children, onClick }) {
  return (
    <button onClick={onClick} style={{ padding: "8px 18px", borderRadius: 10, border: active ? "1px solid rgba(255,255,255,0.15)" : "1px solid transparent", background: active ? "rgba(255,255,255,0.06)" : "transparent", color: active ? "#fff" : "rgba(255,255,255,0.35)", fontSize: 12, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", transition: "all 0.2s", fontWeight: active ? 600 : 400 }}>
      {children}
    </button>
  );
}

export default function StockPathDashboard() {
  const [tab, setTab] = useState("overview");
  const [emotion, setEmotion] = useState("calm");
  const [startingCapital] = useState(1500);
  const [currentCapital] = useState(2450);
  const [trades] = useState(SAMPLE_TRADES);
  const [plans] = useState(SAMPLE_PLANS);
  const closedTrades = trades.filter((t) => t.status === "closed");
  const wins = closedTrades.filter((t) => t.pl > 0).length;
  const losses = closedTrades.filter((t) => t.pl < 0).length;
  const winRate = closedTrades.length > 0 ? ((wins / closedTrades.length) * 100).toFixed(1) : "0.0";
  const totalPL = currentCapital - startingCapital;
  const totalPLPct = ((totalPL / startingCapital) * 100).toFixed(1);
  const avgWin = closedTrades.filter((t) => t.pl > 0).length > 0 ? (closedTrades.filter((t) => t.pl > 0).reduce((s, t) => s + t.pl, 0) / wins).toFixed(2) : "0.00";
  const avgLoss = losses > 0 ? (closedTrades.filter((t) => t.pl < 0).reduce((s, t) => s + Math.abs(t.pl), 0) / losses).toFixed(2) : "0.00";

  return (
    <div style={{ minHeight: "100vh", background: "#0A0B0F", color: "#fff", fontFamily: "'Space Grotesk', -apple-system, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #10B981 0%, #3B82F6 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📈</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3 }}>StockPath Navigator</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: "'JetBrains Mono', monospace" }}>v3.0 • Interactive Dashboard</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ padding: "4px 12px", borderRadius: 20, background: EMOTION_STATES[emotion].bg, border: `1px solid ${EMOTION_STATES[emotion].color}30` }}>
            <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>{EMOTION_STATES[emotion].icon} {EMOTION_STATES[emotion].label}</span>
          </div>
          <div style={{ padding: "4px 12px", borderRadius: 20, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
            <span style={{ fontSize: 12, color: "#10B981", fontFamily: "'JetBrains Mono', monospace" }}>Phase 1</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: "12px 24px", display: "flex", gap: 4, borderBottom: "1px solid rgba(255,255,255,0.04)", overflowX: "auto" }}>
        {[
          { id: "overview", label: "📊 Overview" },
          { id: "journal", label: "📓 Journal" },
          { id: "plans", label: "🎯 Plans" },
          { id: "emotional", label: "🧠 Mindset" },
          { id: "goal", label: "🏁 Goal" },
        ].map((t) => (
          <TabButton key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>{t.label}</TabButton>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "20px 24px", maxWidth: 900, margin: "0 auto" }}>
        
        {tab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <StatCard label="Portfolio Value" value={formatCurrency(currentCapital)} sub={`Started: ${formatCurrency(startingCapital)}`} icon="💼" />
              <StatCard label="Total P/L" value={`${totalPL >= 0 ? "+" : ""}${formatCurrency(totalPL)}`} sub={`${totalPLPct}% return`} color={totalPL >= 0 ? "#10B981" : "#EF4444"} icon={totalPL >= 0 ? "📈" : "📉"} />
              <StatCard label="Win Rate" value={`${winRate}%`} sub={`${wins}W / ${losses}L`} color={parseFloat(winRate) >= 55 ? "#10B981" : "#F59E0B"} icon="🎯" />
              <StatCard label="Active Plans" value={`${plans.filter((p) => p.status === "active").length}/5`} sub="Conditional trades" icon="📋" />
            </div>
            <PhaseIndicator currentCapital={currentCapital} />
            <div>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: "rgba(255,255,255,0.4)", marginBottom: 12, fontFamily: "'JetBrains Mono', monospace" }}>Portfolio Allocation</div>
              <AllocationChart trades={trades} />
            </div>
            <div>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: "rgba(255,255,255,0.4)", marginBottom: 12, fontFamily: "'JetBrains Mono', monospace" }}>Performance Metrics</div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <StatCard label="Avg Win" value={`+${avgWin}%`} color="#10B981" />
                <StatCard label="Avg Loss" value={`-${avgLoss}%`} color="#EF4444" />
                <StatCard label="Profit Factor" value={(avgWin / (avgLoss || 1)).toFixed(2)} color="#3B82F6" />
                <StatCard label="Completed" value={closedTrades.length} sub="trades" />
              </div>
            </div>
          </div>
        )}

        {tab === "journal" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>📓 Trade Journal</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "'JetBrains Mono', monospace" }}>{trades.length} total • {trades.filter((t) => t.status === "open").length} open</div>
            </div>
            <TradeJournal trades={trades} />
            <div style={{ background: "rgba(245,158,11,0.08)", borderRadius: 12, padding: "14px 18px", border: "1px solid rgba(245,158,11,0.15)" }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.2, color: "#F59E0B", marginBottom: 6, fontFamily: "'JetBrains Mono', monospace" }}>💡 Latest Lesson</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>AMD loss was within risk tolerance (2.1%). Stop-loss held as planned. The thesis was valid but market sector rotation worked against tech that day. Process was correct — outcome was just variance.</div>
            </div>
          </div>
        )}

        {tab === "plans" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>🎯 Conditional Trade Plans</div>
              <div style={{ padding: "4px 12px", borderRadius: 20, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", fontSize: 11, color: "#10B981", fontFamily: "'JetBrains Mono', monospace" }}>{plans.filter((p) => p.status === "active").length}/5 slots used</div>
            </div>
            <div style={{ background: "rgba(59,130,246,0.08)", borderRadius: 12, padding: "12px 16px", border: "1px solid rgba(59,130,246,0.15)", fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.5, fontFamily: "'JetBrains Mono', monospace" }}>
              💡 Each plan has 3 scenarios (bullish, bearish, sideways) so you're prepared no matter what happens. Plans expire automatically — no stale trades cluttering your watchlist.
            </div>
            <ConditionalPlans plans={plans} />
          </div>
        )}

        {tab === "emotional" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>🧠 Mindset & Emotional Health</div>
            <EmotionalHealth state={emotion} onChange={setEmotion} />
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 16, padding: "20px 24px", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: "rgba(255,255,255,0.4)", marginBottom: 14, fontFamily: "'JetBrains Mono', monospace" }}>Trading Discipline Checklist</div>
              {[
                { text: "Position sized correctly (≤2% risk)", checked: true },
                { text: "Stop-loss set before entry", checked: true },
                { text: "Thesis written before buying", checked: true },
                { text: "Verified with 2+ sources", checked: false },
                { text: "Checked emotional state before trading", checked: true },
                { text: "No revenge trades today", checked: true },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 5 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <span style={{ fontSize: 14 }}>{item.checked ? "✅" : "⬜"}</span>
                  <span style={{ fontSize: 13, color: item.checked ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)", fontFamily: "'JetBrains Mono', monospace" }}>{item.text}</span>
                </div>
              ))}
            </div>
            {emotion !== "calm" && (
              <div style={{ background: `${EMOTION_STATES[emotion].color}10`, borderRadius: 16, padding: "20px 24px", border: `1px solid ${EMOTION_STATES[emotion].color}25` }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: EMOTION_STATES[emotion].color, marginBottom: 8 }}>
                  {emotion === "frustrated" && "🔔 Navigator Advice: Step Back"}
                  {emotion === "anxious" && "🔔 Navigator Advice: Ground Yourself"}
                  {emotion === "euphoric" && "🔔 Navigator Advice: Stay Disciplined"}
                  {emotion === "defeated" && "🔔 Navigator Advice: You're Still Here"}
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>
                  {emotion === "frustrated" && "Trading angry is the fastest way to turn a small loss into a big one. Your win rate is still above target. Close your charts, take a walk, and come back in 24 hours with fresh eyes. The market will still be there."}
                  {emotion === "anxious" && "Check your actual risk: your stop-losses are set, your position sizes are within rules, and your maximum loss per trade is capped at 2%. The fear feels bigger than the reality. Focus on the process, not the P/L screen."}
                  {emotion === "euphoric" && "Great trades build confidence — but overconfidence builds losses. Your Phase 1 rules exist for a reason. Don't increase position sizes after a win streak. Channel this energy into preparing your next disciplined setup."}
                  {emotion === "defeated" && "Every professional trader has losing streaks. You've completed trades, maintained discipline, and you're still standing. That IS progress. Focus on one small, achievable action today. The skill compounds before the money does."}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "goal" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>🏁 $400/Day Goal Tracker</div>
            <GoalTracker current={currentCapital} />
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 16, padding: "20px 24px", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: "rgba(255,255,255,0.4)", marginBottom: 14, fontFamily: "'JetBrains Mono', monospace" }}>The Math (Transparent)</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { scenario: "$50K Portfolio", monthly: "16.8%", difficulty: "Very Aggressive", color: "#EF4444" },
                  { scenario: "$100K Portfolio", monthly: "8.4%", difficulty: "Aggressive", color: "#F59E0B" },
                  { scenario: "$168K Portfolio", monthly: "5.0%", difficulty: "Achievable", color: "#10B981" },
                  { scenario: "$250K Portfolio", monthly: "3.4%", difficulty: "Conservative", color: "#3B82F6" },
                ].map((r) => (
                  <div key={r.scenario} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.02)" }}>
                    <div style={{ flex: 1, fontSize: 13, color: "rgba(255,255,255,0.7)", fontFamily: "'JetBrains Mono', monospace" }}>{r.scenario}</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontFamily: "'JetBrains Mono', monospace" }}>→ {r.monthly}/mo needed</div>
                    <span style={{ padding: "2px 10px", borderRadius: 20, fontSize: 10, background: `${r.color}15`, color: r.color, fontFamily: "'JetBrains Mono', monospace" }}>{r.difficulty}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: "rgba(16,185,129,0.06)", borderRadius: 16, padding: "20px 24px", border: "1px solid rgba(16,185,129,0.12)" }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
                <span style={{ fontWeight: 600, color: "#10B981" }}>Your current path:</span> At {formatCurrency(currentCapital)} with a {winRate}% win rate, you're building the foundation. The most important thing right now isn't the dollar amount — it's developing the discipline and pattern recognition that will compound as your capital grows. Every Phase 1 trade is practice for when the stakes are higher.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.04)", textAlign: "center", marginTop: 20 }}>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", fontFamily: "'JetBrains Mono', monospace" }}>
          StockPath Navigator v3.0 • AI-powered educational tool • Not financial advice • Verify all data independently
        </div>
      </div>
    </div>
  );
}
