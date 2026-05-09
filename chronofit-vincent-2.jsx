import { useState, useEffect, useCallback } from "react";

const C = {
  bg: "#080810", surface: "#0d0d1a", card: "#111122",
  border: "#1a1a35", cyan: "#00f5ff", purple: "#9d4edd",
  green: "#39ff14", orange: "#ff6b35", text: "#e8e8ff",
  muted: "#4a4a6a", gold: "#ffd700",
};

const WEEKS = [
  { label: "SEMAINE 1", color: C.cyan,   icon: "⚡", cardio: false },
  { label: "SEMAINE 2", color: C.purple, icon: "🔥", cardio: false },
  { label: "SEMAINE 3", color: C.green,  icon: "⬆️", cardio: true  },
  { label: "SEMAINE 4", color: C.orange, icon: "💀", cardio: true  },
];

const REWARDS = [
  { at: 3,  icon: "🥉", title: "NIVEAU 1",       prize: "1 séance de récupération offerte",        color: C.cyan,   xp: "250 XP" },
  { at: 6,  icon: "🥈", title: "NIVEAU 2",       prize: "Bilan nutrition personnalisé offert",      color: C.purple, xp: "500 XP" },
  { at: 9,  icon: "🥇", title: "NIVEAU 3",       prize: "1 séance coaching 1-on-1 offerte",         color: C.gold,   xp: "750 XP" },
  { at: 12, icon: "👑", title: "CHAMPION",       prize: "1 000 € offerts — Félicitations Vincent !", color: C.orange, xp: "1000 XP" },
];

const ONBOARDING = [
  { icon: "🎮", title: "Bienvenue Vincent !", color: C.cyan, lines: [
    "Cette app a été créée spécialement pour toi.",
    "Ton coach Chronofit gère les séances.",
    "Toi, tu coches. C'est tout. Let's go 🚀",
  ]},
  { icon: "💪", title: "Ton entraînement", color: C.purple, lines: [
    "Tu vas chez Chronofit → tu fais ta séance avec le coach.",
    "Après la séance → tu ouvres l'app → tu coches FAIT.",
    "Semaines 1 & 2 : 30 min muscu accent dos.",
    "Semaines 3 & 4 : 30 min muscu + 30 min cardio.",
  ]},
  { icon: "🥗", title: "Ta nutrition", color: C.green, lines: [
    "2 repas par jour. À chaque repas, 2 cases à cocher :",
    "① Un gros blanc de poulet ou poisson ✅",
    "② Ta clear protein ✅",
    "= 128g de protéines dans la journée. Objectif atteint.",
  ]},
  { icon: "🏆", title: "Les récompenses", color: C.gold, lines: [
    "Chaque case cochée → explosion + XP gagné 💥",
    "3 séances → séance récup offerte 🥉",
    "6 séances → bilan nutrition offert 🥈",
    "9 séances → coaching 1-on-1 offert 🥇",
    "12 séances → 1 000 € offerts 👑",
  ]},
];

const PCOLORS = [C.cyan, C.purple, C.green, C.orange, C.gold, "#ff6bff", "#fff", "#ff3355"];

// ─── BURST ────────────────────────────────────────────────────────────────────
function Burst({ id }) {
  const pts = Array.from({ length: 28 }, (_, i) => {
    const a = (i / 28) * 360;
    const d = 120 + Math.random() * 180;
    return {
      color: PCOLORS[i % PCOLORS.length],
      size: 5 + Math.random() * 10,
      dur: +(0.5 + Math.random() * 0.5).toFixed(2),
      delay: +(Math.random() * 0.1).toFixed(2),
      dx: +(Math.cos(a * Math.PI / 180) * d).toFixed(1),
      dy: +(Math.sin(a * Math.PI / 180) * d).toFixed(1),
      round: Math.random() > 0.5,
    };
  });
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 998, overflow: "hidden" }}>
      {pts.map((p, i) => (
        <div key={i} style={{
          position: "absolute", left: "50%", top: "45%",
          width: p.size, height: p.size, borderRadius: p.round ? "50%" : 3,
          background: p.color, boxShadow: `0 0 8px ${p.color}`,
          animation: `bst${id}x${i} ${p.dur}s ease-out ${p.delay}s both`,
        }} />
      ))}
      <style>{pts.map((p, i) => `
        @keyframes bst${id}x${i} {
          0%   { transform:translate(-50%,-50%) scale(1.3); opacity:1; }
          100% { transform:translate(calc(-50% + ${p.dx}px),calc(-50% + ${p.dy}px)) scale(0); opacity:0; }
        }
      `).join("")}</style>
    </div>
  );
}

// ─── REWARD MODAL ─────────────────────────────────────────────────────────────
function RewardModal({ reward, onClose }) {
  const [on, setOn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOn(true), 60); return () => clearTimeout(t); }, []);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.93)", backdropFilter: "blur(14px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.card, border: `2px solid ${reward.color}`, borderRadius: 24, padding: "40px 28px", maxWidth: 380, width: "100%", textAlign: "center", boxShadow: `0 0 80px ${reward.color}55`, transform: on ? "scale(1)" : "scale(0.5)", opacity: on ? 1 : 0, transition: "all 0.45s cubic-bezier(0.34,1.56,0.64,1)" }}>
        <div style={{ fontSize: 80, marginBottom: 16, animation: "pop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.2s both", display: "inline-block", filter: `drop-shadow(0 0 20px ${reward.color})` }}>{reward.icon}</div>
        <div style={{ fontSize: 10, fontFamily: "monospace", letterSpacing: "0.2em", color: reward.color, marginBottom: 8, textShadow: `0 0 10px ${reward.color}` }}>🎉 RÉCOMPENSE DÉBLOQUÉE</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: C.text, marginBottom: 14 }}>{reward.title}</div>
        <div style={{ fontSize: 15, color: "#ddd", lineHeight: 1.7, marginBottom: 20, padding: "14px 16px", background: reward.color + "14", border: `1px solid ${reward.color}33`, borderRadius: 12, fontWeight: 600 }}>🎁 {reward.prize}</div>
        <div style={{ marginBottom: 24 }}>
          <span style={{ background: C.gold + "18", border: `1px solid ${C.gold}55`, borderRadius: 99, padding: "7px 18px", color: C.gold, fontFamily: "monospace", fontWeight: 900, fontSize: 16, textShadow: `0 0 10px ${C.gold}` }}>+{reward.xp}</span>
        </div>
        <button onClick={onClose} style={{ background: reward.color, color: "#000", border: "none", padding: "14px 40px", borderRadius: 12, fontWeight: 900, fontSize: 15, cursor: "pointer", fontFamily: "monospace", boxShadow: `0 0 28px ${reward.color}88` }}>LET'S GO ! →</button>
      </div>
      <style>{`@keyframes pop { 0%{transform:scale(0) rotate(-15deg)} 60%{transform:scale(1.2) rotate(4deg)} 100%{transform:scale(1) rotate(0)} }`}</style>
    </div>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const s = ONBOARDING[step];
  const last = step === ONBOARDING.length - 1;
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'DM Sans','Helvetica Neue',sans-serif" }}>
      <div style={{ maxWidth: 420, width: "100%" }}>
        {/* LOGO */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontFamily: "monospace", fontWeight: 900, fontSize: 18, letterSpacing: "0.06em" }}>
            <span style={{ color: C.cyan, textShadow: `0 0 12px ${C.cyan}` }}>CHRONO</span>
            <span style={{ color: C.purple, textShadow: `0 0 12px ${C.purple}` }}>FIT</span>
            <span style={{ color: C.orange, textShadow: `0 0 12px ${C.orange}` }}>RUN</span>
          </div>
          <div style={{ fontSize: 10, color: C.muted, fontFamily: "monospace", marginTop: 4 }}>SPÉCIAL VINCENT</div>
        </div>

        {/* CARD */}
        <div style={{ background: C.card, border: `2px solid ${s.color}44`, borderRadius: 20, padding: "36px 28px", textAlign: "center", boxShadow: `0 0 40px ${s.color}18`, minHeight: 300, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 20, filter: `drop-shadow(0 0 16px ${s.color})` }}>{s.icon}</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: s.color, marginBottom: 20, textShadow: `0 0 12px ${s.color}` }}>{s.title}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {s.lines.map((l, i) => (
              <div key={i} style={{ fontSize: 14, color: i === 0 ? C.text : "#aaa", lineHeight: 1.65, fontWeight: i === 0 ? 600 : 400 }}>{l}</div>
            ))}
          </div>
        </div>

        {/* DOTS */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, margin: "24px 0" }}>
          {ONBOARDING.map((_, i) => (
            <div key={i} style={{ width: i === step ? 24 : 8, height: 8, borderRadius: 99, background: i === step ? s.color : C.border, transition: "all 0.3s", boxShadow: i === step ? `0 0 8px ${s.color}` : "none" }} />
          ))}
        </div>

        {/* BUTTONS */}
        <div style={{ display: "flex", gap: 10 }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, padding: "14px", background: "transparent", border: `1px solid ${C.border}`, color: C.muted, borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "monospace" }}>← Retour</button>
          )}
          <button onClick={() => last ? onDone() : setStep(s => s + 1)} style={{ flex: 2, padding: "14px", background: s.color, color: "#000", border: "none", borderRadius: 12, fontWeight: 900, fontSize: 15, cursor: "pointer", fontFamily: "monospace", boxShadow: `0 0 20px ${s.color}66` }}>
            {last ? "C'EST PARTI ! 🚀" : "Suivant →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function XPBar({ value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ background: "#0a0a18", borderRadius: 99, height: 8, overflow: "hidden", border: `1px solid ${color}33` }}>
      <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg,${color}bb,${color})`, borderRadius: 99, transition: "width 0.8s ease", boxShadow: `0 0 10px ${color}` }} />
    </div>
  );
}

function Check({ done, onToggle, label, sub, color }) {
  return (
    <div onClick={onToggle} style={{ marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderRadius: 12, cursor: "pointer", background: done ? color + "14" : C.surface, border: `1px solid ${done ? color + "66" : C.border}`, transition: "all 0.2s", boxShadow: done ? `0 0 14px ${color}22` : "none" }}>
      <div style={{ flex: 1, paddingRight: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: done ? C.muted : C.text, textDecoration: done ? "line-through" : "none" }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: C.muted, marginTop: 3, fontFamily: "monospace" }}>{sub}</div>}
      </div>
      <div style={{ width: 30, height: 30, borderRadius: 7, flexShrink: 0, background: done ? color : "transparent", border: `2px solid ${done ? color : C.muted}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", boxShadow: done ? `0 0 12px ${color}` : "none" }}>
        {done && <span style={{ color: "#000", fontSize: 15, fontWeight: 900 }}>✓</span>}
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [ready, setReady]               = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [tab, setTab]                   = useState("training");
  const [training, setTraining]         = useState({});
  const [nutrition, setNutrition]       = useState({});
  const [openWeek, setOpenWeek]         = useState(0);
  const [openDay, setOpenDay]           = useState(1);
  const [burst, setBurst]               = useState(null);
  const [reward, setReward]             = useState(null);
  const [seenRewards, setSeenRewards]   = useState({});

  // ── LOAD ──
  useEffect(() => {
    (async () => {
      try { const v = await window.storage.get("cfr_tr"); if (v) setTraining(JSON.parse(v.value)); } catch {}
      try { const v = await window.storage.get("cfr_nt"); if (v) setNutrition(JSON.parse(v.value)); } catch {}
      try { const v = await window.storage.get("cfr_sr"); if (v) setSeenRewards(JSON.parse(v.value)); } catch {}
      try { await window.storage.get("cfr_ob"); } catch { setShowOnboarding(true); }
      setReady(true);
    })();
  }, []);

  useEffect(() => { if (ready) window.storage.set("cfr_tr", JSON.stringify(training)).catch(() => {}); }, [training, ready]);
  useEffect(() => { if (ready) window.storage.set("cfr_nt", JSON.stringify(nutrition)).catch(() => {}); }, [nutrition, ready]);
  useEffect(() => { if (ready) window.storage.set("cfr_sr", JSON.stringify(seenRewards)).catch(() => {}); }, [seenRewards, ready]);

  const doneOnboarding = () => {
    setShowOnboarding(false);
    window.storage.set("cfr_ob", "1").catch(() => {});
  };

  // ── DERIVED ──
  const tDone = Object.values(training).filter(Boolean).length;
  const nDone = Object.values(nutrition).filter(Boolean).length;
  const totalXP = tDone * 83 + nDone * 5;

  let streak = 0;
  for (let d = 1; d <= 28; d++) {
    if (nutrition[`d${d}_r1f`] && nutrition[`d${d}_r1c`] && nutrition[`d${d}_r2f`] && nutrition[`d${d}_r2c`]) streak++;
    else break;
  }

  // ── ACTIONS ──
  const fireBurst = useCallback(() => {
    const id = Date.now();
    setBurst(id);
    setTimeout(() => setBurst(null), 1300);
  }, []);

  const toggleTraining = useCallback((key) => {
    setTraining(prev => {
      const next = { ...prev, [key]: !prev[key] };
      if (next[key]) {
        fireBurst();
        const count = Object.values(next).filter(Boolean).length;
        const hit = REWARDS.find(r => r.at === count);
        if (hit) {
          setSeenRewards(p => {
            if (p[hit.at]) return p;
            setTimeout(() => setReward(hit), 900);
            return { ...p, [hit.at]: true };
          });
        }
      }
      return next;
    });
  }, [fireBurst]);

  const toggleNut = useCallback((key) => {
    setNutrition(prev => {
      const next = { ...prev, [key]: !prev[key] };
      if (next[key]) fireBurst();
      return next;
    });
  }, [fireBurst]);

  // ── RENDER ──
  if (!ready) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: C.cyan, fontFamily: "monospace", fontSize: 14, textShadow: `0 0 10px ${C.cyan}` }}>LOADING...</div>
    </div>
  );

  if (showOnboarding) return <Onboarding onDone={doneOnboarding} />;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'DM Sans','Helvetica Neue',sans-serif" }}>

      {burst && <Burst id={burst} />}
      {reward && <RewardModal reward={reward} onClose={() => setReward(null)} />}

      {/* scanlines */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,245,255,0.01) 3px,rgba(0,245,255,0.01) 4px)" }} />

      {/* ── TOPBAR ── */}
      <div style={{ padding: "0 5vw", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.cyan}22`, position: "sticky", top: 0, background: C.bg + "f2", backdropFilter: "blur(20px)", zIndex: 50 }}>
        <div>
          <div style={{ fontFamily: "monospace", fontWeight: 900, fontSize: 14, letterSpacing: "0.06em" }}>
            <span style={{ color: C.cyan, textShadow: `0 0 12px ${C.cyan}` }}>CHRONO</span>
            <span style={{ color: C.purple, textShadow: `0 0 12px ${C.purple}` }}>FIT</span>
            <span style={{ color: C.orange, textShadow: `0 0 12px ${C.orange}` }}>RUN</span>
          </div>
          <div style={{ fontSize: 10, color: C.muted, fontFamily: "monospace", letterSpacing: "0.1em" }}>SPÉCIAL VINCENT</div>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, color: C.muted, fontFamily: "monospace" }}>XP</div>
            <div style={{ fontSize: 15, color: C.gold, fontFamily: "monospace", fontWeight: 900, textShadow: `0 0 10px ${C.gold}` }}>⚡ {totalXP}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, color: C.muted, fontFamily: "monospace" }}>STREAK</div>
            <div style={{ fontSize: 15, color: C.orange, fontFamily: "monospace", fontWeight: 900, textShadow: `0 0 10px ${C.orange}` }}>🔥 {streak}j</div>
          </div>
        </div>
      </div>

      {/* ── REWARDS STRIP ── */}
      <div style={{ padding: "8px 5vw", background: C.surface, borderBottom: `1px solid ${C.border}`, display: "flex", gap: 8, overflowX: "auto" }}>
        {REWARDS.map(r => {
          const unlocked = tDone >= r.at;
          return (
            <div key={r.at} style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 99, background: unlocked ? r.color + "18" : C.surface, border: `1px solid ${unlocked ? r.color + "55" : C.border}`, boxShadow: unlocked ? `0 0 12px ${r.color}33` : "none", transition: "all 0.3s" }}>
              <span style={{ fontSize: 16, filter: unlocked ? "none" : "grayscale(1)", opacity: unlocked ? 1 : 0.25 }}>{r.icon}</span>
              <div>
                <div style={{ fontSize: 9, color: unlocked ? r.color : C.muted, fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.08em" }}>{unlocked ? "✓ DÉBLOQUÉ" : `${r.at} SÉANCES`}</div>
                <div style={{ fontSize: 11, color: unlocked ? C.text : C.muted, fontWeight: unlocked ? 600 : 400 }}>{r.prize.length > 30 ? r.prize.slice(0, 30) + "…" : r.prize}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── TABS ── */}
      <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, padding: "0 5vw" }}>
        {[{ id: "training", label: "💪 ENTRAÎNEMENT" }, { id: "nutrition", label: "🥗 NUTRITION" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "14px 20px", background: "transparent", border: "none", borderBottom: `2px solid ${tab === t.id ? C.cyan : "transparent"}`, color: tab === t.id ? C.cyan : C.muted, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "monospace", letterSpacing: "0.08em", textShadow: tab === t.id ? `0 0 8px ${C.cyan}` : "none", transition: "all 0.2s" }}>{t.label}</button>
        ))}
      </div>

      <div style={{ padding: "24px 5vw", position: "relative", zIndex: 1 }}>

        {/* ══ ENTRAÎNEMENT ══ */}
        {tab === "training" && (
          <div>
            {/* hero */}
            <div style={{ marginBottom: 24, padding: "18px 22px", background: `linear-gradient(135deg,${C.cyan}10,${C.purple}08)`, border: `1px solid ${C.cyan}22`, borderRadius: 16 }}>
              <div style={{ fontSize: 11, color: C.cyan, fontFamily: "monospace", letterSpacing: "0.12em", marginBottom: 6 }}>PROGRAMME 4 SEMAINES · CHRONOFIT</div>
              <div style={{ fontSize: 17, fontWeight: 900, marginBottom: 16 }}>Full Body · <span style={{ color: C.cyan }}>Accent dos & muscles profonds</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: C.muted, fontFamily: "monospace" }}>SÉANCES COMPLÉTÉES</span>
                <span style={{ fontSize: 11, color: C.cyan, fontFamily: "monospace", fontWeight: 700 }}>{tDone} / 12</span>
              </div>
              <XPBar value={tDone} max={12} color={C.cyan} />
              {/* next reward */}
              {(() => {
                const next = REWARDS.find(r => tDone < r.at);
                if (!next) return null;
                return (
                  <div style={{ marginTop: 14, padding: "10px 14px", background: next.color + "10", border: `1px solid ${next.color}33`, borderRadius: 10, display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 20 }}>{next.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, color: next.color, fontFamily: "monospace", letterSpacing: "0.1em" }}>PROCHAIN TROPHÉE — {next.at} SÉANCES</div>
                      <div style={{ fontSize: 12, color: C.text, fontWeight: 700, marginTop: 2 }}>{next.prize}</div>
                    </div>
                    <div style={{ fontFamily: "monospace", fontWeight: 900, color: next.color, fontSize: 14, flexShrink: 0 }}>{next.at - tDone} restantes</div>
                  </div>
                );
              })()}
            </div>

            {/* weeks */}
            {WEEKS.map((w, wi) => {
              const weekDone = [0,1,2].filter(di => training[`w${wi}d${di}`]).length;
              return (
                <div key={wi} style={{ marginBottom: 12 }}>
                  <div onClick={() => setOpenWeek(openWeek === wi ? null : wi)} style={{ background: C.card, border: `1px solid ${openWeek === wi ? w.color + "55" : C.border}`, borderRadius: openWeek === wi ? "14px 14px 0 0" : 14, padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: openWeek === wi ? `0 0 20px ${w.color}10` : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: w.color + "15", border: `1px solid ${w.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{w.icon}</div>
                      <div>
                        <div style={{ fontFamily: "monospace", fontWeight: 900, fontSize: 13, color: w.color, textShadow: `0 0 8px ${w.color}`, marginBottom: 4 }}>{w.label}</div>
                        <div style={{ fontSize: 12, color: C.muted }}>30 min muscu · Accent dos & muscles profonds{w.cardio ? " + 30 min cardio" : ""}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 13, color: w.color, fontFamily: "monospace", fontWeight: 700 }}>{weekDone}/3</span>
                      <span style={{ color: C.muted, fontSize: 18, transition: "transform 0.3s", transform: openWeek === wi ? "rotate(180deg)" : "none" }}>▾</span>
                    </div>
                  </div>

                  {openWeek === wi && (
                    <div style={{ background: C.surface, border: `1px solid ${w.color}33`, borderTop: "none", borderRadius: "0 0 14px 14px", padding: "10px 14px 14px" }}>
                      {["JOUR 1","JOUR 2","JOUR 3"].map((day, di) => {
                        const key = `w${wi}d${di}`;
                        const done = !!training[key];
                        return (
                          <div key={di} onClick={() => toggleTraining(key)} style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", borderRadius: 12, cursor: "pointer", background: done ? w.color + "14" : C.card, border: `1px solid ${done ? w.color + "66" : C.border}`, transition: "all 0.2s", boxShadow: done ? `0 0 18px ${w.color}22` : "none" }}>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 15, color: done ? C.muted : C.text, textDecoration: done ? "line-through" : "none" }}>
                                {day} — 30 min muscu · Accent dos{w.cardio ? " + 30 min cardio" : ""}
                              </div>
                              <div style={{ fontSize: 11, color: done ? w.color : C.muted, marginTop: 3, fontFamily: "monospace", fontWeight: done ? 700 : 400 }}>
                                {done ? "✓ VALIDÉE · +83 XP" : "Séance avec coach Chronofit"}
                              </div>
                            </div>
                            <div style={{ width: 36, height: 36, borderRadius: 9, flexShrink: 0, background: done ? w.color : "transparent", border: `2px solid ${done ? w.color : C.muted}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", boxShadow: done ? `0 0 16px ${w.color}` : "none" }}>
                              {done ? <span style={{ color: "#000", fontSize: 18, fontWeight: 900 }}>✓</span> : <span style={{ color: C.muted, fontSize: 16 }}>▶</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {tDone === 12 && (
              <div style={{ marginTop: 8, padding: 28, background: `linear-gradient(135deg,${C.gold}18,${C.orange}10)`, border: `2px solid ${C.gold}`, borderRadius: 20, textAlign: "center", boxShadow: `0 0 60px ${C.gold}33` }}>
                <div style={{ fontSize: 52, marginBottom: 10 }}>👑</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: C.gold, fontFamily: "monospace", textShadow: `0 0 24px ${C.gold}`, marginBottom: 8 }}>CHAMPION CHRONOFIT</div>
                <div style={{ fontSize: 15, color: C.text, fontWeight: 700, marginBottom: 4 }}>1 000 € offerts</div>
                <div style={{ fontSize: 12, color: C.muted, fontFamily: "monospace" }}>4 semaines · 12 séances · Mission accomplie 🏆</div>
              </div>
            )}
          </div>
        )}

        {/* ══ NUTRITION ══ */}
        {tab === "nutrition" && (
          <div>
            {/* stats */}
            <div style={{ marginBottom: 24, padding: "18px 22px", background: `linear-gradient(135deg,${C.purple}10,${C.cyan}08)`, border: `1px solid ${C.purple}33`, borderRadius: 16 }}>
              <div style={{ fontSize: 11, color: C.purple, fontFamily: "monospace", letterSpacing: "0.12em", marginBottom: 12 }}>OBJECTIF PROTÉINES · 28 JOURS</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
                {[
                  { label: "POIDS", value: "80kg", color: C.cyan },
                  { label: "PAR REPAS", value: "64g", color: C.purple },
                  { label: "PAR JOUR", value: "128g", color: C.green },
                  { label: "STREAK", value: `${streak}j 🔥`, color: C.orange },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: "center", padding: "10px 4px", background: C.card, borderRadius: 10, border: `1px solid ${s.color}22` }}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: s.color, fontFamily: "monospace", textShadow: `0 0 8px ${s.color}` }}>{s.value}</div>
                    <div style={{ fontSize: 9, color: C.muted, letterSpacing: "0.08em", marginTop: 3 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: C.muted, fontFamily: "monospace" }}>REPAS VALIDÉS</span>
                <span style={{ fontSize: 11, color: C.purple, fontFamily: "monospace", fontWeight: 700 }}>{nDone}/{28 * 4}</span>
              </div>
              <XPBar value={nDone} max={28 * 4} color={C.purple} />
            </div>

            {/* day grid */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: C.muted, fontFamily: "monospace", letterSpacing: "0.1em", marginBottom: 12 }}>SÉLECTIONNE TON JOUR :</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {Array.from({ length: 28 }, (_, i) => i + 1).map(d => {
                  const full = nutrition[`d${d}_r1f`] && nutrition[`d${d}_r1c`] && nutrition[`d${d}_r2f`] && nutrition[`d${d}_r2c`];
                  const partial = nutrition[`d${d}_r1f`] || nutrition[`d${d}_r1c`] || nutrition[`d${d}_r2f`] || nutrition[`d${d}_r2c`];
                  const isOpen = openDay === d;
                  return (
                    <button key={d} onClick={() => setOpenDay(isOpen ? null : d)} style={{ width: 40, height: 40, borderRadius: 8, border: `1px solid ${isOpen ? C.cyan + "99" : full ? C.green + "77" : partial ? C.orange + "55" : C.border}`, background: isOpen ? C.cyan + "22" : full ? C.green + "15" : partial ? C.orange + "10" : C.card, color: isOpen ? C.cyan : full ? C.green : partial ? C.orange : C.muted, fontFamily: "monospace", fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", boxShadow: full ? `0 0 10px ${C.green}33` : "none" }}>
                      {full ? "✓" : d}
                    </button>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
                {[{ color: C.green, l: "Complet" }, { color: C.orange, l: "Partiel" }, { color: C.muted, l: "À faire" }].map(x => (
                  <div key={x.l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: x.color }} />
                    <span style={{ fontSize: 10, color: C.muted, fontFamily: "monospace" }}>{x.l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* selected day */}
            {openDay && (
              <div style={{ background: C.card, border: `1px solid ${C.cyan}33`, borderRadius: 16, overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontFamily: "monospace", fontWeight: 900, fontSize: 14, color: C.cyan, textShadow: `0 0 8px ${C.cyan}` }}>JOUR {openDay}</div>
                    <div style={{ fontSize: 11, color: C.muted, fontFamily: "monospace" }}>2 repas · objectif 128g protéines</div>
                  </div>
                  {nutrition[`d${openDay}_r1f`] && nutrition[`d${openDay}_r1c`] && nutrition[`d${openDay}_r2f`] && nutrition[`d${openDay}_r2c`] && (
                    <span style={{ color: C.green, fontFamily: "monospace", fontSize: 12, fontWeight: 900, textShadow: `0 0 8px ${C.green}` }}>✓ JOUR COMPLET</span>
                  )}
                </div>

                <div style={{ padding: "12px 14px 14px" }}>
                  <div style={{ fontSize: 10, color: C.muted, fontFamily: "monospace", letterSpacing: "0.1em", marginBottom: 8 }}>REPAS 1 — MIDI</div>
                  <Check done={!!nutrition[`d${openDay}_r1f`]} onToggle={() => toggleNut(`d${openDay}_r1f`)} label="🍗 Poulet ou 🐟 Poisson consommé" sub="Gros blanc de poulet ou gros morceau de poisson" color={C.cyan} />
                  <Check done={!!nutrition[`d${openDay}_r1c`]} onToggle={() => toggleNut(`d${openDay}_r1c`)} label="💧 Clear protein consommée" sub="1 portion · complète jusqu'à 64g pour ce repas" color={C.purple} />

                  <div style={{ height: 1, background: C.border, margin: "14px 0" }} />

                  <div style={{ fontSize: 10, color: C.muted, fontFamily: "monospace", letterSpacing: "0.1em", marginBottom: 8 }}>REPAS 2 — SOIR</div>
                  <Check done={!!nutrition[`d${openDay}_r2f`]} onToggle={() => toggleNut(`d${openDay}_r2f`)} label="🍗 Poulet ou 🐟 Poisson consommé" sub="Gros blanc de poulet ou gros morceau de poisson" color={C.cyan} />
                  <Check done={!!nutrition[`d${openDay}_r2c`]} onToggle={() => toggleNut(`d${openDay}_r2c`)} label="💧 Clear protein consommée" sub="1 portion · complète jusqu'à 64g pour ce repas" color={C.purple} />

                  {nutrition[`d${openDay}_r1f`] && nutrition[`d${openDay}_r1c`] && nutrition[`d${openDay}_r2f`] && nutrition[`d${openDay}_r2c`] && (
                    <div style={{ marginTop: 14, padding: "16px", background: `${C.green}10`, border: `1px solid ${C.green}44`, borderRadius: 12, textAlign: "center" }}>
                      <div style={{ fontSize: 28, marginBottom: 6 }}>🥇</div>
                      <div style={{ fontSize: 16, fontWeight: 900, color: C.green, fontFamily: "monospace", textShadow: `0 0 14px ${C.green}` }}>128g ATTEINTS · GG</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <style>{`* { box-sizing:border-box; margin:0; padding:0; }`}</style>
    </div>
  );
}
