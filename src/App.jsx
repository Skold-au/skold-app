import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// BRAND CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════
const GOLD = "#C8A84B";
const BG = "#080808";
const CREWS = {
  FIRM: { label: "THE FIRM", color: "#7A1A1A", accent: "#A52020", text: "#FF6B6B" },
  MOD:  { label: "THE MOD",  color: "#D4A017", accent: "#E8B520", text: "#FFD04A" },
  GRIM: { label: "THE GRIM", color: "#1E3A5F", accent: "#2E5080", text: "#6B9AC4" },
};
const RANKS = ["PROSPECT", "★", "★★", "★★★"];
const ACTIVITY_TYPES = ["LIFT","RUN","CYCLE","SWIM","SPAR","YOGA","HYROX","TRAIL","OPEN"];

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED MOCK STATE
// ═══════════════════════════════════════════════════════════════════════════════
const INIT_MEMBER = {
  handle: "SID", crew: "FIRM", rank: 2,
  foundingNumber: "0047", drop: "001", joinDate: "MAY 2026",
  streak: 4, streakBest: 15,
  kashEarned: 640, kashBought: 200, kashBalance: 840, kashSpent: 425,
  activitiesCompleted: 9, wagerWins: 1, wagerLosses: 0,
  starDaysTotal: 12, prizeEntries: 4, skocialPosts: 3, nfcTaps: 2,
  bio: "Show up. That's the whole thing.",
  goldStar: false, goldPinProgress: 1,
  healthConnected: true, healthPlatform: "APPLE HEALTH",
  photo: null,
};

const INIT_STAR_POINTS = [
  { id:"move",    label:"MOVE",    icon:"◈", desc:"8,000 steps",         unit:"STEPS", target:8000, current:6240 },
  { id:"train",   label:"TRAIN",   icon:"◉", desc:"Workout session",      unit:"MIN",   target:45,   current:45   },
  { id:"hydrate", label:"HYDRATE", icon:"◇", desc:"Daily sachet",         unit:"LOG",   target:1,    current:1    },
  { id:"recover", label:"RECOVER", icon:"◌", desc:"7hrs sleep",           unit:"HRS",   target:7,    current:5.5  },
  { id:"fuel",    label:"FUEL",    icon:"◆", desc:"Crew stack",           unit:"LOG",   target:1,    current:0    },
  { id:"skocial", label:"SKOCIAL", icon:"◎", desc:"Activity posted",      unit:"ACT",   target:1,    current:1    },
  { id:"streak",  label:"STREAK",  icon:"▲", desc:"Consecutive days",     unit:"DAYS",  target:1,    current:1    },
  { id:"connect", label:"CONNECT", icon:"◫", desc:"Crew interaction",     unit:"INT",   target:1,    current:0    },
];

const INIT_PRIZES = [
  { id:1, tier:1, label:"HYDRATION BOX",       desc:"30-sachet SKOLD Hydration box. Your crew's blend.",                            cost:50,   entries:142, myEntries:0, closes:"3D 14H", major:false },
  { id:2, tier:1, label:"CREW PIN + CAP",       desc:"Magnetic enamel crew pin and rank cap. Ships to your door.",                   cost:75,   entries:89,  myEntries:2, closes:"5D 02H", major:false },
  { id:3, tier:2, label:"FULL RITUAL — 3 MONTHS",desc:"Morning stack + RECOVER. 90 days.",                                          cost:200,  entries:44,  myEntries:0, closes:"7D 00H", major:false },
  { id:4, tier:2, label:"IPAD PRO",             desc:"iPad Pro 13\". No conditions. Winner announced in-app then Instagram 24hrs.", cost:350,  entries:203, myEntries:1, closes:"12D 08H",major:false },
  { id:5, tier:3, label:"VESPA ET4 — CHROME",   desc:"A chrome Vespa ET4. Fully restored. Perth pickup or freight Australia-wide. This is the one.", cost:1000, entries:31, myEntries:0, closes:"21D 00H", major:true },
];

const SKOCIAL_POSTS = [
  { id:1, member:"SID",      handle:"sid_the_firm",  crew:"FIRM", rank:2, activity:"HYROX",  location:"Functional Fitness Co, Leederville", time:"06:30", date:"TODAY",    spots:3, spotsLeft:1, kash:150, wagered:true,  tappedIn:["ROLLO","ACE"], rankGate:1, posted:"14 MIN AGO", avatar:"S" },
  { id:2, member:"ROLLO",    handle:"rollo_the_mod", crew:"MOD",  rank:1, activity:"YOGA",   location:"East Perth Riverbank",                time:"07:00", date:"TOMORROW", spots:6, spotsLeft:4, kash:0,   wagered:false, tappedIn:[],              rankGate:0, posted:"1 HR AGO",  avatar:"R" },
  { id:3, member:"ACE",      handle:"ace_the_grim",  crew:"GRIM", rank:3, activity:"SPAR",   location:"Undisclosed. Tap in.",                time:"20:00", date:"SAT",      spots:2, spotsLeft:2, kash:500, wagered:true,  tappedIn:[],              rankGate:2, posted:"3 HR AGO",  avatar:"A" },
  { id:4, member:"GHOST_44", handle:"ghost_44",      crew:"GRIM", rank:1, activity:"RUN",    location:"Bold Park, Floreat",                  time:"05:45", date:"TOMORROW", spots:4, spotsLeft:3, kash:80,  wagered:true,  tappedIn:["SID"],         rankGate:0, posted:"5 HR AGO",  avatar:"G" },
  { id:5, member:"VALE",     handle:"vale_mod",      crew:"MOD",  rank:2, activity:"CYCLE",  location:"Mandurah – Fremantle Trail",           time:"07:30", date:"SUN",      spots:5, spotsLeft:5, kash:0,   wagered:false, tappedIn:[],              rankGate:0, posted:"YESTERDAY", avatar:"V" },
];

const GLOBAL_BOARD = [
  { rank:1,  handle:"ACE",      crew:"GRIM", stars:3, kash:4820, activities:31, wagers:9,  streakBest:22, avatar:"A" },
  { rank:2,  handle:"VALE",     crew:"MOD",  stars:2, kash:3940, activities:28, wagers:6,  streakBest:18, avatar:"V" },
  { rank:3,  handle:"SID",      crew:"FIRM", stars:2, kash:3610, activities:26, wagers:7,  streakBest:15, avatar:"S" },
  { rank:4,  handle:"GHOST_44", crew:"GRIM", stars:1, kash:2980, activities:22, wagers:4,  streakBest:12, avatar:"G" },
  { rank:5,  handle:"ROLLO",    crew:"MOD",  stars:1, kash:2750, activities:24, wagers:2,  streakBest:14, avatar:"R" },
  { rank:6,  handle:"MIRA_F",   crew:"FIRM", stars:1, kash:2210, activities:19, wagers:3,  streakBest:10, avatar:"M" },
  { rank:7,  handle:"ZERO",     crew:"GRIM", stars:1, kash:1990, activities:17, wagers:5,  streakBest:9,  avatar:"Z" },
  { rank:8,  handle:"LUNA_MOD", crew:"MOD",  stars:1, kash:1780, activities:16, wagers:1,  streakBest:8,  avatar:"L" },
  { rank:9,  handle:"CAIRO",    crew:"FIRM", stars:1, kash:1540, activities:14, wagers:2,  streakBest:7,  avatar:"C" },
  { rank:10, handle:"YOU",      crew:"FIRM", stars:1, kash:840,  activities:9,  wagers:1,  streakBest:4,  avatar:"Y", isMe:true },
];

const CREW_SCORES = [
  { crew:"GRIM", collective:9790, members:312, avgStreak:11, wagerWins:48 },
  { crew:"FIRM", collective:8200, members:298, avgStreak:9,  wagerWins:39 },
  { crew:"MOD",  collective:8470, members:271, avgStreak:10, wagerWins:22 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// ROOK LINES
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// FIRST VISIT + CONTEXTUAL MOMENT SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

// In a real app these would be persisted to localStorage/backend
// In prototype we use module-level state so flags survive tab switches
const VISITED = {
  signal:false, skocial:false, store:false, board:false,
  firstTag:false, firstStar:false, firstWagerWin:false, emptyKash:false,
};

const FIRST_VISIT_CARDS = {
  signal: {
    lines: [
      "This is Signal.",
      "It shows you who is nearby and moving.",
      "Tap a blip. See what happens.",
      "Tag is exactly what it sounds like.",
    ],
    quickGuide: [
      "Radar shows Faces within 1.5km. Coloured blips are active members.",
      "Tap any blip — join their session, send a challenge, request a spot, or tag them.",
      "Live Status lets nearby Faces see you're active. Off by default.",
      "Tag is opt-in only. Toggle the banner to enter the game.",
    ],
  },
  skocial: {
    lines: [
      "This is Skocial.",
      "Post an activity. Set a time and a place.",
      "Other Skolds tap in or they don't.",
      "Add a wager if you want skin in the game. No chat. No comments. Just show up.",
    ],
    quickGuide: [
      "Tap + to post an activity — set type, location, time, and spots available.",
      "Tap IN on any post to join. You're committing to show up.",
      "Wager posts lock Kash until the result is verified. Skill only.",
      "Filter by crew, wager, or open spots using the bar at the top.",
    ],
  },
  store: {
    lines: [
      "Prizes run on Kash.",
      "You earn Kash by training. You can buy it too.",
      "Bought Kash spends the same. It just doesn't count on the board.",
      "Five prizes always live. One of them is a Vespa.",
    ],
    quickGuide: [
      "PRIZES — enter draws using Kash. More entries = better chance.",
      "KASH — buy Kash bundles. Earned Kash only counts on the leaderboard.",
      "SUPPLEMENTS — individual products open to all members.",
      "MERCH — rank gated. Rook delivers the unlock when you're ready.",
    ],
  },
  board: {
    lines: [
      "Three views.",
      "Global is everyone. Crew is your team's collective score.",
      "My Rank is where you sit inside your crew.",
      "Resets monthly. Gold pin does not.",
    ],
    quickGuide: [
      "GLOBAL — all Faces ranked by earned Kash. Purchased Kash not counted.",
      "CREW — collective earned Kash battle between THE FIRM, MOD, and GRIM.",
      "MY RANK — your position inside your crew across five metrics.",
      "Monthly reset. Top performer gets a digital gold star on profile.",
    ],
  },
};

const CONTEXTUAL_MOMENTS = {
  firstTag:     { msg:"You've been tagged. Find a Face with Tag on and tap them. 30 minute cooldown before they can tag you back.", color:"#7A1A1A" },
  firstStar:    { msg:"Full star. 50K dropped. Complete all eight tomorrow and the day after that. That's how the streak builds.", color:GOLD },
  firstWagerWin:{ msg:"First wager win. Nine more before the gold pin. That mechanic never changes.", color:GOLD },
  emptyKash:    { msg:"Empty. You know what to do.", color:"#444" },
};

// ── First Visit Card ──────────────────────────────────────────────────────────
function ChromeStar({ size = 200, pulse = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{
      display:"block",
      filter: pulse ? "drop-shadow(0 0 24px rgba(220,230,240,0.18))" : "drop-shadow(0 0 8px rgba(220,230,240,0.08))",
      transition:"filter 1s ease",
    }}>
      <defs>
        <radialGradient id="starCore" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95"/>
          <stop offset="40%" stopColor="#C8D4E0" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#4A5A6A" stopOpacity="0.7"/>
        </radialGradient>
        <radialGradient id="starLeft" cx="30%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#A0B0C0" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#202830" stopOpacity="0.9"/>
        </radialGradient>
        <radialGradient id="starRight" cx="70%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#D0DDE8" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#303840" stopOpacity="0.8"/>
        </radialGradient>
        <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6"/>
          <stop offset="50%" stopColor="#8090A0" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#1A2028" stopOpacity="0.8"/>
        </linearGradient>
        <filter id="starShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.5"/>
        </filter>
      </defs>

      {/* 8-point star — right half */}
      <path d="M100,10 L112,88 L190,100 L112,112 L100,190 L88,112 L10,100 L88,88 Z"
        fill="url(#starLeft)" filter="url(#starShadow)"/>

      {/* 8-point star — left highlight half */}
      <path d="M100,10 L112,88 L190,100 L112,112 L100,190 L88,112 L10,100 L88,88 Z"
        fill="url(#starRight)" opacity="0.5"/>

      {/* Top-right diagonal points */}
      <path d="M100,10 L108,72 L155,45 L108,88 L190,100 L128,108 L155,155 L112,112 L100,190 L92,128 L45,155 L88,112 L10,100 L72,92 L45,45 L88,72 Z"
        fill="url(#starCore)" opacity="0.85"/>

      {/* Centre gleam */}
      <ellipse cx="97" cy="94" rx="8" ry="10"
        fill="white" opacity="0.25"
        transform="rotate(-15 97 94)"/>

      {/* S-curve shadow split */}
      <path d="M100,14 C103,50 97,80 100,100 C103,120 97,150 100,186"
        stroke="rgba(0,0,0,0.35)" strokeWidth="2.5" fill="none"/>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// REGISTRATION — FOUNDING NUMBER GATE
// ═══════════════════════════════════════════════════════════════════════════════
// Valid demo numbers for prototype
const VALID_NUMBERS = ["0001","0047","0100","0312","0500","0999","1000"];

function FirstVisitCard({ tabKey, onDismiss }) {
  const card = FIRST_VISIT_CARDS[tabKey];
  if (!card) return null;
  const [lineIdx, setLineIdx]   = useState(0);
  const [typed, setTyped]       = useState("");
  const [typeDone, setTypeDone] = useState(false);
  const [starIn, setStarIn]     = useState(false);
  const timerRef = useRef(null);

  useEffect(() => { setTimeout(()=>setStarIn(true), 200); }, []);

  useEffect(() => {
    setTyped(""); setTypeDone(false);
    const text = card.lines[lineIdx];
    let i = 0;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      i++;
      setTyped(text.slice(0,i));
      if (i >= text.length) { clearInterval(timerRef.current); setTypeDone(true); }
    }, lineIdx === 0 ? 55 : 38);
    return () => clearInterval(timerRef.current);
  }, [lineIdx]);

  const advance = () => {
    if (lineIdx < card.lines.length - 1) setLineIdx(l=>l+1);
    else onDismiss();
  };

  const isLast = lineIdx === card.lines.length - 1;

  return (
    <div
      style={{
        position:"fixed", inset:0, background:"rgba(8,8,8,0.97)",
        zIndex:500, display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        padding:"40px 32px", fontFamily:"monospace",
        cursor: typeDone ? "pointer" : "default",
        userSelect:"none",
      }}
      onClick={()=>{ if(typeDone) advance(); }}
    >
      <div style={{
        position:"fixed",top:0,left:0,right:0,height:1,
        background:`linear-gradient(to right,transparent,${GOLD}22,transparent)`,
        animation:"scanBeam 5s linear infinite",pointerEvents:"none",zIndex:9997,
      }}/>

      {/* Mini star */}
      <div style={{
        marginBottom:32,
        opacity:starIn?1:0, transform:starIn?"scale(1)":"scale(0.8)",
        transition:"all 0.6s ease",
        pointerEvents:"none",
      }}>
        <ChromeStar size={56}/>
      </div>

      {/* Progress dots */}
      <div style={{display:"flex",gap:6,marginBottom:28,pointerEvents:"none"}}>
        {card.lines.map((_,i)=>(
          <div key={i} style={{
            width:i===lineIdx?14:4, height:2,
            background:i<=lineIdx?GOLD:"#1A1A1A",
            transition:"all 0.3s ease",
          }}/>
        ))}
      </div>

      {/* Rook label */}
      <div style={{fontSize:"8px",color:GOLD,letterSpacing:"3px",marginBottom:16,opacity:0.7,pointerEvents:"none"}}>
        ROOK //
      </div>

      {/* Typed line */}
      <div style={{
        maxWidth:300, textAlign:"center", minHeight:72,
        display:"flex", alignItems:"center", justifyContent:"center",
        marginBottom:36, pointerEvents:"none",
      }}>
        <p style={{
          margin:0, lineHeight:1.85,
          fontSize: lineIdx===0 ? "16px" : "13px",
          color: lineIdx===0 ? "#E8E8E0" : "#888",
          letterSpacing:"0.3px",
        }}>
          {typed}
          {!typeDone && <span style={{opacity:0.4,animation:"blink 0.9s infinite"}}>|</span>}
        </p>
      </div>

      {/* CTA — shows when done, but whole screen is tappable too */}
      <div style={{
        opacity: typeDone ? 1 : 0,
        transition:"opacity 0.4s ease",
        pointerEvents:"none",
      }}>
        <div style={{
          padding:"11px 36px",
          border:`1px solid ${isLast?GOLD:"#2A2A2A"}`,
          color:isLast?GOLD:"#555",
          fontFamily:"monospace", fontSize:"10px",
          letterSpacing:"4px",
          textAlign:"center",
        }}>
          {isLast ? "GOT IT" : "CONTINUE"}
        </div>
      </div>

      <div style={{
        position:"absolute", bottom:40,
        fontSize:"8px",
        color: typeDone ? "#333" : "#1A1A1A",
        letterSpacing:"2px", fontFamily:"monospace",
        pointerEvents:"none",
        transition:"color 0.5s ease",
      }}>
        TAP ANYWHERE TO CONTINUE
      </div>
    </div>
  );
}

// ── Quick Guide Sheet ─────────────────────────────────────────────────────────
function QuickGuide({ tabKey, onClose }) {
  const card = FIRST_VISIT_CARDS[tabKey];
  if (!card) return null;
  const titles = { signal:"SIGNAL", skocial:"SKOCIAL", store:"STORE", board:"BOARD" };
  return (
    <div style={{
      position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",
      zIndex:400,display:"flex",alignItems:"flex-end",
    }} onClick={onClose}>
      <div style={{
        width:"100%",maxWidth:440,margin:"0 auto",
        background:"#0A0A0A",
        borderTop:`2px solid ${GOLD}`,
        padding:"20px 20px 36px",
        fontFamily:"monospace",
        animation:"sheetUp 0.25s ease",
      }} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
          <div>
            <div style={{fontSize:"9px",color:GOLD,letterSpacing:"3px",marginBottom:3}}>HOW IT WORKS</div>
            <div style={{fontSize:"14px",color:"#E8E8E0",letterSpacing:"3px"}}>{titles[tabKey]}</div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#444",fontSize:"20px",cursor:"pointer"}}>×</button>
        </div>
        {card.quickGuide.map((line,i)=>(
          <div key={i} style={{
            display:"flex",gap:12,padding:"11px 0",
            borderBottom:i<card.quickGuide.length-1?"1px solid #0F0F0F":"none",
          }}>
            <div style={{
              width:18,height:18,borderRadius:"50%",
              background:"#111",border:`1px solid ${GOLD}33`,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:"8px",color:GOLD,flexShrink:0,marginTop:1,
            }}>{i+1}</div>
            <p style={{margin:0,fontSize:"11px",color:"#888",lineHeight:1.65,letterSpacing:"0.3px"}}>{line}</p>
          </div>
        ))}
        <div style={{marginTop:16,padding:"12px 14px",background:"#0F0F0F",border:"1px solid #111",borderLeft:`2px solid ${GOLD}33`}}>
          <div style={{fontSize:"8px",color:"#444",letterSpacing:"1px",lineHeight:1.8}}>
            Still unsure? Check the Codex in your ME tab.<br/>
            Or email the team — <span style={{color:GOLD}}>support@stayskold.com</span>
          </div>
        </div>
        <button onClick={onClose} style={{
          width:"100%",marginTop:14,padding:"11px 0",
          background:"transparent",border:"1px solid #1A1A1A",
          color:"#444",fontFamily:"monospace",fontSize:"10px",
          letterSpacing:"3px",cursor:"pointer",
        }}>CLOSE</button>
      </div>
      <style>{`@keyframes sheetUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
    </div>
  );
}

// ── Contextual Moment Toast ───────────────────────────────────────────────────
function ContextToast({ momentKey, onDone }) {
  const m = CONTEXTUAL_MOMENTS[momentKey];
  useEffect(()=>{ const t=setTimeout(onDone,4000); return()=>clearTimeout(t); },[]);
  if (!m) return null;
  return (
    <div style={{
      position:"fixed",top:72,left:"50%",transform:"translateX(-50%)",
      zIndex:450,width:"calc(100% - 40px)",maxWidth:400,
      background:"#0A0A0A",
      border:`1px solid ${m.color}`,
      borderLeft:`3px solid ${m.color}`,
      padding:"14px 16px",fontFamily:"monospace",
      boxShadow:`0 0 24px ${m.color}22`,
      animation:"toastIn 4s ease forwards",
    }}>
      <div style={{fontSize:"8px",color:m.color,letterSpacing:"3px",marginBottom:4}}>ROOK //</div>
      <div style={{fontSize:"12px",color:"#E8E8E0",letterSpacing:"0.5px",lineHeight:1.6}}>{m.msg}</div>
      <style>{`@keyframes toastIn{0%{opacity:0;transform:translateX(-50%) translateY(-8px)}8%{opacity:1;transform:translateX(-50%) translateY(0)}80%{opacity:1}100%{opacity:0}}`}</style>
    </div>
  );
}

// ── Codex ─────────────────────────────────────────────────────────────────────
const CODEX_SECTIONS = [
  { title:"KASH", body:"Earned through training. Spent on prizes and wagers. You can buy it too — it just doesn't count on the board. No cash value. Cannot be withdrawn. Ever." },
  { title:"THE BOARD", body:"Resets monthly. Earned Kash only. Top performer gets a digital gold star on their profile. Physical gold pin requires ten wager wins. Different thing. Never changes." },
  { title:"SIGNAL", body:"Proximity based. Opt in to Tag. Challenge is first to a target — honour system. Spot Me is private between two Faces. Live Status shows your distance to nearby members." },
  { title:"SKOCIAL", body:"Post an activity. Set spots. Add a wager if you want. Other Faces tap in. No chat. No comments. Wager verified by health data or photo proof. AR medal after completion." },
  { title:"CREW", body:"Three crews. Training identity — not personality. Collective score is earned Kash only. Stars are rank within your crew. You earn them. There is no other way." },
  { title:"STAR TRACKER", body:"Eight points. Complete all eight and Kash drops. Seven day streak earns a bonus. Move, Train, and Recover are fed from health data automatically. Hydrate and Fuel are one tap." },
  { title:"SKOLD TAG", body:"City wide. Opt in only. Tap a nearby Face with Tag on. They're it. Thirty minute cooldown before they can tag you back. Rook activates it unannounced. Runs 48 hours then gone." },
  { title:"FOUNDING NUMBER", body:"Single use. Tied to your account. Cannot be transferred or resold. Ships with the vessel. The number is yours. DROP 001 numbers do not change." },
];

function Codex({ onClose }) {
  const [open, setOpen] = useState(null);
  return (
    <div style={{
      position:"fixed",inset:0,background:BG,
      zIndex:400,display:"flex",flexDirection:"column",
      fontFamily:"monospace",overflowY:"auto",
    }}>
      {/* Header */}
      <div style={{
        padding:"16px 20px",borderBottom:"1px solid #111",
        display:"flex",alignItems:"center",justifyContent:"space-between",
        position:"sticky",top:0,background:BG,zIndex:10,
      }}>
        <div>
          <div style={{fontSize:"18px",letterSpacing:"4px",fontWeight:"bold",color:"#E8E8E0"}}>CODEX</div>
          <div style={{fontSize:"9px",color:"#333",letterSpacing:"2px",marginTop:1}}>EVERYTHING YOU NEED TO KNOW</div>
        </div>
        <button onClick={onClose} style={{background:"none",border:"none",color:"#444",fontSize:"20px",cursor:"pointer",padding:"4px 8px"}}>×</button>
      </div>

      {/* Rook intro */}
      <div style={{padding:"14px 20px",borderBottom:"1px solid #0F0F0F",display:"flex",gap:10,alignItems:"flex-start"}}>
        <span style={{fontSize:"8px",color:GOLD,letterSpacing:"2px",flexShrink:0,marginTop:2}}>ROOK //</span>
        <span style={{fontSize:"11px",color:"#555",lineHeight:1.65,letterSpacing:"0.3px"}}>
          Eight things. Read them once. The app will make sense.
        </span>
      </div>

      {/* Sections */}
      <div style={{flex:1}}>
        {CODEX_SECTIONS.map((s,i)=>(
          <div key={s.title}
            style={{borderBottom:"1px solid #0A0A0A"}}
          >
            <div
              onClick={()=>setOpen(open===i?null:i)}
              style={{
                display:"flex",alignItems:"center",justifyContent:"space-between",
                padding:"14px 20px",cursor:"pointer",
                background:open===i?"#0C0C0C":"transparent",
                borderLeft:`2px solid ${open===i?GOLD:"transparent"}`,
                transition:"all 0.15s ease",
              }}
            >
              <span style={{fontSize:"11px",color:open===i?"#E8E8E0":"#555",letterSpacing:"2px"}}>{s.title}</span>
              <span style={{fontSize:"14px",color:open===i?GOLD:"#2A2A2A",transition:"transform 0.2s ease",display:"block",transform:open===i?"rotate(45deg)":"rotate(0deg)"}}>+</span>
            </div>
            {open===i&&(
              <div style={{
                padding:"0 20px 16px 22px",
                animation:"fadeUp 0.25s ease",
              }}>
                <p style={{
                  margin:0,fontSize:"11px",color:"#666",
                  lineHeight:1.8,letterSpacing:"0.3px",
                }}>
                  {s.body}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        padding:"20px",borderTop:"1px solid #0F0F0F",
        background:"#0A0A0A",
      }}>
        <div style={{
          fontSize:"9px",color:"#333",
          letterSpacing:"1px",lineHeight:1.9,
          fontFamily:"monospace",
        }}>
          Still unsure? Email the team.<br/>
          <span style={{color:GOLD,letterSpacing:"0.5px"}}>support@stayskold.com</span>
        </div>
      </div>
    </div>
  );
}

const ROOK = {
  onboarding: [
    "You found it.",
    "SKOLD is not a supplement brand.",
    "You are a Prospect. That is where everyone starts. It is where most people finish.",
    "There are three crews. You will not choose them. They will choose you.",
    "The bottle is not a bottle. You'll understand that eventually.",
    "Rook the Grim does not forget a face. Do not give me a reason to remember yours for the wrong reason.",
  ],
  home:    ["You came back. That's noted.", "Good.", "Full star. Don't make a thing of it.", "Same again tomorrow."],
  skocial: ["Show up or don't.", "Tapped in. That means something.", "Kash locked. Skill decides.", "Rook the Grim noticed you were not here yesterday."],
  shop:    ["Five prizes. Always five.", "Kash has no cash value. That is the point.", "The Vespa has been on the board since day one.", "Bought Kash spends the same. It just doesn't count for anything that matters."],
  board:   ["Global board resets first of every month. Gold star on profile does not.", "ACE has been number one for six weeks. Rook the Grim has noticed.", "Your crew rank is four. That number is yours to change."],
  profile: ["Founding number 0047. That number does not change.", "One wager win. Nine to go before the gold pin.", "Bio says show up. Board says nine times this month."],
};

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════
function CRTOverlay() {
  return (
    <div style={{
      position:"fixed", inset:0, pointerEvents:"none", zIndex:9998,
      background:`repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.022) 2px,rgba(0,0,0,0.022) 4px)`,
    }}/>
  );
}

function RookBar({ line }) {
  const [visible, setVisible] = useState(false);
  const [displayed, setDisplayed] = useState(line);
  useEffect(() => {
    setVisible(false);
    const t1 = setTimeout(() => { setDisplayed(line); setVisible(true); }, 200);
    return () => clearTimeout(t1);
  }, [line]);
  return (
    <div style={{
      padding:"10px 16px", borderBottom:"1px solid #0F0F0F",
      display:"flex", alignItems:"center", gap:10, minHeight:42,
      opacity: visible ? 1 : 0, transition:"opacity 0.5s ease",
    }}>
      <span style={{ fontSize:"8px", color:GOLD, letterSpacing:"2px", flexShrink:0, fontFamily:"monospace" }}>ROOK //</span>
      <span style={{ fontSize:"11px", color:"#555", lineHeight:1.5, letterSpacing:"0.5px", fontFamily:"monospace" }}>{displayed}</span>
    </div>
  );
}

function CrewBadge({ crew }) {
  const c = CREWS[crew];
  return (
    <span style={{
      fontSize:"9px", color:c.text, border:`1px solid ${c.color}`,
      padding:"2px 6px", fontFamily:"monospace", letterSpacing:"2px",
    }}>{c.label}</span>
  );
}

function Avatar({ letter, crew, size=34, photo }) {
  const c = CREWS[crew] || CREWS.GRIM;
  return (
    <div style={{
      width:size, height:size, borderRadius:"50%", flexShrink:0,
      background:c.color, border:`1px solid ${c.accent}`,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:size*0.38, fontFamily:"monospace", fontWeight:"bold",
      color:"#E8E8E0", overflow:"hidden",
    }}>
      {photo ? <img src={photo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/> : letter}
    </div>
  );
}

function KashBadge({ balance }) {
  return (
    <div style={{
      background:"#0A0A0A", border:`1px solid ${GOLD}33`,
      padding:"5px 10px", fontSize:"10px", color:GOLD, letterSpacing:"1px", fontFamily:"monospace",
    }}>◆ {balance.toLocaleString()}K</div>
  );
}

function TabHeader({ title, sub, kashBalance }) {
  return (
    <div style={{
      padding:"16px 20px", borderBottom:"1px solid #0F0F0F",
      display:"flex", alignItems:"center", justifyContent:"space-between",
      background:BG, position:"sticky", top:0, zIndex:10,
    }}>
      <div>
        <div style={{ fontSize:"18px", letterSpacing:"4px", fontWeight:"bold", color:"#E8E8E0", fontFamily:"monospace" }}>{title}</div>
        {sub && <div style={{ fontSize:"9px", color:"#333", letterSpacing:"2px", marginTop:1, fontFamily:"monospace" }}>{sub}</div>}
      </div>
      <KashBadge balance={kashBalance}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENTRY LAYER — POST-REGISTRATION WELCOME + INITIATION
// ═══════════════════════════════════════════════════════════════════════════════

const CREW_CHOICES = [
  {
    key: "FIRM",
    label: "HARD AND OFTEN",
    sub: "Hyrox. Gym. Track. You show up and you talk about it.",
    reveal: "THE FIRM. You show up. You make noise. Own it.",
  },
  {
    key: "MOD",
    label: "SLOW AND DELIBERATE",
    sub: "Yoga. Pilates. Mobility. Precision over noise.",
    reveal: "THE MOD. Controlled. Precise. Harder than it looks.",
  },
  {
    key: "GRIM",
    label: "UNTIL SOMETHING BREAKS",
    sub: "Lifting. Sparring. Combat. You don't stop.",
    reveal: "THE GRIM. We already knew.",
  },
];

// Phases: "name" → "welcome" → "rule" → "question" → "reveal" → "close"
function EntryLayer({ onComplete, handle = "SID" }) {
  const [phase, setPhase]           = useState("name");
  const [nameVisible, setNameVisible] = useState(false);
  const [typed, setTyped]           = useState("");
  const [typeDone, setTypeDone]     = useState(false);
  const [crewChoice, setCrewChoice] = useState(null);
  const [choicesVisible, setChoicesVisible] = useState([false,false,false]);
  const [starSmall, setStarSmall]   = useState(false);
  const timerRef = useRef(null);

  const firstName_UC = handle.toUpperCase();
  const handle_UC    = handle.toUpperCase();

  // Name entrance — auto-advance to welcome
  useEffect(() => {
    const t1 = setTimeout(() => setNameVisible(true), 400);
    const t2 = setTimeout(() => {
      setStarSmall(true);
      setPhase("welcome");
    }, 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const PHASE_TEXT = {
    welcome:  `Welcome to SKOLD, ${handle_UC}.`,
    rule:     "Once you're a Skold. You stay Skold.",
    question: "One question. How do you train. The room doesn't judge.",
    reveal:   crewChoice ? CREW_CHOICES.find(c=>c.key===crewChoice)?.reveal : "",
    close:    `${handle_UC}. You're a Skold now. That doesn't change.`,
  };

  const TEXT_SPEEDS = {
    welcome: 48, rule: 72, question: 38, reveal: 46, close: 52,
  };

  const isTextPhase = ["welcome","rule","question","reveal","close"].includes(phase);

  // Typewriter
  useEffect(() => {
    if (!isTextPhase) return;
    setTyped(""); setTypeDone(false);
    const text = PHASE_TEXT[phase] || "";
    let i = 0;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      i++;
      setTyped(text.slice(0,i));
      if (i >= text.length) { clearInterval(timerRef.current); setTypeDone(true); }
    }, TEXT_SPEEDS[phase] || 42);
    return () => clearInterval(timerRef.current);
  }, [phase, crewChoice]);

  // Stagger crew choices after question types
  useEffect(() => {
    if (phase === "question" && typeDone) {
      setChoicesVisible([false,false,false]);
      [0,1,2].forEach(i =>
        setTimeout(() => setChoicesVisible(v => v.map((x,j) => j===i ? true : x)), 220+i*200)
      );
    }
  }, [phase, typeDone]);

  const advance = () => {
    const order = ["welcome","rule","question","reveal","close"];
    if (phase === "close")    { onComplete(crewChoice || "FIRM"); return; }
    if (phase === "question") return;
    const idx = order.indexOf(phase);
    if (idx < order.length-1) setPhase(order[idx+1]);
  };

  const pickCrew = (key) => {
    setCrewChoice(key);
    setTimeout(() => setPhase("reveal"), 350);
  };

  const c = crewChoice ? CREWS[crewChoice] : null;
  const showCTA = typeDone && phase !== "question";

  // Font sizes and colours per phase
  const textSize = () => {
    if (phase === "name")    return "32px";
    if (phase === "welcome") return "16px";
    if (phase === "rule")    return "18px";
    return "13px";
  };
  const textColor = () => {
    if (phase === "name")    return "#E8E8E0";
    if (phase === "welcome") return "#E8E8E0";
    if (phase === "rule")    return "#E8E8E0";
    if (phase === "reveal" && c) return c.text;
    if (phase === "close")   return GOLD;
    return "#888";
  };

  return (
    <div style={{
      background:BG, minHeight:"100vh",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      padding:"40px 32px", fontFamily:"monospace",
      position:"relative", overflow:"hidden",
    }}>
      <CRTOverlay/>
      <div style={{
        position:"fixed", top:0, left:0, right:0, height:1,
        background:`linear-gradient(to right,transparent,${GOLD}22,transparent)`,
        animation:"scanBeam 5s linear infinite",
        pointerEvents:"none", zIndex:9997,
      }}/>

      {/* Chrome star — full on name phase, small after */}
      <div style={{
        marginBottom: starSmall ? 28 : 0,
        opacity: 1,
        transform: starSmall ? "scale(1)" : "scale(1)",
        transition:"all 0.9s ease",
      }}>
        <ChromeStar
          size={starSmall ? 72 : 160}
          pulse={phase === "name"}
        />
      </div>

      {/* NAME — big, centred, fades in then transitions */}
      {phase === "name" && (
        <div style={{
          textAlign:"center",
          opacity: nameVisible ? 1 : 0,
          transform: nameVisible ? "translateY(0)" : "translateY(12px)",
          transition:"all 0.7s ease",
          marginTop:32,
        }}>
          <div style={{
            fontSize:"34px", fontWeight:"bold",
            color:"#E8E8E0", letterSpacing:"6px",
            lineHeight:1,
          }}>
            {firstName_UC}.
          </div>
          <div style={{
            fontSize:"10px", color:"#2A2A2A",
            letterSpacing:"4px", marginTop:14,
          }}>
            SKOLD
          </div>
        </div>
      )}

      {/* SKOLD wordmark once past name phase */}
      {phase !== "name" && (
        <div style={{
          fontSize:"10px", letterSpacing:"6px", color:"#2A2A2A",
          marginBottom:28, animation:"fadeUp 0.5s ease",
        }}>
          SKOLD
        </div>
      )}

      {/* Typewriter text */}
      {isTextPhase && (
        <div style={{
          maxWidth:300, textAlign:"center",
          minHeight:80, display:"flex",
          alignItems:"center", justifyContent:"center",
          marginBottom:28,
        }}>
          <p style={{
            margin:0, lineHeight:1.85,
            fontSize: textSize(),
            color: textColor(),
            letterSpacing: phase==="rule" ? "0.5px" : "0.2px",
            fontWeight: phase==="rule" || phase==="close" ? "bold" : "normal",
            textShadow: phase==="rule" ? "0 0 24px rgba(232,232,224,0.12)" : "none",
            transition:"color 0.4s ease",
          }}>
            {typed}
            {!typeDone && <span style={{opacity:0.4, animation:"blink 0.9s infinite"}}>|</span>}
          </p>
        </div>
      )}

      {/* Crew choices */}
      {phase === "question" && (
        <div style={{
          display:"flex", flexDirection:"column", gap:8,
          width:"100%", maxWidth:300, marginBottom:24,
        }}>
          {CREW_CHOICES.map((choice,i) => (
            <button key={choice.key} onClick={() => pickCrew(choice.key)} style={{
              padding:"14px 16px",
              background: crewChoice===choice.key ? `${CREWS[choice.key].color}18` : "transparent",
              border:`1px solid ${crewChoice===choice.key ? CREWS[choice.key].color : "#1E1E1E"}`,
              borderLeft:`3px solid ${crewChoice===choice.key ? CREWS[choice.key].color : "#1E1E1E"}`,
              fontFamily:"monospace", cursor:"pointer", textAlign:"left",
              opacity: choicesVisible[i] ? 1 : 0,
              transform: choicesVisible[i] ? "translateX(0)" : "translateX(-10px)",
              transition:"all 0.35s ease",
            }}>
              <div style={{
                fontSize:"10px", letterSpacing:"2px", marginBottom:5,
                color: crewChoice===choice.key ? CREWS[choice.key].text : "#E8E8E0",
              }}>
                {choice.label}
              </div>
              <div style={{fontSize:"9px", color:"#3A3A3A", letterSpacing:"0.3px", lineHeight:1.5}}>
                {choice.sub}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Crew badge after reveal */}
      {phase === "reveal" && typeDone && c && (
        <div style={{
          fontSize:"9px", color:c.text,
          border:`1px solid ${c.color}55`,
          padding:"5px 16px", letterSpacing:"4px",
          marginBottom:24, animation:"fadeUp 0.5s ease",
        }}>
          {c.label}
        </div>
      )}

      {/* CTA */}
      {showCTA && (
        <button onClick={advance} style={{
          padding:"12px 40px", background:"transparent",
          border:`1px solid ${phase==="close" ? GOLD : "#2A2A2A"}`,
          color: phase==="close" ? GOLD : "#555",
          fontFamily:"monospace", fontSize:"10px",
          letterSpacing:"4px", cursor:"pointer",
          animation:"fadeUp 0.4s ease",
          transition:"all 0.2s ease",
        }}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=GOLD;e.currentTarget.style.color=GOLD;}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor=phase==="close"?GOLD:"#2A2A2A";e.currentTarget.style.color=phase==="close"?GOLD:"#555";}}>
          {phase === "close" ? "ENTER" : "CONTINUE"}
        </button>
      )}

      <style>{`
        @keyframes scanBeam{0%{top:-1px}100%{top:100vh}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 1 — HOME (STAR TRACKER)
// ═══════════════════════════════════════════════════════════════════════════════
function StarSVG({ points, crewColor }) {
  const size=220, cx=110, cy=110, outerR=88, innerR=36, N=8;
  const allDone = points.every(p => p.current >= p.target);
  const doneCt = points.filter(p => p.current >= p.target).length;

  const seg = (i) => {
    const sa=(i*2*Math.PI/N)-Math.PI/2-(Math.PI/N);
    const ea=sa+(2*Math.PI/N);
    const tip_a=(i*2*Math.PI/N)-Math.PI/2;
    const steps=10;
    const arc=Array.from({length:steps+1},(_,k)=>{
      const a=sa+(ea-sa)*(k/steps);
      return `${cx+outerR*Math.cos(a)},${cy+outerR*Math.sin(a)}`;
    });
    const tip=`${cx+outerR*1.2*Math.cos(tip_a)},${cy+outerR*1.2*Math.sin(tip_a)}`;
    const is0=`${cx+innerR*Math.cos(sa+0.15)},${cy+innerR*Math.sin(sa+0.15)}`;
    const ie0=`${cx+innerR*Math.cos(ea-0.15)},${cy+innerR*Math.sin(ea-0.15)}`;
    const mid=Math.floor(steps/2);
    const firstHalf=arc.slice(0,mid+1).map(p=>`L${p}`).join(" ");
    const secondHalf=arc.slice(mid+1).map(p=>`L${p}`).join(" ");
    return `M${is0} ${firstHalf} L${tip} ${secondHalf} L${ie0} A${innerR} ${innerR} 0 0 0 ${is0} Z`;
  };

  const iconPos=(i)=>{
    const a=(i*2*Math.PI/N)-Math.PI/2;
    const r=outerR*1.42;
    return [cx+r*Math.cos(a), cy+r*Math.sin(a)];
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{overflow:"visible"}}>
      <defs>
        <filter id="gs"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="gc"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <radialGradient id="cg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={allDone?GOLD:"#1A1A1A"} stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#080808" stopOpacity="1"/>
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={outerR*1.58} fill="none" stroke="#0F0F0F" strokeWidth="1"/>
      <circle cx={cx} cy={cy} r={outerR*1.59} fill="none" stroke="#141414" strokeWidth="0.5" strokeDasharray="2 5"/>
      {points.map((p,i)=>{
        const done=p.current>=p.target;
        const prog=Math.min(p.current/p.target,1);
        return (
          <g key={p.id}>
            {!done && prog>0 && <path d={seg(i)} fill={crewColor} opacity={prog*0.25}/>}
            <path d={seg(i)}
              fill={done?(allDone?GOLD:crewColor):"transparent"}
              stroke={done?(allDone?GOLD:crewColor):"#161616"} strokeWidth="0.5"
              opacity={done?0.9:1}
              style={{filter:done&&allDone?"url(#gs)":done?"url(#gc)":"none",transition:"fill 0.5s ease"}}
            />
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={innerR-2} fill="url(#cg)"
        stroke={allDone?GOLD:"#1E1E1E"} strokeWidth="1"
        style={{filter:allDone?"url(#gs)":"none"}}/>
      <text x={cx} y={cy-(allDone?1:3)} textAnchor="middle" dominantBaseline="middle"
        fill={allDone?GOLD:"#E8E8E0"} fontSize={allDone?14:20}
        fontFamily="monospace" fontWeight="bold" letterSpacing="1"
        style={{filter:allDone?"url(#gs)":"none"}}>
        {allDone?"S":doneCt}
      </text>
      {!allDone && <text x={cx} y={cy+13} textAnchor="middle" dominantBaseline="middle" fill="#2A2A2A" fontSize="8" fontFamily="monospace" letterSpacing="2">OF 8</text>}
      {points.map((p,i)=>{
        const [ix,iy]=iconPos(i);
        const done=p.current>=p.target;
        return (
          <text key={p.id} x={ix} y={iy} textAnchor="middle" dominantBaseline="middle"
            fill={done?(allDone?GOLD:"#E8E8E0"):"#232323"} fontSize="9" fontFamily="monospace"
            style={{transition:"fill 0.4s ease"}}>
            {p.icon}
          </text>
        );
      })}
    </svg>
  );
}

function HomeTab({ member, starPoints, setStarPoints, kash, setKash, onFirstStar, onEmptyKash }) {
  const c = CREWS[member.crew];
  const doneCt = starPoints.filter(p=>p.current>=p.target).length;
  const allDone = doneCt===8;
  const [kashDrop, setKashDrop] = useState(null);
  const [prevDone, setPrevDone] = useState(doneCt);
  const [rookLine, setRookLine] = useState(ROOK.home[1]);

  useEffect(()=>{
    if (doneCt>prevDone) {
      setPrevDone(doneCt);
      if (doneCt===8) {
        setKashDrop(50);
        setKash(k=>k+50);
        setRookLine(ROOK.home[0]);
        if(onFirstStar) onFirstStar();
      }
    }
  },[doneCt]);

  const log = (id) => {
    setStarPoints(prev=>prev.map(p=>p.id===id?{...p,current:p.target}:p));
    setRookLine("Logged.");
  };

  const streak=member.streak;
  const days=["M","T","W","T","F","S","S"];
  const today=new Date().getDay();

  return (
    <div style={{paddingBottom:80}}>
      <TabHeader title="SKOLD" sub="DAILY STAR" kashBalance={kash}/>
      <RookBar line={rookLine}/>

      {/* Member strip */}
      <div style={{padding:"10px 20px",display:"flex",alignItems:"center",gap:10,borderBottom:"1px solid #0F0F0F",background:"#0A0A0A"}}>
        <Avatar letter={member.handle[0]} crew={member.crew} size={28} photo={member.photo}/>
        <span style={{fontSize:"10px",color:"#E8E8E0",letterSpacing:"1px",fontFamily:"monospace",flex:1}}>{member.handle}</span>
        <span style={{fontSize:"9px",color:c.text,fontFamily:"monospace",letterSpacing:"1px"}}>{"★".repeat(member.rank)}</span>
        <CrewBadge crew={member.crew}/>
      </div>

      {/* Star */}
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"28px 20px 8px"}}>
        <div style={{fontSize:"9px",color:"#2A2A2A",letterSpacing:"3px",marginBottom:18,fontFamily:"monospace"}}>
          {new Date().toLocaleDateString("en-AU",{weekday:"long",day:"numeric",month:"long"}).toUpperCase()}
        </div>
        <StarSVG points={starPoints} crewColor={c.color}/>
        <div style={{marginTop:16,fontSize:"10px",letterSpacing:"2px",fontFamily:"monospace",color:allDone?GOLD:"#2A2A2A"}}>
          {allDone?"STAR COMPLETE — 50K EARNED":`${8-doneCt} POINT${8-doneCt!==1?"S":""} REMAINING`}
        </div>
      </div>

      {/* Streak */}
      <div style={{padding:"12px 16px",borderBottom:"1px solid #0F0F0F"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
          <span style={{fontSize:"9px",color:"#333",letterSpacing:"2px",fontFamily:"monospace"}}>STREAK</span>
          <span style={{fontSize:"10px",color:streak>=7?GOLD:c.text,letterSpacing:"2px",fontFamily:"monospace"}}>{streak} DAYS{streak>=7&&<span style={{color:GOLD,marginLeft:6,fontSize:"9px"}}>+200K</span>}</span>
        </div>
        <div style={{display:"flex",gap:4}}>
          {days.map((d,i)=>{
            const td=(today+6)%7;
            const inStreak=i>=td-streak+1&&i<=td;
            const isToday=i===td;
            return (
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                <div style={{width:"100%",height:16,background:inStreak?c.color:"#0F0F0F",border:isToday?`1px solid ${c.color}`:"1px solid transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {inStreak&&<span style={{fontSize:"6px",color:"#E8E8E0"}}>▲</span>}
                </div>
                <span style={{fontSize:"7px",fontFamily:"monospace",color:isToday?"#E8E8E0":"#2A2A2A"}}>{d}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Points list */}
      {starPoints.map(p=>{
        const done=p.current>=p.target;
        const prog=Math.min(p.current/p.target,1);
        const manual=p.id==="hydrate"||p.id==="fuel";
        const auto=p.id==="move"||p.id==="train"||p.id==="recover";
        return (
          <div key={p.id} style={{
            display:"flex",alignItems:"center",gap:12,
            padding:"11px 16px",borderBottom:"1px solid #0A0A0A",
            background:done?"#0C0C0C":"transparent",
            borderLeft:`2px solid ${done?c.color:"transparent"}`,
            transition:"all 0.3s ease",
          }}>
            <div style={{width:28,flexShrink:0,textAlign:"center",fontSize:"14px",fontFamily:"monospace",color:done?c.color:"#2A2A2A",transition:"color 0.3s"}}>
              {p.icon}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontFamily:"monospace",fontSize:"10px",letterSpacing:"2px",color:done?"#E8E8E0":"#444",transition:"color 0.3s"}}>{p.label}</span>
                <span style={{fontFamily:"monospace",fontSize:"9px",color:done?c.text:"#333",letterSpacing:"1px"}}>{done?"DONE":auto?"AUTO":"TAP"}</span>
              </div>
              <div style={{height:2,background:"#111",position:"relative"}}>
                <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${prog*100}%`,background:done?c.color:"#2A2A2A",transition:"width 0.6s ease"}}/>
              </div>
              <div style={{fontSize:"8px",color:"#2A2A2A",fontFamily:"monospace",marginTop:3,letterSpacing:"0.5px"}}>
                {p.unit==="LOG"||p.unit==="ACT"||p.unit==="INT"?done?"LOGGED":"NOT LOGGED":`${p.current} / ${p.target} ${p.unit}`}
              </div>
            </div>
            {manual&&!done&&<button onClick={()=>log(p.id)} style={{width:28,height:28,flexShrink:0,background:"transparent",border:"1px solid #222",color:"#444",fontFamily:"monospace",fontSize:"14px",cursor:"pointer"}}>+</button>}
            {done&&<div style={{width:28,height:28,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",color:c.text,fontSize:"12px"}}>✓</div>}
          </div>
        );
      })}

      <div style={{padding:"12px 16px",display:"flex",alignItems:"center",gap:8,borderTop:"1px solid #0A0A0A"}}>
        <div style={{width:5,height:5,borderRadius:"50%",background:"#1A3A1A",flexShrink:0}}/>
        <span style={{fontSize:"8px",color:"#2A2A2A",fontFamily:"monospace",letterSpacing:"1px",lineHeight:1.6}}>
          MOVE / TRAIN / RECOVER auto-fed from {member.healthPlatform}. HYDRATE and FUEL require one tap only.
        </span>
      </div>

      {kashDrop&&(
        <div style={{position:"fixed",inset:0,zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.85)",pointerEvents:"none"}}>
          <div style={{textAlign:"center",animation:"kashIn 2.8s ease forwards"}}>
            <div style={{fontSize:"48px",color:GOLD,fontFamily:"monospace",fontWeight:"bold",letterSpacing:"4px",textShadow:`0 0 40px ${GOLD}`}}>+50K</div>
            <div style={{fontSize:"10px",color:`${GOLD}99`,fontFamily:"monospace",letterSpacing:"4px",marginTop:8}}>KASH DROPPED</div>
          </div>
          <style>{`@keyframes kashIn{0%{opacity:0;transform:scale(0.7) translateY(20px)}20%{opacity:1;transform:scale(1.05) translateY(0)}70%{opacity:1}100%{opacity:0;transform:scale(0.95) translateY(-10px)}}`}</style>
        </div>
      )}
      {kashDrop&&setTimeout(()=>setKashDrop(null),2800)&&null}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 2 — SKOCIAL
// ═══════════════════════════════════════════════════════════════════════════════
function WagerModal({ post, onClose, onConfirm }) {
  const [amt, setAmt] = useState(post.kash||100);
  const c=CREWS[post.crew];
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={onClose}>
      <div style={{background:"#0D0D0D",border:`1px solid ${c.color}`,padding:24,width:"100%",maxWidth:340,fontFamily:"monospace",boxShadow:`0 0 40px ${c.color}33`}} onClick={e=>e.stopPropagation()}>
        <div style={{fontSize:"9px",color:"#444",letterSpacing:"3px",marginBottom:4}}>SKOCIAL WAGER</div>
        <div style={{color:"#E8E8E0",fontSize:"14px",marginBottom:16,letterSpacing:"1px"}}>{post.activity} — {post.member}</div>
        <div style={{fontSize:"11px",color:"#666",marginBottom:8,letterSpacing:"1px"}}>KASH AT STAKE</div>
        <div style={{display:"flex",gap:8,marginBottom:16}}>
          {[50,100,200,500].map(v=>(
            <button key={v} onClick={()=>setAmt(v)} style={{flex:1,padding:"8px 4px",background:amt===v?c.color:"transparent",border:`1px solid ${amt===v?c.color:"#333"}`,color:amt===v?"#E8E8E0":"#666",fontFamily:"monospace",fontSize:"11px",cursor:"pointer"}}>{v}K</button>
          ))}
        </div>
        <div style={{fontSize:"9px",color:"#333",lineHeight:1.7,marginBottom:20,letterSpacing:"0.5px"}}>
          KASH LOCKED UNTIL RESULT VERIFIED.<br/>SKOCIAL IS A GAME OF SKILL. NOT LUCK.
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={onClose} style={{flex:1,padding:10,background:"transparent",border:"1px solid #333",color:"#555",fontFamily:"monospace",fontSize:"11px",cursor:"pointer",letterSpacing:"2px"}}>CANCEL</button>
          <button onClick={()=>onConfirm(amt)} style={{flex:2,padding:10,background:c.color,border:"none",color:"#E8E8E0",fontFamily:"monospace",fontSize:"11px",cursor:"pointer",letterSpacing:"2px",fontWeight:"bold"}}>LOCK {amt}K</button>
        </div>
      </div>
    </div>
  );
}

function PostCard({ post, myRank, onTapIn, onWager }) {
  const c=CREWS[post.crew];
  const locked=post.rankGate>myRank;
  const tapped=post.tappedIn.includes("ME");
  const full=post.spotsLeft===0;
  return (
    <div style={{background:"#0A0A0A",border:`1px solid ${locked?"#1A1A1A":"#181818"}`,borderLeft:`3px solid ${locked?"#1A1A1A":c.color}`,marginBottom:1,padding:"14px 16px",opacity:locked?0.4:1,position:"relative",overflow:"hidden"}}>
      {!locked&&<div style={{position:"absolute",top:0,right:0,width:60,height:"100%",background:`linear-gradient(to left,${c.color}08,transparent)`,pointerEvents:"none"}}/>}
      <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:10}}>
        <Avatar letter={post.avatar} crew={post.crew} size={34}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
            <span style={{fontFamily:"monospace",fontWeight:"bold",fontSize:"13px",color:"#E8E8E0",letterSpacing:"1px"}}>{post.member}</span>
            <CrewBadge crew={post.crew}/>
            <span style={{fontSize:"10px",color:c.text,fontFamily:"monospace"}}>{post.rank===0?"PROSPECT":"★".repeat(post.rank)}</span>
          </div>
          <div style={{fontSize:"9px",color:"#444",letterSpacing:"1px",marginTop:2}}>{post.posted}</div>
        </div>
        <div style={{background:"#111",border:`1px solid ${c.color}44`,padding:"4px 10px",fontFamily:"monospace",fontSize:"10px",color:c.text,letterSpacing:"2px",flexShrink:0}}>{post.activity}</div>
      </div>
      <div style={{paddingLeft:44}}>
        <div style={{fontFamily:"monospace",fontSize:"11px",color:"#888",letterSpacing:"0.5px",marginBottom:6}}>
          <span style={{color:"#555",marginRight:4}}>◎</span>{post.location}
        </div>
        <div style={{display:"flex",gap:16,fontSize:"10px",color:"#555",letterSpacing:"1px",marginBottom:12,fontFamily:"monospace"}}>
          <span><span style={{color:"#333"}}>TIME</span> {post.time} {post.date}</span>
          <span style={{color:post.spotsLeft<=1?"#7A1A1A":"#555"}}><span style={{color:"#333"}}>SPOTS</span> {post.spotsLeft}/{post.spots}</span>
          {post.rankGate>0&&<span style={{color:GOLD}}>{"★".repeat(post.rankGate)}+ ONLY</span>}
        </div>
        {post.wagered&&(
          <div style={{background:"#0F0F0F",border:"1px solid #1E1E1E",borderLeft:"2px solid "+GOLD,padding:"6px 10px",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{fontFamily:"monospace",fontSize:"10px"}}>
              <span style={{color:GOLD,letterSpacing:"1px"}}>◆ WAGER</span>
              <span style={{color:"#555",marginLeft:8}}>{post.kash}K LOCKED</span>
            </div>
            <div style={{fontSize:"9px",color:"#444",letterSpacing:"1px"}}>SKILL ONLY</div>
          </div>
        )}
        {post.tappedIn.length>0&&(
          <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:10}}>
            <span style={{fontSize:"9px",color:"#333",letterSpacing:"1px",fontFamily:"monospace",marginRight:4}}>IN:</span>
            {post.tappedIn.map(n=>(
              <div key={n} style={{width:20,height:20,borderRadius:"50%",background:"#1A1A1A",border:"1px solid #333",fontSize:"8px",fontFamily:"monospace",color:"#666",display:"flex",alignItems:"center",justifyContent:"center"}}>{n[0]}</div>
            ))}
          </div>
        )}
        {!locked&&(
          <div style={{display:"flex",gap:6}}>
            <button onClick={()=>!full&&!tapped&&onTapIn(post.id)} style={{flex:1,padding:"8px 0",background:tapped?c.color:"transparent",border:`1px solid ${tapped?c.color:"#2A2A2A"}`,color:tapped?"#E8E8E0":"#555",fontFamily:"monospace",fontSize:"10px",letterSpacing:"2px",cursor:full||tapped?"default":"pointer",transition:"all 0.15s ease"}}>
              {tapped?"TAPPED IN":full?"FULL":"TAP IN"}
            </button>
            {post.wagered&&<button onClick={()=>onWager(post)} style={{padding:"8px 14px",background:"transparent",border:`1px solid ${GOLD}44`,color:GOLD,fontFamily:"monospace",fontSize:"10px",letterSpacing:"2px",cursor:"pointer"}}>◆ WAGER</button>}
          </div>
        )}
        {locked&&<div style={{fontFamily:"monospace",fontSize:"9px",color:"#333",letterSpacing:"2px"}}>{"★".repeat(post.rankGate)} RANK REQUIRED</div>}
      </div>
    </div>
  );
}

function Composer({ onPost, onClose }) {
  const [activity,setActivity]=useState("LIFT");
  const [location,setLocation]=useState("");
  const [time,setTime]=useState("");
  const [spots,setSpots]=useState(4);
  const [rankGate,setRankGate]=useState(0);
  const [wager,setWager]=useState(false);
  const [kash,setKashVal]=useState(100);
  const inp={width:"100%",padding:"10px 12px",background:"#0A0A0A",border:"1px solid #222",color:"#E8E8E0",fontFamily:"monospace",fontSize:"12px",letterSpacing:"1px",outline:"none",boxSizing:"border-box"};
  const lbl={fontSize:"9px",color:"#444",letterSpacing:"3px",fontFamily:"monospace",marginBottom:6,display:"block"};
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.97)",zIndex:150,display:"flex",flexDirection:"column",fontFamily:"monospace"}}>
      <div style={{padding:"16px 20px",borderBottom:"1px solid #1A1A1A",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{fontSize:"11px",letterSpacing:"3px",color:"#E8E8E0"}}>POST ACTIVITY</div>
        <button onClick={onClose} style={{background:"none",border:"none",color:"#444",fontSize:"20px",cursor:"pointer"}}>×</button>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:20}}>
        <div style={{marginBottom:18}}>
          <label style={lbl}>ACTIVITY TYPE</label>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {ACTIVITY_TYPES.map(a=>(
              <button key={a} onClick={()=>setActivity(a)} style={{padding:"6px 12px",background:activity===a?"#E8E8E0":"transparent",border:`1px solid ${activity===a?"#E8E8E0":"#222"}`,color:activity===a?"#0A0A0A":"#555",fontFamily:"monospace",fontSize:"10px",letterSpacing:"2px",cursor:"pointer"}}>{a}</button>
            ))}
          </div>
        </div>
        <div style={{marginBottom:14}}><label style={lbl}>LOCATION</label><input style={inp} placeholder="GYM / PARK / UNDISCLOSED" value={location} onChange={e=>setLocation(e.target.value)}/></div>
        <div style={{marginBottom:14}}><label style={lbl}>TIME</label><input style={inp} type="time" value={time} onChange={e=>setTime(e.target.value)}/></div>
        <div style={{marginBottom:18}}><label style={lbl}>SPOTS — {spots}</label><input type="range" min={1} max={20} value={spots} onChange={e=>setSpots(Number(e.target.value))} style={{width:"100%",accentColor:"#E8E8E0"}}/></div>
        <div style={{marginBottom:18}}>
          <label style={lbl}>RANK GATE</label>
          <div style={{display:"flex",gap:6}}>
            {[0,1,2,3].map(r=>(
              <button key={r} onClick={()=>setRankGate(r)} style={{flex:1,padding:"8px 4px",background:rankGate===r?"#1A1A1A":"transparent",border:`1px solid ${rankGate===r?"#444":"#1A1A1A"}`,color:rankGate===r?"#E8E8E0":"#444",fontFamily:"monospace",fontSize:"10px",cursor:"pointer",letterSpacing:"1px"}}>
                {r===0?"ALL":"★".repeat(r)}
              </button>
            ))}
          </div>
        </div>
        <div style={{marginBottom:wager?12:18,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",border:`1px solid ${wager?GOLD+"44":"#1A1A1A"}`,cursor:"pointer"}} onClick={()=>setWager(!wager)}>
          <div>
            <div style={{fontFamily:"monospace",fontSize:"11px",color:wager?GOLD:"#555",letterSpacing:"1px"}}>◆ SKOCIAL WAGER</div>
            <div style={{fontSize:"9px",color:"#333",fontFamily:"monospace",letterSpacing:"1px",marginTop:2}}>SKILL ONLY — NO LUCK</div>
          </div>
          <div style={{width:28,height:16,background:wager?GOLD:"#1A1A1A",borderRadius:8,position:"relative",transition:"background 0.2s"}}>
            <div style={{position:"absolute",top:2,width:12,height:12,borderRadius:"50%",background:"#0A0A0A",left:wager?14:2,transition:"left 0.2s"}}/>
          </div>
        </div>
        {wager&&(
          <div style={{marginBottom:18}}>
            <label style={lbl}>KASH STAKE</label>
            <div style={{display:"flex",gap:6}}>
              {[50,100,200,500,1000].map(v=>(
                <button key={v} onClick={()=>setKashVal(v)} style={{flex:1,padding:"7px 2px",background:kash===v?GOLD:"transparent",border:`1px solid ${kash===v?GOLD:"#222"}`,color:kash===v?"#0A0A0A":"#555",fontFamily:"monospace",fontSize:"9px",cursor:"pointer",letterSpacing:"1px"}}>{v}K</button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div style={{padding:20,borderTop:"1px solid #1A1A1A"}}>
        <button onClick={()=>{if(location&&time){onPost({activity,location,time,spots,rankGate,wager,kash});onClose();}}} style={{width:"100%",padding:14,background:location&&time?"#E8E8E0":"#111",border:"none",color:location&&time?"#0A0A0A":"#333",fontFamily:"monospace",fontSize:"12px",letterSpacing:"3px",cursor:location&&time?"pointer":"default"}}>
          POST TO SKOCIAL
        </button>
      </div>
    </div>
  );
}

function SkocialTab({ member, kash, setKash }) {
  const [showFirstVisit,setShowFirstVisit]=useState(!VISITED.skocial);
  const [showGuide,setShowGuide]=useState(false);
  const dismissFirstVisit=()=>{ VISITED.skocial=true; setShowFirstVisit(false); };
  const [posts,setPosts]=useState(SKOCIAL_POSTS);
  const [filter,setFilter]=useState("ALL");
  const [composing,setComposing]=useState(false);
  const [wagerTarget,setWagerTarget]=useState(null);
  const [rookLine,setRookLine]=useState(ROOK.skocial[0]);
  const filters=["ALL","FIRM","MOD","GRIM","WAGER","OPEN"];

  const tapIn=(id)=>{
    setPosts(prev=>prev.map(p=>p.id===id?{...p,spotsLeft:Math.max(0,p.spotsLeft-1),tappedIn:[...p.tappedIn,"ME"]}:p));
    setRookLine(ROOK.skocial[3]);
  };
  const wagerConfirm=(amt)=>{
    setWagerTarget(null);
    setKash(k=>k-amt);
    setRookLine(`${amt}K locked. Skill decides.`);
  };
  const addPost=(data)=>{
    setPosts(prev=>[{id:Date.now(),member:member.handle,handle:member.handle.toLowerCase(),crew:member.crew,rank:member.rank,activity:data.activity,location:data.location,time:data.time,date:"TODAY",spots:data.spots,spotsLeft:data.spots,kash:data.kash,wagered:data.wager,tappedIn:[],rankGate:data.rankGate,posted:"JUST NOW",avatar:member.handle[0]},...prev]);
    setRookLine(ROOK.skocial[0]);
  };
  const filtered=posts.filter(p=>{
    if(filter==="ALL")return true;
    if(filter==="WAGER")return p.wagered;
    if(filter==="OPEN")return p.spotsLeft>0;
    return p.crew===filter;
  });

  return (
    <div style={{paddingBottom:80}}>
      <div style={{padding:"16px 20px 0",borderBottom:"1px solid #141414",background:BG,position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <div>
            <div style={{fontSize:"18px",letterSpacing:"4px",fontWeight:"bold",color:"#E8E8E0",fontFamily:"monospace"}}>SKOCIAL</div>
            <div style={{fontSize:"9px",color:"#333",letterSpacing:"2px",marginTop:2,fontFamily:"monospace"}}>SHOW UP OR DON'T</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <KashBadge balance={kash}/>
            <button onClick={()=>setShowGuide(true)} style={{width:28,height:28,background:"transparent",border:"1px solid #222",color:"#444",fontFamily:"monospace",fontSize:"10px",cursor:"pointer",letterSpacing:"0",display:"flex",alignItems:"center",justifyContent:"center"}}>?</button>
            <button onClick={()=>setComposing(true)} style={{width:34,height:34,background:"#E8E8E0",border:"none",color:"#080808",fontSize:"18px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"bold"}}>+</button>
          </div>
        </div>
        <div style={{display:"flex",gap:0,overflowX:"auto",scrollbarWidth:"none"}}>
          {filters.map(f=>{
            const fc=CREWS[f];
            const active=filter===f;
            return (
              <button key={f} onClick={()=>setFilter(f)} style={{padding:"10px 14px",flexShrink:0,background:"transparent",border:"none",borderBottom:active?`2px solid ${fc?fc.text:"#E8E8E0"}`:"2px solid transparent",color:active?(fc?fc.text:"#E8E8E0"):"#444",fontFamily:"monospace",fontSize:"10px",letterSpacing:"2px",cursor:"pointer"}}>
                {f}
              </button>
            );
          })}
        </div>
      </div>
      <RookBar line={rookLine}/>
      {filtered.length===0?(
        <div style={{padding:40,textAlign:"center",fontFamily:"monospace",fontSize:"11px",color:"#333",letterSpacing:"2px"}}>NOTHING HERE.<br/><span style={{color:"#1E1E1E"}}>BE THE FIRST OR DON'T.</span></div>
      ):(
        filtered.map(post=><PostCard key={post.id} post={post} myRank={member.rank} onTapIn={tapIn} onWager={p=>setWagerTarget(p)}/>)
      )}
      {composing&&<Composer onPost={addPost} onClose={()=>setComposing(false)}/>}
      {wagerTarget&&<WagerModal post={wagerTarget} onClose={()=>setWagerTarget(null)} onConfirm={wagerConfirm}/>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 3 — STORE (Supplements → Uniform → Kash → The Draw)
// ═══════════════════════════════════════════════════════════════════════════════
const UNIFORM_ITEMS=[
  {
    id:1, label:"THE MARK TEE",
    desc:"When you wear it you know why. Everyone else is just guessing.",
    detail:"Heavy cotton. Oversized cut. Eight-point star mark, chest left. SKOLD back collar. Crew colourway on request.",
    rankRequired:1, price:150, available:true, earned:false,
    tag:"★ RANK",
  },
  {
    id:2, label:"THE FACE CAP",
    desc:"Six panel. Worn by people who showed up enough times to earn it.",
    detail:"Structured front. Crew colour undervisor. Star embroidered side. Adjustable back.",
    rankRequired:2, price:200, available:true, earned:false,
    tag:"★★ RANK",
  },
  {
    id:3, label:"THE COACH",
    desc:"Not available yet. You'll know when it is.",
    detail:"Satin shell. Crew colour lining. Star patch chest. Made to order. Limited.",
    rankRequired:3, price:500, available:false, earned:false,
    tag:"★★★ RANK",
    locked:true,
  },
  {
    id:4, label:"FOUNDING PATCH",
    desc:"First 300 only. Yours already. Ships with the vessel.",
    detail:"Embroidered. Eight-point star. DROP 001 text reverse. Iron-on and sew-on compatible.",
    rankRequired:0, price:0, available:true, earned:true,
    tag:"FOUNDING",
  },
];

const SUPPLEMENTS_DATA=[
  {id:1,label:"SHIELD",    sub:"Protein",    desc:"Whey isolate. Unflavoured. Nothing added. 30 serves.", price:"$79.95", detail:"26g protein per serve. No artificial sweeteners. No fillers. Mixes clean."},
  {id:2,label:"HOLD",      sub:"Creatine",   desc:"Monohydrate. Pure. No filler. 60 serves.",             price:"$49.95", detail:"5g per serve. Micronised. Unflavoured. That's it."},
  {id:3,label:"HYDRATION", sub:"Electrolytes",desc:"Coconut water base. Electrolytes. No sugar. 30 serves.",price:"$54.95",detail:"Sodium, potassium, magnesium. Coconut water powder base. Natural flavour only."},
  {id:4,label:"RECOVER",   sub:"Night",      desc:"Magnesium glycinate. Tart cherry. Zinc. Ashwagandha.", price:"$59.95", detail:"Take at night. Sleep is where the work happens. Rook said that."},
];

const KASH_BUNDLES_DATA=[
  {id:1,kash:100, price:"$9.95", label:"STARTER", note:"Enough for 2 small draw entries."},
  {id:2,kash:300, price:"$24.95",label:"SOLID",   note:"Enough for the iPad draw.",popular:false},
  {id:3,kash:1000,price:"$69.95",label:"ALL IN",  note:"Multiple draw entries. Your call.",popular:true},
];

// Prizes — Vespa locked/dark, others active
const DRAW_PRIZES=[
  {id:1,tier:1,label:"HYDRATION BOX",      desc:"30-sachet SKOLD Hydration box. Your crew's blend.",                          cost:50,  entries:142,myEntries:0,closes:"3D 14H",active:true},
  {id:2,tier:1,label:"CREW PIN + FACE CAP",desc:"Magnetic enamel crew pin and The Face Cap. Ships direct.",                   cost:75,  entries:89, myEntries:2,closes:"5D 02H",active:true},
  {id:3,tier:2,label:"FULL RITUAL — 3 MONTHS",desc:"Morning stack + RECOVER. 90 sachets. Three months of the full ritual.",  cost:200, entries:44, myEntries:0,closes:"7D 00H",active:true},
  {id:4,tier:2,label:"IPAD PRO",           desc:"iPad Pro 13\". No conditions. No catches. Winner announced in-app first.",   cost:350, entries:203,myEntries:1,closes:"12D 08H",active:true},
  {id:5,tier:3,label:"VESPA ET4 — CHROME", desc:"Coming. That's all Rook will say.",                                          cost:1000,entries:0,  myEntries:0,closes:"—",        active:false,locked:true},
];

function StoreTab({ member, kash, setKash }) {
  const [section,setSection]   = useState("SUPPLEMENTS");
  const [selected,setSelected] = useState(null);
  const [expanded,setExpanded] = useState(null);
  const [entryFlash,setEntryFlash] = useState(null);
  const [kashBought,setKashBought] = useState(member.kashBought||200);
  const [kashEarned]           = useState(member.kashEarned||640);
  const SECTIONS               = ["SUPPLEMENTS","UNIFORM","KASH","THE DRAW"];

  const enter=(prize)=>{
    if(kash<prize.cost||!prize.active)return;
    setKash(k=>k-prize.cost);
    setEntryFlash({label:prize.label,cost:prize.cost});
    setSelected(null);
    setTimeout(()=>setEntryFlash(null),2500);
  };

  const buyKash=(b)=>{ setKash(k=>k+b.kash); setKashBought(p=>p+b.kash); };
  const earnedPct=(kashEarned/(kashEarned+kashBought))*100;

  return (
    <div style={{paddingBottom:80}}>

      {/* Sticky header */}
      <div style={{padding:"16px 20px",borderBottom:"1px solid #0F0F0F",background:BG,position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <div>
            <div style={{fontSize:"18px",letterSpacing:"4px",fontWeight:"bold",color:"#E8E8E0",fontFamily:"monospace"}}>STORE</div>
            <div style={{fontSize:"9px",color:"#333",letterSpacing:"2px",marginTop:1,fontFamily:"monospace"}}>MEMBERS ONLY</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:"16px",color:GOLD,fontFamily:"monospace",fontWeight:"bold",letterSpacing:"2px"}}>◆ {kash.toLocaleString()}K</div>
            <div style={{height:2,background:"#111",width:72,marginTop:4,position:"relative",marginLeft:"auto"}}>
              <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${earnedPct}%`,background:GOLD}}/>
            </div>
            <div style={{fontSize:"7px",color:"#2A2A2A",fontFamily:"monospace",letterSpacing:"1px",marginTop:2}}>{kashEarned}K EARNED · {kashBought}K BOUGHT</div>
          </div>
        </div>
        <div style={{display:"flex",gap:0,overflowX:"auto",scrollbarWidth:"none"}}>
          {SECTIONS.map(s=>(
            <button key={s} onClick={()=>setSection(s)} style={{
              padding:"8px 12px",flexShrink:0,background:"transparent",border:"none",
              borderBottom:section===s?"2px solid #E8E8E0":"2px solid transparent",
              color:section===s?"#E8E8E0":"#333",
              fontFamily:"monospace",fontSize:"9px",letterSpacing:"2px",cursor:"pointer",
              whiteSpace:"nowrap",
            }}>{s}</button>
          ))}
        </div>
      </div>

      {/* ── SUPPLEMENTS ── */}
      {section==="SUPPLEMENTS"&&(
        <div>
          <div style={{padding:"12px 16px",borderBottom:"1px solid #0A0A0A",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:"9px",color:"#2A2A2A",letterSpacing:"2px",fontFamily:"monospace"}}>OPEN TO ALL MEMBERS</span>
            <span style={{fontSize:"8px",color:"#1A1A1A",letterSpacing:"1px",fontFamily:"monospace"}}>WANT THE FULL RITUAL? SEE MEMBERSHIP</span>
          </div>
          {SUPPLEMENTS_DATA.map((s,i)=>(
            <div key={s.id} style={{borderBottom:"1px solid #0A0A0A"}}>
              <div
                onClick={()=>setExpanded(expanded===s.id?null:s.id)}
                style={{
                  display:"flex",alignItems:"center",gap:12,
                  padding:"14px 16px",cursor:"pointer",
                  background:expanded===s.id?"#0C0C0C":"transparent",
                  borderLeft:`2px solid ${expanded===s.id?"#E8E8E0":"transparent"}`,
                  transition:"all 0.15s ease",
                }}
              >
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:4}}>
                    <span style={{fontSize:"12px",color:"#E8E8E0",fontFamily:"monospace",letterSpacing:"2px"}}>{s.label}</span>
                    <span style={{fontSize:"8px",color:"#444",fontFamily:"monospace",letterSpacing:"2px"}}>{s.sub}</span>
                  </div>
                  <div style={{fontSize:"9px",color:"#555",fontFamily:"monospace",letterSpacing:"0.3px",lineHeight:1.5}}>{s.desc}</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:"14px",color:"#E8E8E0",fontFamily:"monospace",letterSpacing:"1px",marginBottom:6}}>{s.price}</div>
                  <button
                    onClick={e=>{e.stopPropagation();}}
                    style={{padding:"6px 14px",background:"transparent",border:"1px solid #222",color:"#666",fontFamily:"monospace",fontSize:"9px",letterSpacing:"2px",cursor:"pointer"}}
                  >ADD</button>
                </div>
              </div>
              {expanded===s.id&&(
                <div style={{padding:"0 16px 14px 18px",animation:"fadeUp 0.2s ease"}}>
                  <p style={{margin:0,fontSize:"10px",color:"#555",fontFamily:"monospace",lineHeight:1.8,letterSpacing:"0.3px",borderLeft:`1px solid ${GOLD}33`,paddingLeft:12}}>{s.detail}</p>
                </div>
              )}
            </div>
          ))}
          <div style={{padding:"14px 16px",borderTop:"1px solid #0A0A0A"}}>
            <div style={{
              background:"#0A0A0A",border:`1px solid ${GOLD}22`,
              borderLeft:`2px solid ${GOLD}44`,
              padding:"12px 14px",
            }}>
              <div style={{fontSize:"9px",color:GOLD,letterSpacing:"2px",fontFamily:"monospace",marginBottom:4}}>WANT THE FULL RITUAL?</div>
              <div style={{fontSize:"9px",color:"#444",fontFamily:"monospace",letterSpacing:"0.5px",lineHeight:1.8}}>
                Crew Stacks — morning formula built for how you train.<br/>
                RECOVER every night. 60 sachets monthly.<br/>
                Morning only $55/mo · Full Ritual $75/mo.<br/>
                <span style={{color:"#333"}}>Price locked forever at your join rate.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── UNIFORM ── */}
      {section==="UNIFORM"&&(
        <div>
          <div style={{padding:"12px 16px",borderBottom:"1px solid #0A0A0A"}}>
            <div style={{fontSize:"9px",color:"#2A2A2A",letterSpacing:"2px",fontFamily:"monospace",marginBottom:3}}>RANK GATED. APP ONLY. ROOK DELIVERS THE UNLOCK.</div>
            <div style={{fontSize:"8px",color:"#1A1A1A",letterSpacing:"1px",fontFamily:"monospace"}}>These are not available anywhere else. That's intentional.</div>
          </div>
          {UNIFORM_ITEMS.map(item=>{
            const locked=item.locked||(item.rankRequired>member.rank&&!item.earned);
            const isOpen=expanded===`u${item.id}`;
            return (
              <div key={item.id} style={{borderBottom:"1px solid #0A0A0A",opacity:locked?0.38:1}}>
                <div
                  onClick={()=>!locked&&setExpanded(isOpen?null:`u${item.id}`)}
                  style={{
                    padding:"16px",
                    background:isOpen?"#0C0C0C":"transparent",
                    borderLeft:`2px solid ${item.earned?GOLD:locked?"transparent":isOpen?"#E8E8E0":"transparent"}`,
                    cursor:locked?"default":"pointer",
                    transition:"all 0.15s ease",
                  }}
                >
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:6}}>
                    <div>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                        <span style={{fontSize:"13px",color:item.earned?GOLD:locked?"#2A2A2A":"#E8E8E0",fontFamily:"monospace",letterSpacing:"2px"}}>{item.label}</span>
                        {item.earned&&<span style={{fontSize:"7px",color:GOLD,letterSpacing:"3px",fontFamily:"monospace",border:`1px solid ${GOLD}44`,padding:"1px 6px"}}>EARNED</span>}
                        {locked&&!item.earned&&<span style={{fontSize:"7px",color:"#2A2A2A",letterSpacing:"2px",fontFamily:"monospace"}}>{item.tag}</span>}
                      </div>
                      <div style={{fontSize:"10px",color:locked?"#2A2A2A":"#666",fontFamily:"monospace",letterSpacing:"0.3px",lineHeight:1.5,maxWidth:240}}>{item.desc}</div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0,marginLeft:12}}>
                      {item.earned?(
                        <div style={{fontSize:"14px",color:GOLD,fontFamily:"monospace"}}>✓</div>
                      ):locked?(
                        <div style={{fontSize:"9px",color:"#222",fontFamily:"monospace",letterSpacing:"1px"}}>LOCKED</div>
                      ):(
                        <div style={{fontSize:"14px",color:"#E8E8E0",fontFamily:"monospace",letterSpacing:"1px"}}>{item.price}K</div>
                      )}
                      {!item.earned&&!locked&&(
                        <div style={{fontSize:"7px",color:"#444",fontFamily:"monospace",letterSpacing:"1px",marginTop:3}}>{item.tag}</div>
                      )}
                    </div>
                  </div>
                </div>
                {isOpen&&!locked&&(
                  <div style={{padding:"0 16px 16px 18px",animation:"fadeUp 0.2s ease"}}>
                    <p style={{margin:"0 0 12px",fontSize:"10px",color:"#555",fontFamily:"monospace",lineHeight:1.8,letterSpacing:"0.3px",borderLeft:`1px solid ${GOLD}33`,paddingLeft:12}}>{item.detail}</p>
                    {!item.earned&&(
                      <button style={{
                        width:"100%",padding:"11px 0",
                        background:"transparent",
                        border:"1px solid #E8E8E0",
                        color:"#E8E8E0",fontFamily:"monospace",
                        fontSize:"10px",letterSpacing:"3px",cursor:"pointer",
                      }}>ADD TO ORDER — {item.price}K</button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          <div style={{padding:"14px 16px",fontSize:"8px",color:"#1A1A1A",letterSpacing:"1px",lineHeight:1.8,fontFamily:"monospace"}}>
            MORE PIECES COMING. ROOK WILL ANNOUNCE WHEN THEY'RE READY.
          </div>
        </div>
      )}

      {/* ── KASH ── */}
      {section==="KASH"&&(
        <div style={{padding:16}}>
          <div style={{fontSize:"9px",color:"#333",letterSpacing:"3px",fontFamily:"monospace",marginBottom:6}}>BUY KASH</div>
          <div style={{fontSize:"9px",color:"#2A2A2A",fontFamily:"monospace",letterSpacing:"0.5px",lineHeight:1.8,marginBottom:20}}>
            Bought Kash spends the same as earned.<br/>It just doesn't count on the board. That's the deal.
          </div>
          {KASH_BUNDLES_DATA.map(b=>(
            <div key={b.id} style={{
              background:"#0A0A0A",
              border:`1px solid ${b.popular?GOLD+"44":"#141414"}`,
              borderLeft:`3px solid ${b.popular?GOLD:"#1E1E1E"}`,
              padding:"16px",marginBottom:1,position:"relative",
            }}>
              {b.popular&&<div style={{position:"absolute",top:12,right:14,fontSize:"7px",color:GOLD,letterSpacing:"2px",fontFamily:"monospace"}}>MOST POPULAR</div>}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div>
                  <div style={{fontSize:"10px",color:"#888",fontFamily:"monospace",letterSpacing:"2px",marginBottom:4}}>{b.label}</div>
                  <div style={{fontSize:"22px",color:GOLD,fontFamily:"monospace",fontWeight:"bold",letterSpacing:"2px"}}>◆ {b.kash.toLocaleString()}K</div>
                </div>
                <div style={{textAlign:"right",marginTop:4}}>
                  <div style={{fontSize:"18px",color:"#E8E8E0",fontFamily:"monospace",letterSpacing:"1px"}}>{b.price}</div>
                  <div style={{fontSize:"8px",color:"#444",fontFamily:"monospace",letterSpacing:"1px",marginTop:2}}>AUD</div>
                </div>
              </div>
              <div style={{fontSize:"9px",color:"#444",fontFamily:"monospace",letterSpacing:"0.5px",marginBottom:12}}>{b.note}</div>
              <button onClick={()=>buyKash(b)} style={{
                width:"100%",padding:"10px 0",
                background:b.popular?GOLD:"transparent",
                border:`1px solid ${b.popular?GOLD:"#222"}`,
                color:b.popular?"#0A0A0A":"#666",
                fontFamily:"monospace",fontSize:"10px",
                letterSpacing:"2px",cursor:"pointer",
                fontWeight:b.popular?"bold":"normal",
              }}>BUY {b.kash.toLocaleString()}K</button>
            </div>
          ))}
          <div style={{padding:"14px 0",fontSize:"8px",color:"#1A1A1A",lineHeight:1.8,letterSpacing:"0.5px",fontFamily:"monospace"}}>
            KASH HAS NO CASH VALUE. CANNOT BE WITHDRAWN OR CONVERTED TO AUD.<br/>PAYMENTS PROCESSED SECURELY.
          </div>
        </div>
      )}

      {/* ── THE DRAW ── */}
      {section==="THE DRAW"&&(
        <>
          <div style={{padding:"8px 16px",display:"flex",alignItems:"center",gap:8,borderBottom:"1px solid #0A0A0A"}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:"#1A4A1A",boxShadow:"0 0 6px #1A4A1A",animation:"pulse 2s infinite"}}/>
            <span style={{fontSize:"8px",color:"#2A4A2A",letterSpacing:"2px",fontFamily:"monospace"}}>
              {DRAW_PRIZES.filter(p=>p.active).length} PRIZES LIVE
            </span>
            <span style={{fontSize:"8px",color:"#1A1A1A",marginLeft:"auto",letterSpacing:"1px",fontFamily:"monospace"}}>WINNER IN-APP FIRST</span>
          </div>

          {/* Rook line */}
          <div style={{padding:"10px 16px",borderBottom:"1px solid #0A0A0A",display:"flex",gap:10,alignItems:"flex-start"}}>
            <span style={{fontSize:"8px",color:GOLD,letterSpacing:"2px",flexShrink:0,fontFamily:"monospace"}}>ROOK //</span>
            <span style={{fontSize:"11px",color:"#444",lineHeight:1.5,letterSpacing:"0.3px",fontFamily:"monospace"}}>
              Five prizes. Always five. One of them is a Vespa. The rest are just warm up.
            </span>
          </div>

          {DRAW_PRIZES.map(prize=>{
            const mine=prize.myEntries>0;
            const chance=mine?((prize.myEntries/prize.entries)*100).toFixed(1):null;
            const canAfford=kash>=prize.cost;
            if(prize.locked){
              return (
                <div key={prize.id} style={{
                  background:"#080808",
                  border:"1px solid #0D0D0D",
                  borderLeft:"3px solid #111",
                  padding:16,marginBottom:1,
                  opacity:0.35,
                  position:"relative",
                }}>
                  <div style={{display:"flex",gap:6,marginBottom:8,alignItems:"center"}}>
                    <span style={{fontSize:"8px",color:"#222",border:"1px solid #111",padding:"2px 8px",letterSpacing:"2px",fontFamily:"monospace"}}>PRIZE {prize.id}</span>
                    <span style={{fontSize:"8px",color:"#1A1A1A",letterSpacing:"2px",fontFamily:"monospace",marginLeft:"auto"}}>NOT YET</span>
                  </div>
                  <div style={{fontSize:16,color:"#222",letterSpacing:"2px",fontFamily:"monospace",fontWeight:"bold",marginBottom:6}}>{prize.label}</div>
                  <div style={{fontSize:"10px",color:"#1A1A1A",fontFamily:"monospace",lineHeight:1.6}}>{prize.desc}</div>
                </div>
              );
            }
            return (
              <div key={prize.id} style={{background:"#0A0A0A",border:`1px solid ${prize.tier===3?GOLD+"44":"#141414"}`,borderLeft:`3px solid ${prize.tier===1?"#1E1E1E":prize.tier===2?"#2A2A2A":GOLD}`,marginBottom:1,padding:16,position:"relative",overflow:"hidden"}}>
                <div style={{display:"flex",gap:6,marginBottom:8,alignItems:"center"}}>
                  <span style={{fontSize:"8px",color:prize.tier===3?GOLD:"#333",border:`1px solid ${prize.tier===3?GOLD+"44":"#1A1A1A"}`,padding:"2px 8px",letterSpacing:"2px",fontFamily:"monospace"}}>PRIZE {prize.id}</span>
                </div>
                <div style={{fontSize:prize.tier===3?15:14,color:"#E8E8E0",letterSpacing:"2px",fontFamily:"monospace",fontWeight:"bold",marginBottom:6}}>{prize.label}</div>
                <div style={{fontSize:"10px",color:"#555",fontFamily:"monospace",lineHeight:1.6,marginBottom:10,letterSpacing:"0.3px"}}>{prize.desc}</div>
                <div style={{display:"flex",gap:16,marginBottom:10,fontFamily:"monospace"}}>
                  {[["ENTRIES",prize.entries],["CLOSES",prize.closes],["COST",`${prize.cost}K`]].map(([l,v])=>(
                    <div key={l}><div style={{fontSize:"8px",color:"#2A2A2A",letterSpacing:"1px"}}>{l}</div><div style={{fontSize:"12px",color:l==="COST"?GOLD:"#666",letterSpacing:"1px"}}>{v}</div></div>
                  ))}
                  {chance&&<div><div style={{fontSize:"8px",color:"#2A2A2A",letterSpacing:"1px"}}>MY CHANCE</div><div style={{fontSize:"12px",color:"#E8E8E0",letterSpacing:"1px"}}>{chance}%</div></div>}
                </div>
                {mine&&<div style={{background:"#0F0F0F",border:"1px solid #1A1A1A",padding:"5px 10px",marginBottom:10,display:"flex",justifyContent:"space-between",fontFamily:"monospace"}}><span style={{fontSize:"9px",color:"#444",letterSpacing:"1px"}}>MY ENTRIES</span><span style={{fontSize:"9px",color:"#E8E8E0",letterSpacing:"1px"}}>{prize.myEntries}</span></div>}
                {!canAfford&&<div style={{fontSize:"8px",color:"#7A1A1A",fontFamily:"monospace",letterSpacing:"1px",marginBottom:6}}>NEED {prize.cost-kash}K MORE — GET KASH ABOVE</div>}
                <button onClick={()=>setSelected(prize)} style={{width:"100%",padding:"10px 0",background:"transparent",border:`1px solid ${prize.tier===3?"#2A2A2A":"#1E1E1E"}`,color:"#555",fontFamily:"monospace",fontSize:"10px",letterSpacing:"3px",cursor:"pointer"}}>ENTER — {prize.cost}K</button>
              </div>
            );
          })}
          <div style={{padding:16,fontSize:"8px",color:"#1A1A1A",lineHeight:1.8,letterSpacing:"0.5px",fontFamily:"monospace"}}>SKOLD KASH HAS NO CASH VALUE AND CANNOT BE WITHDRAWN OR CONVERTED TO AUD.</div>
        </>
      )}

      {/* Prize confirm modal */}
      {selected&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.93)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setSelected(null)}>
          <div style={{background:"#0D0D0D",border:"1px solid #222",padding:24,width:"100%",maxWidth:340,fontFamily:"monospace"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:"9px",color:"#333",letterSpacing:"3px",marginBottom:6}}>DRAW ENTRY</div>
            <div style={{fontSize:"16px",color:"#E8E8E0",letterSpacing:"2px",marginBottom:4}}>{selected.label}</div>
            <div style={{fontSize:"10px",color:"#555",marginBottom:16,lineHeight:1.6}}>{selected.desc}</div>
            <div style={{background:"#0A0A0A",border:"1px solid #111",padding:"10px 12px",marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:"9px",color:"#444",letterSpacing:"1px"}}>COST</span><span style={{fontSize:"9px",color:GOLD,letterSpacing:"1px"}}>{selected.cost}K</span></div>
              <div style={{height:1,background:"#111",margin:"6px 0"}}/>
              <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:"9px",color:"#E8E8E0",letterSpacing:"1px"}}>BALANCE AFTER</span><span style={{fontSize:"9px",color:kash>=selected.cost?GOLD:"#7A1A1A",letterSpacing:"1px"}}>{kash>=selected.cost?(kash-selected.cost).toLocaleString()+"K":"INSUFFICIENT"}</span></div>
            </div>
            <div style={{fontSize:"8px",color:"#222",lineHeight:1.7,marginBottom:16,letterSpacing:"0.5px"}}>KASH HAS NO CASH VALUE. CANNOT BE WITHDRAWN OR CONVERTED TO AUD.</div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setSelected(null)} style={{flex:1,padding:10,background:"transparent",border:"1px solid #222",color:"#444",fontFamily:"monospace",fontSize:"10px",cursor:"pointer",letterSpacing:"2px"}}>CANCEL</button>
              <button onClick={()=>kash>=selected.cost&&enter(selected)} style={{flex:2,padding:10,background:kash>=selected.cost?"#E8E8E0":"#111",border:"none",color:kash>=selected.cost?"#0A0A0A":"#333",fontFamily:"monospace",fontSize:"10px",cursor:kash>=selected.cost?"pointer":"default",letterSpacing:"2px",fontWeight:"bold"}}>ENTER</button>
            </div>
          </div>
        </div>
      )}

      {/* Entry flash */}
      {entryFlash&&(
        <div style={{position:"fixed",inset:0,zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.88)",pointerEvents:"none"}}>
          <div style={{textAlign:"center",animation:"kashIn 2.5s ease forwards"}}>
            <div style={{fontSize:"11px",color:"#444",letterSpacing:"3px",fontFamily:"monospace",marginBottom:8}}>ENTERED</div>
            <div style={{fontSize:"20px",color:"#E8E8E0",letterSpacing:"3px",fontFamily:"monospace",marginBottom:4}}>{entryFlash.label}</div>
            <div style={{fontSize:"12px",color:GOLD,letterSpacing:"2px",fontFamily:"monospace"}}>−{entryFlash.cost}K</div>
          </div>
        </div>
      )}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}} @keyframes kashIn{0%{opacity:0;transform:translateY(10px)}15%{opacity:1;transform:translateY(0)}80%{opacity:1}100%{opacity:0}}`}</style>
    </div>
  );
}

// TAB 4 — BOARD
// ═══════════════════════════════════════════════════════════════════════════════
function BoardTab({ member }) {
  const [view,setView]=useState("GLOBAL");
  const rookLine=ROOK.board[Math.floor(Math.random()*ROOK.board.length)];
  const now=new Date();
  const next=new Date(now.getFullYear(),now.getMonth()+1,1);
  const diff=next-now;
  const daysLeft=Math.floor(diff/86400000);
  const hrsLeft=Math.floor((diff%86400000)/3600000);

  return (
    <div style={{paddingBottom:80}}>
      <TabHeader title="BOARD" sub="LEADERBOARD" kashBalance={member.kashBalance}/>
      <RookBar line={rookLine}/>
      <div style={{padding:"8px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid #0A0A0A",background:"#0A0A0A"}}>
        <span style={{fontSize:"8px",color:"#222",letterSpacing:"2px",fontFamily:"monospace"}}>MONTHLY RESET</span>
        <span style={{fontSize:"9px",color:"#333",letterSpacing:"2px",fontFamily:"monospace"}}>{daysLeft}D {hrsLeft}H REMAINING</span>
      </div>
      <div style={{display:"flex",borderBottom:"1px solid #111"}}>
        {["GLOBAL","CREW","MY RANK"].map(v=>(
          <button key={v} onClick={()=>setView(v)} style={{flex:1,padding:"11px 0",background:"transparent",border:"none",borderBottom:view===v?"2px solid #E8E8E0":"2px solid transparent",color:view===v?"#E8E8E0":"#333",fontFamily:"monospace",fontSize:"9px",letterSpacing:"2px",cursor:"pointer"}}>{v}</button>
        ))}
      </div>

      {view==="GLOBAL"&&(
        <>
          <div style={{display:"flex",padding:"8px 16px 8px 58px",borderBottom:"1px solid #0A0A0A"}}>
            <span style={{flex:1,fontSize:"7px",color:"#1A1A1A",letterSpacing:"2px",fontFamily:"monospace"}}>MEMBER</span>
            <span style={{fontSize:"7px",color:"#1A1A1A",letterSpacing:"2px",fontFamily:"monospace"}}>EARNED KASH</span>
          </div>
          {GLOBAL_BOARD.map(m=>{
            const c=CREWS[m.crew];
            const isTop=m.rank===1;
            const isMe=m.isMe;
            return (
              <div key={m.handle} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 16px",borderBottom:"1px solid #0A0A0A",background:isMe?"#0C0C0A":isTop?"#0A0A08":"transparent",borderLeft:`2px solid ${isMe?c.color:isTop?GOLD:"transparent"}`}}>
                <div style={{width:24,flexShrink:0,textAlign:"center",fontFamily:"monospace",fontSize:isTop?14:11,color:isTop?GOLD:isMe?c.text:"#2A2A2A",fontWeight:isTop?"bold":"normal",textShadow:isTop?`0 0 10px ${GOLD}44`:"none"}}>{isTop?"◆":m.rank}</div>
                <Avatar letter={m.avatar} crew={m.crew} size={28}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                    <span style={{fontFamily:"monospace",fontSize:"11px",color:isMe?"#E8E8E0":isTop?GOLD:"#888",letterSpacing:"1px"}}>{m.handle}</span>
                    {isMe&&<span style={{fontSize:"7px",color:c.text,letterSpacing:"2px",fontFamily:"monospace"}}>YOU</span>}
                    {isTop&&<span style={{fontSize:"8px",color:GOLD}}>★</span>}
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <span style={{fontSize:"8px",color:"#2A2A2A",fontFamily:"monospace"}}>{c.label}</span>
                    <span style={{fontSize:"8px",color:"#2A2A2A",fontFamily:"monospace"}}>{"★".repeat(m.stars)}</span>
                  </div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontFamily:"monospace",fontSize:"12px",color:isTop?GOLD:isMe?"#E8E8E0":"#444",letterSpacing:"1px"}}>{m.kash.toLocaleString()}K</div>
                  <div style={{fontSize:"8px",color:"#1E1E1E",fontFamily:"monospace"}}>{m.activities}A · {m.wagers}W</div>
                </div>
              </div>
            );
          })}
          <div style={{padding:"12px 16px",fontSize:"8px",color:"#1A1A1A",lineHeight:1.8,fontFamily:"monospace",letterSpacing:"0.5px"}}>EARNED KASH ONLY. PURCHASED KASH NOT COUNTED. TOP PERFORMER RECEIVES DIGITAL GOLD STAR AT MONTH END.</div>
        </>
      )}

      {view==="CREW"&&(
        <div style={{padding:16}}>
          <div style={{fontSize:"9px",color:"#222",letterSpacing:"3px",fontFamily:"monospace",marginBottom:16}}>EARNED KASH COLLECTIVE — THIS MONTH</div>
          {[...CREW_SCORES].sort((a,b)=>b.collective-a.collective).map((crew,i)=>{
            const c=CREWS[crew.crew];
            const max=Math.max(...CREW_SCORES.map(s=>s.collective));
            const pct=(crew.collective/max)*100;
            const leading=i===0;
            return (
              <div key={crew.crew} style={{marginBottom:20}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,alignItems:"flex-end"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:"10px",color:leading?c.text:"#555",fontFamily:"monospace",letterSpacing:"2px"}}>{c.label}</span>
                    {leading&&<span style={{fontSize:"8px",color:c.text,letterSpacing:"1px",fontFamily:"monospace"}}>LEADING</span>}
                  </div>
                  <span style={{fontSize:"12px",color:leading?c.text:"#444",fontFamily:"monospace",letterSpacing:"1px"}}>{crew.collective.toLocaleString()}K</span>
                </div>
                <div style={{height:6,background:"#0F0F0F",position:"relative"}}>
                  <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${pct}%`,background:c.color,transition:"width 0.8s ease",boxShadow:leading?`0 0 8px ${c.color}66`:"none"}}/>
                </div>
                <div style={{display:"flex",gap:16,marginTop:6,fontFamily:"monospace",fontSize:"8px",color:"#222"}}>
                  <span>{crew.members} FACES</span><span>AVG STREAK {crew.avgStreak}D</span><span>{crew.wagerWins} WAGER W</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view==="MY RANK"&&(
        <div style={{padding:16}}>
          <div style={{fontSize:"9px",color:"#222",letterSpacing:"3px",fontFamily:"monospace",marginBottom:12}}>YOUR RANK IN {CREWS[member.crew].label}</div>
          <div style={{background:"#0A0A0A",border:`1px solid ${CREWS[member.crew].color}33`,borderLeft:`3px solid ${CREWS[member.crew].color}`,padding:"14px 16px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontSize:"32px",color:CREWS[member.crew].text,fontFamily:"monospace",fontWeight:"bold",letterSpacing:"2px",lineHeight:1}}>#4</div>
              <div style={{fontSize:"9px",color:"#333",fontFamily:"monospace",letterSpacing:"1px",marginTop:4}}>OF 298 IN {CREWS[member.crew].label}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:"10px",color:"#444",fontFamily:"monospace",letterSpacing:"1px"}}>TOP</div>
              <div style={{fontSize:"20px",color:"#E8E8E0",fontFamily:"monospace",letterSpacing:"1px"}}>1.3%</div>
            </div>
          </div>
          {[["ACTIVITIES",9,4],["WAGER WINS",1,5],["STAR DAYS",12,6],["STREAK BEST","4D",8],["KASH EARNED","840K",4]].map(([l,v,r])=>(
            <div key={l} style={{display:"flex",alignItems:"center",padding:"9px 0",borderBottom:"1px solid #0A0A0A"}}>
              <span style={{flex:1,fontSize:"9px",color:"#333",fontFamily:"monospace",letterSpacing:"2px"}}>{l}</span>
              <span style={{fontSize:"11px",color:"#666",fontFamily:"monospace",letterSpacing:"1px",marginRight:16,minWidth:48,textAlign:"right"}}>{v}</span>
              <span style={{fontSize:"10px",color:r<=3?CREWS[member.crew].text:"#333",fontFamily:"monospace",letterSpacing:"1px",minWidth:36,textAlign:"right"}}>#{r}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// TAB 5 — ME (Profile + Membership merged)
// ═══════════════════════════════════════════════════════════════════════════════
const MOCK_ORDERS=[
  {id:"SK-0047-001",item:"VESSEL DROP 001 + FOUNDING BOX",status:"DELIVERED",date:"12 MAY 2026",tracking:"AUS123456789",new:false},
  {id:"SK-0047-002",item:"FULL RITUAL — MONTH 1",status:"IN TRANSIT",date:"22 MAY 2026",tracking:"AUS987654321",new:true,eta:"24–26 MAY"},
  {id:"SK-0047-003",item:"CREW PIN + CAP",status:"PROCESSING",date:"22 MAY 2026",tracking:null,new:true},
];
const MOCK_NOTIFS=[
  {id:1,type:"TAG",   message:"You've been tagged. Rook the Grim is watching.", time:"2 MIN AGO", read:false,color:"#7A1A1A"},
  {id:2,type:"KASH",  message:"Daily star complete. +50K dropped.",             time:"6 HR AGO",  read:false,color:GOLD},
  {id:3,type:"SIGNAL",message:"ACE challenged you. First to 15 reps.",          time:"YESTERDAY", read:true, color:"#2A2A2A"},
  {id:4,type:"ORDER", message:"Full Ritual Month 1 is on its way.",             time:"YESTERDAY", read:true, color:"#1A3A1A"},
  {id:5,type:"ROOK",  message:"Rook the Grim noticed you were not here yesterday.",time:"2 DAYS AGO",read:true,color:GOLD},
];

function MeTab({ member, setMember, kash }) {
  const c=CREWS[member.crew];
  const inputRef=useRef(null);
  const [section,setSection]=useState("PROFILE");
  const [showCodex,setShowCodex]=useState(false);
  const [notifs,setNotifs]=useState(MOCK_NOTIFS);
  const unread=notifs.filter(n=>!n.read).length;
  const earnedPct=(member.kashEarned/(member.kashEarned+member.kashBought))*100;

  const handlePhoto=(e)=>{
    const file=e.target.files[0];
    if(!file)return;
    const reader=new FileReader();
    reader.onload=(ev)=>setMember(m=>({...m,photo:ev.target.result}));
    reader.readAsDataURL(file);
  };

  const markAllRead=()=>setNotifs(prev=>prev.map(n=>({...n,read:true})));

  return (
    <div style={{paddingBottom:80}}>
      {/* Header */}
      <div style={{padding:"16px 20px",borderBottom:"1px solid #0F0F0F",background:BG,position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <div>
            <div style={{fontSize:"18px",letterSpacing:"4px",fontWeight:"bold",color:"#E8E8E0",fontFamily:"monospace"}}>ME</div>
            <div style={{fontSize:"9px",color:"#333",letterSpacing:"2px",marginTop:1,fontFamily:"monospace"}}>FACE #{member.foundingNumber}</div>
          </div>
          <div style={{background:"#0A0A0A",border:`1px solid ${GOLD}33`,padding:"5px 10px",fontSize:"10px",color:GOLD,letterSpacing:"1px",fontFamily:"monospace"}}>◆ {kash.toLocaleString()}K</div>
        </div>
        <div style={{display:"flex",gap:0,overflowX:"auto",scrollbarWidth:"none"}}>
          {["PROFILE","MEMBERSHIP","ORDERS","NOTIFICATIONS"].map(s=>(
            <button key={s} onClick={()=>setSection(s)} style={{
              padding:"8px 10px",flexShrink:0,background:"transparent",border:"none",
              borderBottom:section===s?"2px solid #E8E8E0":"2px solid transparent",
              color:section===s?"#E8E8E0":"#333",
              fontFamily:"monospace",fontSize:"9px",letterSpacing:"1.5px",cursor:"pointer",
              position:"relative",
            }}>
              {s}
              {s==="NOTIFICATIONS"&&unread>0&&(
                <div style={{position:"absolute",top:6,right:4,width:6,height:6,borderRadius:"50%",background:"#7A1A1A"}}/>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── PROFILE SECTION ── */}
      {section==="PROFILE"&&(
        <div>
          {/* Member card */}
          <div style={{margin:16,background:"#0A0A0A",border:`1px solid ${c.color}44`,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,right:0,width:"50%",height:"100%",background:`linear-gradient(to left,${c.color}0A,transparent)`,pointerEvents:"none"}}/>
            <div style={{height:3,background:c.color,boxShadow:`0 0 12px ${c.color}66`}}/>
            <div style={{padding:16}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:14,marginBottom:14}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <div onClick={()=>inputRef.current?.click()} style={{width:56,height:56,borderRadius:"50%",background:c.color,border:`2px solid ${c.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"22px",fontFamily:"monospace",fontWeight:"bold",color:"#E8E8E0",cursor:"pointer",overflow:"hidden"}}>
                    {member.photo?<img src={member.photo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:member.handle[0]}
                  </div>
                  <span style={{fontSize:"7px",color:"#1E1E1E",fontFamily:"monospace",letterSpacing:"1px",cursor:"pointer"}} onClick={()=>inputRef.current?.click()}>{member.photo?"CHANGE":"TAP"}</span>
                  <input ref={inputRef} type="file" accept="image/*" style={{display:"none"}} onChange={handlePhoto}/>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:"22px",fontFamily:"monospace",fontWeight:"bold",color:"#E8E8E0",letterSpacing:"3px",lineHeight:1,marginBottom:6}}>{member.handle}</div>
                  <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:6}}>
                    <span style={{fontSize:"9px",color:c.text,border:`1px solid ${c.color}`,padding:"2px 8px",fontFamily:"monospace",letterSpacing:"2px"}}>{c.label}</span>
                    <span style={{fontSize:"10px",color:c.text,fontFamily:"monospace",letterSpacing:"2px"}}>{"★".repeat(member.rank)}</span>
                  </div>
                  {member.bio&&<div style={{fontSize:"10px",color:"#444",fontFamily:"monospace",letterSpacing:"0.5px",fontStyle:"italic"}}>"{member.bio}"</div>}
                </div>
              </div>
              <div style={{display:"flex",borderTop:"1px solid #111",padding:"10px 0"}}>
                {[["FOUNDING","#"+member.foundingNumber],["DROP",member.drop],["JOINED",member.joinDate]].map(([l,v],i)=>(
                  <div key={l} style={{flex:1,textAlign:"center",borderRight:i<2?"1px solid #111":"none"}}>
                    <div style={{fontSize:"7px",color:"#2A2A2A",letterSpacing:"2px",fontFamily:"monospace",marginBottom:3}}>{l}</div>
                    <div style={{fontSize:"11px",color:"#E8E8E0",fontFamily:"monospace",letterSpacing:"2px"}}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Kash */}
          <div style={{padding:"0 16px 16px"}}>
            <div style={{fontSize:"9px",color:"#222",letterSpacing:"3px",fontFamily:"monospace",marginBottom:10}}>KASH</div>
            <div style={{background:"#0A0A0A",border:`1px solid ${GOLD}22`,borderLeft:`3px solid ${GOLD}`,padding:"12px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:"9px",color:"#444",fontFamily:"monospace",letterSpacing:"2px"}}>BALANCE</span>
              <span style={{fontSize:"20px",color:GOLD,fontFamily:"monospace",fontWeight:"bold",letterSpacing:"2px"}}>◆ {kash.toLocaleString()}K</span>
            </div>
            <div style={{height:3,background:"#111",position:"relative",marginBottom:4}}>
              <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${earnedPct}%`,background:GOLD}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <span style={{fontSize:"7px",color:"#2A2A2A",fontFamily:"monospace",letterSpacing:"1px"}}>EARNED {member.kashEarned}K</span>
              <span style={{fontSize:"7px",color:"#1A1A1A",fontFamily:"monospace",letterSpacing:"1px"}}>BOUGHT {member.kashBought}K · ONLY EARNED COUNTS ON BOARD</span>
            </div>
          </div>

          {/* Stats grid */}
          <div style={{padding:"0 16px 16px"}}>
            <div style={{fontSize:"9px",color:"#222",letterSpacing:"3px",fontFamily:"monospace",marginBottom:10}}>STATS — THIS MONTH</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:"#0F0F0F",border:"1px solid #0F0F0F"}}>
              {[["ACTIVITIES",member.activitiesCompleted,false],["STAR DAYS",member.starDaysTotal,false],["STREAK",`${member.streak}D`,member.streak>=7],["BEST STREAK",`${member.streakBest}D`,false],["WAGER WINS",member.wagerWins,false],["PRIZE ENTRIES",member.prizeEntries,false],["SKOCIAL POSTS",member.skocialPosts,false],["NFC TAPS",member.nfcTaps,false]].map(([l,v,hi])=>(
                <div key={l} style={{background:"#0A0A0A",padding:"12px 14px",borderLeft:`2px solid ${hi?GOLD:"transparent"}`}}>
                  <div style={{fontSize:"7px",color:"#222",fontFamily:"monospace",letterSpacing:"2px",marginBottom:4}}>{l}</div>
                  <div style={{fontSize:"18px",color:hi?GOLD:"#666",fontFamily:"monospace",fontWeight:"bold"}}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Gold pin */}
          <div style={{padding:"0 16px 16px"}}>
            <div style={{background:"#0A0A0A",border:`1px solid ${GOLD}22`,padding:"14px 16px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div>
                  <div style={{fontSize:"9px",color:GOLD,fontFamily:"monospace",letterSpacing:"2px",marginBottom:3}}>◆ PHYSICAL GOLD PIN</div>
                  <div style={{fontSize:"8px",color:"#333",fontFamily:"monospace",letterSpacing:"1px"}}>10 WAGER WINS REQUIRED. NO SHORTCUTS.</div>
                </div>
                <div style={{fontSize:"14px",color:"#444",fontFamily:"monospace"}}>{member.goldPinProgress}/10</div>
              </div>
              <div style={{display:"flex",gap:3,marginBottom:6}}>
                {Array.from({length:10}).map((_,i)=>(
                  <div key={i} style={{flex:1,height:6,background:i<member.goldPinProgress?GOLD:"#111"}}/>
                ))}
              </div>
              <div style={{fontSize:"8px",color:"#1A1A1A",fontFamily:"monospace",letterSpacing:"1px"}}>THIS MECHANIC NEVER CHANGES. MONTHLY RESET DOES NOT APPLY.</div>
            </div>
          </div>
        </div>
      )}

      {/* ── MEMBERSHIP SECTION ── */}
      {section==="MEMBERSHIP"&&(
        <div>
          {/* Subscription status */}
          <div style={{margin:16,background:"#0A0A0A",border:`1px solid ${c.color}33`,borderLeft:`3px solid ${c.color}`,padding:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
              <div>
                <div style={{fontSize:"9px",color:"#444",letterSpacing:"3px",fontFamily:"monospace",marginBottom:4}}>SUBSCRIPTION</div>
                <div style={{fontSize:"14px",color:c.text,letterSpacing:"2px",fontFamily:"monospace"}}>FULL RITUAL</div>
                <div style={{fontSize:"9px",color:"#555",fontFamily:"monospace",letterSpacing:"1px",marginTop:3}}>MORNING STACK + RECOVER · 60 SACHETS/MONTH</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:"18px",color:"#E8E8E0",fontFamily:"monospace",fontWeight:"bold"}}>$75</div>
                <div style={{fontSize:"8px",color:"#444",fontFamily:"monospace",letterSpacing:"1px"}}>AUD/MONTH</div>
              </div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderTop:"1px solid #111",borderBottom:"1px solid #111",marginBottom:8}}>
              <div>
                <div style={{fontSize:"7px",color:"#2A2A2A",letterSpacing:"2px",fontFamily:"monospace",marginBottom:2}}>NEXT BILLING</div>
                <div style={{fontSize:"11px",color:"#666",fontFamily:"monospace",letterSpacing:"1px"}}>1 JUN 2026</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:"7px",color:"#2A2A2A",letterSpacing:"2px",fontFamily:"monospace",marginBottom:2}}>YOUR PRICE — LOCKED</div>
                <div style={{fontSize:"11px",color:GOLD,fontFamily:"monospace",letterSpacing:"1px"}}>$75/MO FOREVER</div>
              </div>
            </div>
            <div style={{fontSize:"8px",color:"#2A2A2A",fontFamily:"monospace",letterSpacing:"1px",lineHeight:1.7}}>
              Your subscription price is locked at your join rate.<br/>It never increases. That's the deal.
            </div>
          </div>

          {/* Next shipment */}
          <div style={{padding:"0 16px 16px"}}>
            <div style={{fontSize:"9px",color:"#222",letterSpacing:"3px",fontFamily:"monospace",marginBottom:10}}>NEXT SHIPMENT</div>
            <div style={{background:"#0A0A0A",border:"1px solid #1A3A1A",borderLeft:"2px solid #2A5A2A",padding:"14px 16px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div>
                  <div style={{fontSize:"11px",color:"#E8E8E0",fontFamily:"monospace",letterSpacing:"1px",marginBottom:3}}>FULL RITUAL — MONTH 1</div>
                  <div style={{fontSize:"8px",color:"#3A7A3A",fontFamily:"monospace",letterSpacing:"1px"}}>IN TRANSIT</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:"8px",color:"#444",fontFamily:"monospace",letterSpacing:"1px",marginBottom:2}}>ETA</div>
                  <div style={{fontSize:"11px",color:"#E8E8E0",fontFamily:"monospace",letterSpacing:"1px"}}>24–26 MAY</div>
                </div>
              </div>
              <div style={{height:3,background:"#111",marginBottom:8,position:"relative"}}>
                <div style={{position:"absolute",left:0,top:0,height:"100%",width:"65%",background:"#2A5A2A"}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:"7px",color:"#1A3A1A",fontFamily:"monospace",letterSpacing:"1px",marginBottom:10}}>
                <span>PACKED</span><span>DISPATCHED</span><span style={{color:"#2A5A2A"}}>IN TRANSIT</span><span style={{color:"#1A1A1A"}}>DELIVERED</span>
              </div>
              <div style={{fontSize:"9px",color:"#2A2A2A",fontFamily:"monospace",letterSpacing:"1px",marginBottom:6}}>TRACKING: AUS987654321</div>
              <button style={{width:"100%",padding:"8px 0",background:"transparent",border:"1px solid #1A3A1A",color:"#2A5A2A",fontFamily:"monospace",fontSize:"9px",letterSpacing:"2px",cursor:"pointer"}}>TRACK SHIPMENT</button>
            </div>
          </div>

          {/* Health */}
          <div style={{padding:"0 16px 16px"}}>
            <div style={{fontSize:"9px",color:"#222",letterSpacing:"3px",fontFamily:"monospace",marginBottom:10}}>HEALTH CONNECTION</div>
            <div style={{background:"#0A0A0A",border:`1px solid ${member.healthConnected?"#1A3A1A":"#1A1A1A"}`,borderLeft:`2px solid ${member.healthConnected?"#2A5A2A":"#1A1A1A"}`,padding:"12px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:member.healthConnected?"#2A5A2A":"#1A1A1A",boxShadow:member.healthConnected?"0 0 8px #2A5A2A":"none"}}/>
                <div>
                  <div style={{fontSize:"10px",color:member.healthConnected?"#3A7A3A":"#333",fontFamily:"monospace",letterSpacing:"2px"}}>{member.healthConnected?member.healthPlatform:"NOT CONNECTED"}</div>
                  <div style={{fontSize:"8px",color:"#1A1A1A",fontFamily:"monospace",letterSpacing:"1px",marginTop:2}}>MOVE · TRAIN · RECOVER AUTO-FED TO STAR TRACKER</div>
                </div>
              </div>
              <button style={{padding:"5px 10px",background:"transparent",border:`1px solid ${member.healthConnected?"#1A3A1A":"#222"}`,color:member.healthConnected?"#2A5A2A":"#444",fontFamily:"monospace",fontSize:"8px",letterSpacing:"2px",cursor:"pointer"}}>{member.healthConnected?"MANAGE":"CONNECT"}</button>
            </div>
          </div>

          {/* Station — teased */}
          <div style={{padding:"0 16px 16px"}}>
            <div style={{fontSize:"9px",color:"#222",letterSpacing:"3px",fontFamily:"monospace",marginBottom:10}}>SKOLD STATION</div>
            <div style={{background:"#0A0A0A",border:"1px solid #111",padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div>
                <div style={{fontSize:"10px",color:"#2A2A2A",fontFamily:"monospace",letterSpacing:"2px",marginBottom:4}}>NOT LIVE YET</div>
                <div style={{fontSize:"8px",color:"#1A1A1A",fontFamily:"monospace",letterSpacing:"1px",lineHeight:1.7}}>Rook the Grim is building something.<br/>You'll know when it's ready.</div>
              </div>
              <div style={{fontSize:"20px",color:"#1A1A1A"}}>◉</div>
            </div>
          </div>

          {/* NFC vessel */}
          <div style={{padding:"0 16px 16px"}}>
            <div style={{fontSize:"9px",color:"#222",letterSpacing:"3px",fontFamily:"monospace",marginBottom:10}}>VESSEL</div>
            <div style={{background:"#0A0A0A",border:"1px solid #141414",padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:"10px",color:"#555",fontFamily:"monospace",letterSpacing:"1px",marginBottom:3}}>DROP 001 · #{member.foundingNumber}</div>
                <div style={{fontSize:"8px",color:"#2A2A2A",fontFamily:"monospace",letterSpacing:"1px"}}>{member.nfcTaps} NFC TAPS LOGGED</div>
              </div>
              <button style={{padding:"5px 10px",background:"transparent",border:"1px solid #1A1A1A",color:"#333",fontFamily:"monospace",fontSize:"8px",letterSpacing:"2px",cursor:"pointer"}}>MANAGE</button>
            </div>
          </div>

          {/* Codex */}
          <div style={{padding:"0 16px 12px"}}>
            <div onClick={()=>setShowCodex(true)} style={{
              background:"#0A0A0A",
              border:`1px solid ${GOLD}33`,
              borderLeft:`3px solid ${GOLD}`,
              padding:"14px 16px",
              display:"flex",alignItems:"center",justifyContent:"space-between",
              cursor:"pointer",
            }}>
              <div>
                <div style={{fontSize:"11px",color:GOLD,fontFamily:"monospace",letterSpacing:"3px",marginBottom:3}}>CODEX</div>
                <div style={{fontSize:"8px",color:"#444",fontFamily:"monospace",letterSpacing:"1px"}}>Everything you need to know.</div>
              </div>
              <span style={{fontSize:"16px",color:GOLD,opacity:0.6}}>›</span>
            </div>
          </div>

          {/* Settings */}
          <div style={{padding:"0 16px 32px"}}>
            <div style={{fontSize:"9px",color:"#222",letterSpacing:"3px",fontFamily:"monospace",marginBottom:10}}>SETTINGS</div>
            {["NOTIFICATION PREFERENCES","SUBSCRIPTION MANAGE","PAYMENT METHOD","TERMS + PRIVACY","CONTACT SKOLD"].map(item=>(
              <div key={item} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid #0A0A0A",cursor:"pointer"}}>
                <span style={{fontSize:"10px",color:"#333",fontFamily:"monospace",letterSpacing:"1px"}}>{item}</span>
                <span style={{fontSize:"10px",color:"#1A1A1A"}}>›</span>
              </div>
            ))}
            <div style={{marginTop:20,textAlign:"center",fontSize:"9px",color:"#1E1E1E",fontFamily:"monospace",letterSpacing:"2px",cursor:"pointer",padding:"10px 0"}}>SIGN OUT</div>
          </div>
        </div>
      )}

      {/* ── ORDERS SECTION ── */}
      {section==="ORDERS"&&(
        <div>
          <div style={{padding:"8px 16px",borderBottom:"1px solid #0A0A0A",display:"flex",justifyContent:"space-between"}}>
            <span style={{fontSize:"8px",color:"#2A2A2A",letterSpacing:"2px",fontFamily:"monospace"}}>{MOCK_ORDERS.length} ORDERS</span>
            <span style={{fontSize:"8px",color:"#1A1A1A",letterSpacing:"1px",fontFamily:"monospace"}}>NEW ORDERS FLAGGED</span>
          </div>
          {MOCK_ORDERS.map(order=>(
            <div key={order.id} style={{
              background:"#0A0A0A",
              border:`1px solid ${order.new?"#1A3A1A":"#111"}`,
              borderLeft:`2px solid ${order.status==="DELIVERED"?"#2A2A2A":order.status==="IN TRANSIT"?"#2A5A2A":"#D4A017"}`,
              padding:"14px 16px",marginBottom:1,position:"relative",
            }}>
              {order.new&&<div style={{position:"absolute",top:10,right:12,width:6,height:6,borderRadius:"50%",background:"#7A1A1A"}}/>}
              <div style={{fontSize:"11px",color:"#E8E8E0",fontFamily:"monospace",letterSpacing:"1px",marginBottom:4}}>{order.item}</div>
              <div style={{display:"flex",gap:16,marginBottom:6,fontFamily:"monospace",fontSize:"8px",color:"#444"}}>
                <span>{order.id}</span>
                <span>{order.date}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{
                  fontSize:"8px",letterSpacing:"2px",fontFamily:"monospace",
                  color:order.status==="DELIVERED"?"#444":order.status==="IN TRANSIT"?"#3A7A3A":"#D4A017",
                }}>
                  {order.status}{order.eta?` — ETA ${order.eta}`:""}
                </span>
                {order.tracking&&(
                  <button style={{padding:"4px 10px",background:"transparent",border:"1px solid #1A1A1A",color:"#333",fontFamily:"monospace",fontSize:"8px",letterSpacing:"1px",cursor:"pointer"}}>TRACK</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── NOTIFICATIONS SECTION ── */}
      {section==="NOTIFICATIONS"&&(
        <div>
          <div style={{padding:"8px 16px",borderBottom:"1px solid #0A0A0A",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:"8px",color:"#2A2A2A",letterSpacing:"2px",fontFamily:"monospace"}}>{unread} UNREAD</span>
            {unread>0&&<button onClick={markAllRead} style={{padding:"3px 10px",background:"transparent",border:"1px solid #1A1A1A",color:"#333",fontFamily:"monospace",fontSize:"8px",letterSpacing:"1px",cursor:"pointer"}}>MARK ALL READ</button>}
          </div>
          {notifs.map(n=>(
            <div key={n.id} style={{
              padding:"12px 16px",borderBottom:"1px solid #0A0A0A",
              background:n.read?"transparent":"#0A0A0A",
              borderLeft:`2px solid ${n.read?"transparent":n.color}`,
              display:"flex",gap:12,alignItems:"flex-start",
            }}>
              {!n.read&&<div style={{width:5,height:5,borderRadius:"50%",background:n.color,flexShrink:0,marginTop:4,boxShadow:`0 0 5px ${n.color}`}}/>}
              {n.read&&<div style={{width:5,flexShrink:0}}/>}
              <div style={{flex:1}}>
                <div style={{fontSize:"10px",color:n.read?"#555":"#E8E8E0",fontFamily:"monospace",letterSpacing:"0.5px",lineHeight:1.5,marginBottom:3}}>{n.message}</div>
                <div style={{fontSize:"8px",color:"#2A2A2A",fontFamily:"monospace",letterSpacing:"1px",display:"flex",gap:8}}>
                  <span>{n.type}</span><span>{n.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {showCodex&&<Codex onClose={()=>setShowCodex(false)}/>}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// BOTTOM NAV — 5 tabs: HOME SIGNAL SKOCIAL STORE ME
// ═══════════════════════════════════════════════════════════════════════════════
const NAV_TABS=[
  { id:"home",    label:"HOME",    icon:"◈" },
  { id:"signal",  label:"SIGNAL",  icon:"◉" },
  { id:"skocial", label:"SKOCIAL", icon:"◎" },
  { id:"store",   label:"STORE",   icon:"◧" },
  { id:"me",      label:"ME",      icon:"◫" },
];

function BottomNav({ active, setActive, notifCount=0 }) {
  return (
    <div style={{
      position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",
      width:"100%",maxWidth:440,
      background:"#060606",borderTop:"1px solid #111",
      display:"flex",justifyContent:"space-around",
      padding:"10px 0 18px",zIndex:50,
    }}>
      {NAV_TABS.map(tab=>(
        <button key={tab.id} onClick={()=>setActive(tab.id)} style={{
          background:"none",border:"none",
          display:"flex",flexDirection:"column",
          alignItems:"center",gap:3,cursor:"pointer",
          padding:"0 8px",position:"relative",
        }}>
          <span style={{fontSize:"16px",color:active===tab.id?"#E8E8E0":"#2A2A2A",transition:"color 0.2s ease"}}>{tab.icon}</span>
          <span style={{fontSize:"7px",letterSpacing:"1.5px",color:active===tab.id?"#E8E8E0":"#1E1E1E",fontFamily:"monospace",transition:"color 0.2s ease"}}>{tab.label}</span>
          {active===tab.id&&<div style={{width:4,height:1,background:"#E8E8E0",marginTop:1}}/>}
          {tab.id==="me"&&notifCount>0&&(
            <div style={{position:"absolute",top:0,right:4,width:6,height:6,borderRadius:"50%",background:"#7A1A1A"}}/>
          )}
        </button>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHROME STAR SVG
// ═══════════════════════════════════════════════════════════════════════════════
function FoundingGate({ onValid }) {
  const [value, setValue]   = useState("");
  const [error, setError]   = useState("");
  const [checking, setChecking] = useState(false);
  const [starIn, setStarIn] = useState(false);

  useEffect(() => { setTimeout(() => setStarIn(true), 300); }, []);

  const check = () => {
    if (!value.trim()) { setError("Enter your founding number."); return; }
    setChecking(true);
    setError("");
    setTimeout(() => {
      setChecking(false);
      if (VALID_NUMBERS.includes(value.trim().padStart(4,"0"))) {
        onValid(value.trim().padStart(4,"0"));
      } else {
        setError("That number is not recognised. Try again.");
      }
    }, 900);
  };

  const inp = {
    width:"100%", padding:"14px 16px",
    background:"transparent",
    border:"none", borderBottom:"1px solid #2A2A2A",
    color:"#E8E8E0", fontFamily:"monospace",
    fontSize:"28px", letterSpacing:"10px",
    outline:"none", textAlign:"center",
    caretColor: GOLD,
  };

  return (
    <div style={{
      background:BG, minHeight:"100vh",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      padding:"40px 32px", fontFamily:"monospace",
      position:"relative",
    }}>
      <CRTOverlay/>
      <div style={{
        position:"fixed", top:0, left:0, right:0, height:1,
        background:`linear-gradient(to right,transparent,${GOLD}22,transparent)`,
        animation:"scanBeam 5s linear infinite",
        pointerEvents:"none", zIndex:9997,
      }}/>

      {/* Star */}
      <div style={{
        marginBottom:40,
        opacity: starIn ? 1 : 0,
        transform: starIn ? "scale(1)" : "scale(0.85)",
        transition:"all 0.8s ease",
      }}>
        <ChromeStar size={110} pulse={starIn}/>
      </div>

      {/* Gate copy */}
      <div style={{
        textAlign:"center", marginBottom:36,
        opacity: starIn ? 1 : 0,
        transition:"opacity 0.8s ease 0.4s",
      }}>
        <div style={{fontSize:"9px",color:"#333",letterSpacing:"4px",marginBottom:12}}>
          MEMBERSHIP ONLY
        </div>
        <div style={{fontSize:"12px",color:"#666",letterSpacing:"0.5px",lineHeight:1.7,maxWidth:240}}>
          Enter your founding number.<br/>It came with the vessel.
        </div>
      </div>

      {/* Input */}
      <div style={{width:"100%",maxWidth:280,marginBottom:8}}>
        <input
          style={inp}
          type="text"
          maxLength={4}
          placeholder="0000"
          value={value}
          onChange={e=>setValue(e.target.value.replace(/\D/g,""))}
          onKeyDown={e=>e.key==="Enter"&&check()}
        />
      </div>

      {/* Error */}
      <div style={{
        height:20, marginBottom:24,
        fontSize:"9px", color:"#7A1A1A",
        letterSpacing:"1px", textAlign:"center",
        transition:"opacity 0.3s",
        opacity: error ? 1 : 0,
      }}>
        {error || " "}
      </div>

      {/* Confirm */}
      <button onClick={check} disabled={checking} style={{
        padding:"12px 40px",
        background:"transparent",
        border:`1px solid ${checking?"#2A2A2A":"#444"}`,
        color: checking ? "#333" : "#888",
        fontFamily:"monospace", fontSize:"10px",
        letterSpacing:"4px", cursor: checking ? "default" : "pointer",
        transition:"all 0.2s ease",
        minWidth:160,
      }}
      onMouseEnter={e=>{if(!checking){e.currentTarget.style.borderColor=GOLD;e.currentTarget.style.color=GOLD;}}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor="#444";e.currentTarget.style.color="#888";}}>
        {checking ? "CHECKING..." : "CONFIRM"}
      </button>

      <div style={{
        position:"absolute", bottom:32,
        fontSize:"8px", color:"#1A1A1A",
        letterSpacing:"2px", textAlign:"center",
      }}>
        SKOLD — MEMBERSHIP ONLY
      </div>

      <style>{`
        @keyframes scanBeam{0%{top:-1px}100%{top:100vh}}
        input::placeholder{color:#1E1E1E;letter-spacing:6px}
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// REGISTRATION — DETAILS FORM
// ═══════════════════════════════════════════════════════════════════════════════
function DetailsForm({ foundingNumber, onComplete }) {
  const [fields, setFields] = useState({
    firstName:"", handle:"", email:"", password:"", dob:"",
  });
  const [errors, setErrors]   = useState({});
  const [showPass, setShowPass] = useState(false);
  const [step, setStep]       = useState(0); // 0=identity, 1=access

  const set = (k,v) => setFields(f=>({...f,[k]:v}));

  const validate0 = () => {
    const e={};
    if (!fields.firstName.trim()) e.firstName="Required.";
    if (!fields.handle.trim()) e.handle="Required.";
    else if (fields.handle.includes(" ")) e.handle="No spaces. Handles are one word.";
    if (Object.keys(e).length) { setErrors(e); return false; }
    setErrors({}); return true;
  };

  const validate1 = () => {
    const e={};
    if (!fields.email.includes("@")) e.email="Valid email required.";
    if (fields.password.length < 8) e.password="Minimum 8 characters.";
    if (!fields.dob) e.dob="Required.";
    else {
      const age = (new Date() - new Date(fields.dob)) / (1000*60*60*24*365.25);
      if (age < 18) e.dob="Must be 18 or older.";
    }
    if (Object.keys(e).length) { setErrors(e); return false; }
    setErrors({}); return true;
  };

  const next = () => { if (validate0()) setStep(1); };
  const submit = () => {
    if (validate1()) onComplete({ ...fields, foundingNumber });
  };

  const inpStyle = (key) => ({
    width:"100%", padding:"12px 14px",
    background:"#0A0A0A",
    border:`1px solid ${errors[key]?"#7A1A1A":"#1E1E1E"}`,
    borderLeft:`2px solid ${errors[key]?"#7A1A1A":"#2A2A2A"}`,
    color:"#E8E8E0", fontFamily:"monospace",
    fontSize:"13px", letterSpacing:"1px",
    outline:"none", boxSizing:"border-box",
    transition:"border-color 0.2s",
  });

  const labelStyle = {
    fontSize:"8px", color:"#444",
    letterSpacing:"3px", display:"block",
    marginBottom:6, fontFamily:"monospace",
  };

  const errStyle = {
    fontSize:"8px", color:"#7A1A1A",
    letterSpacing:"1px", marginTop:4,
    fontFamily:"monospace", minHeight:14,
  };

  return (
    <div style={{
      background:BG, minHeight:"100vh",
      display:"flex", flexDirection:"column",
      fontFamily:"monospace", position:"relative",
    }}>
      <CRTOverlay/>

      {/* Header */}
      <div style={{
        padding:"20px 20px 16px",
        borderBottom:"1px solid #111",
        display:"flex", alignItems:"center", gap:14,
      }}>
        <ChromeStar size={28}/>
        <div>
          <div style={{fontSize:"11px",letterSpacing:"3px",color:"#E8E8E0"}}>CREATE ACCOUNT</div>
          <div style={{fontSize:"8px",color:"#333",letterSpacing:"2px",marginTop:2}}>
            FOUNDING MEMBER #{foundingNumber}
          </div>
        </div>
        {/* Step dots */}
        <div style={{marginLeft:"auto",display:"flex",gap:6,alignItems:"center"}}>
          {[0,1].map(i=>(
            <div key={i} style={{
              width: step===i ? 14 : 5, height:2,
              background: i<=step ? "#E8E8E0" : "#222",
              transition:"all 0.3s ease",
            }}/>
          ))}
        </div>
      </div>

      <div style={{flex:1, overflowY:"auto", padding:"28px 20px"}}>

        {step === 0 && (
          <div style={{animation:"fadeUp 0.4s ease"}}>
            <div style={{
              fontSize:"9px", color:"#333", letterSpacing:"3px",
              marginBottom:28,
            }}>
              WHO ARE YOU
            </div>

            <div style={{marginBottom:20}}>
              <label style={labelStyle}>FIRST NAME</label>
              <input style={inpStyle("firstName")} placeholder="First name only"
                value={fields.firstName} onChange={e=>set("firstName",e.target.value)}/>
              <div style={errStyle}>{errors.firstName}</div>
            </div>

            <div style={{marginBottom:20}}>
              <label style={labelStyle}>HANDLE</label>
              <input style={inpStyle("handle")} placeholder="What the crew calls you"
                value={fields.handle} onChange={e=>set("handle",e.target.value.toUpperCase())}/>
              <div style={{...errStyle, color: errors.handle?"#7A1A1A":"#2A2A2A"}}>
                {errors.handle || "This is your identity in the app. Choose carefully."}
              </div>
            </div>

            <div style={{
              background:"#0A0A0A", border:"1px solid #111",
              borderLeft:`2px solid ${GOLD}33`,
              padding:"12px 14px", marginTop:8,
            }}>
              <div style={{fontSize:"8px",color:"#444",letterSpacing:"1px",lineHeight:1.8}}>
                Your real name is never shown in the app.<br/>
                Your handle is what Skolds see on the board,<br/>
                in Skocial, and on your profile.
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div style={{animation:"fadeUp 0.4s ease"}}>
            <div style={{
              fontSize:"9px", color:"#333", letterSpacing:"3px",
              marginBottom:28,
            }}>
              ACCESS
            </div>

            <div style={{marginBottom:20}}>
              <label style={labelStyle}>EMAIL</label>
              <input style={inpStyle("email")} type="email" placeholder="your@email.com"
                value={fields.email} onChange={e=>set("email",e.target.value)}/>
              <div style={errStyle}>{errors.email}</div>
            </div>

            <div style={{marginBottom:20, position:"relative"}}>
              <label style={labelStyle}>PASSWORD</label>
              <input style={inpStyle("password")} type={showPass?"text":"password"}
                placeholder="Min. 8 characters"
                value={fields.password} onChange={e=>set("password",e.target.value)}/>
              <button onClick={()=>setShowPass(s=>!s)} style={{
                position:"absolute", right:12, top:26,
                background:"none", border:"none", color:"#333",
                fontFamily:"monospace", fontSize:"8px",
                letterSpacing:"1px", cursor:"pointer",
              }}>{showPass?"HIDE":"SHOW"}</button>
              <div style={errStyle}>{errors.password}</div>
            </div>

            <div style={{marginBottom:20}}>
              <label style={labelStyle}>DATE OF BIRTH</label>
              <input style={{...inpStyle("dob"), colorScheme:"dark"}} type="date"
                value={fields.dob} onChange={e=>set("dob",e.target.value)}/>
              <div style={{...errStyle, color: errors.dob?"#7A1A1A":"#2A2A2A"}}>
                {errors.dob || "Must be 18 or older."}
              </div>
            </div>

            <div style={{
              fontSize:"8px", color:"#1A1A1A",
              lineHeight:1.8, letterSpacing:"0.5px", marginTop:12,
            }}>
              BY CONTINUING YOU AGREE TO SKOLD TERMS OF SERVICE AND PRIVACY POLICY.
              SKOLD KASH HAS NO CASH VALUE AND CANNOT BE WITHDRAWN OR CONVERTED TO AUD.
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div style={{padding:"16px 20px 28px", borderTop:"1px solid #111"}}>
        {step === 0 ? (
          <button onClick={next} style={{
            width:"100%", padding:14,
            background:"#E8E8E0", border:"none",
            color:"#080808", fontFamily:"monospace",
            fontSize:"11px", letterSpacing:"3px",
            cursor:"pointer",
          }}>
            CONTINUE
          </button>
        ) : (
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setStep(0)} style={{
              width:48, padding:14,
              background:"transparent", border:"1px solid #1E1E1E",
              color:"#444", fontFamily:"monospace",
              fontSize:"14px", cursor:"pointer",
            }}>←</button>
            <button onClick={submit} style={{
              flex:1, padding:14,
              background:"#E8E8E0", border:"none",
              color:"#080808", fontFamily:"monospace",
              fontSize:"11px", letterSpacing:"3px",
              cursor:"pointer",
            }}>
              JOIN SKOLD
            </button>
          </div>
        )}
      </div>

      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// SIGNAL TAB — inline lightweight version
// ═══════════════════════════════════════════════════════════════════════════════
const NEARBY_FACES=[
  {id:1,handle:"ACE",     crew:"GRIM",rank:3,distance:180, status:"ACTIVE",tagOn:true, avatar:"A",activity:"LIFT"},
  {id:2,handle:"GHOST_44",crew:"GRIM",rank:1,distance:340, status:"ACTIVE",tagOn:true, avatar:"G",activity:"RUN"},
  {id:3,handle:"MIRA_F",  crew:"FIRM",rank:1,distance:620, status:"IDLE",  tagOn:false,avatar:"M",activity:null},
  {id:4,handle:"ROLLO",   crew:"MOD", rank:1,distance:890, status:"ACTIVE",tagOn:true, avatar:"R",activity:"YOGA"},
  {id:5,handle:"VALE",    crew:"MOD", rank:2,distance:1200,status:"IDLE",  tagOn:true, avatar:"V",activity:null},
];

// ── Signal: Face Action Sheet (proper component, no hooks violation) ──────────
function SignalFaceSheet({ face, tagOn, tagActive, onAction, onChallenge, onClose }) {
  const fc = CREWS[face.crew];
  const actions = [
    {id:"join",      label:"JOIN SESSION",  sub:face.activity?`${face.activity} — tap to join`:null, avail:!!face.activity},
    {id:"challenge", label:"CHALLENGE",     sub:"First to 15. Kash locked.",                        avail:true},
    {id:"spot",      label:"SPOT ME",       sub:"One tap request. Private.",                        avail:face.status==="ACTIVE"},
    {id:"tag",       label:"TAG",           sub:"Pass it on.",                                     avail:tagOn&&tagActive&&face.tagOn},
  ];
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:200,display:"flex",alignItems:"flex-end"}} onClick={onClose}>
      <div style={{width:"100%",maxWidth:440,margin:"0 auto",background:"#0A0A0A",border:`1px solid ${fc.color}44`,borderTop:`2px solid ${fc.color}`,padding:"20px 20px 36px",fontFamily:"monospace",animation:"sheetUp 0.25s ease"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18}}>
          <div style={{width:40,height:40,borderRadius:"50%",background:fc.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px",fontWeight:"bold",color:"#E8E8E0"}}>{face.avatar}</div>
          <div>
            <div style={{fontSize:"14px",color:"#E8E8E0",letterSpacing:"2px"}}>{face.handle}</div>
            <div style={{display:"flex",gap:8,marginTop:3}}>
              <span style={{fontSize:"8px",color:fc.text,border:`1px solid ${fc.color}`,padding:"1px 6px",letterSpacing:"2px"}}>{fc.label}</span>
              <span style={{fontSize:"8px",color:"#333",letterSpacing:"1px"}}>{face.distance}M AWAY</span>
            </div>
          </div>
          {face.status==="ACTIVE"&&<div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:5}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:"#2A5A2A",boxShadow:"0 0 6px #2A5A2A"}}/>
            <span style={{fontSize:"8px",color:"#2A5A2A",letterSpacing:"1px",fontFamily:"monospace"}}>ACTIVE</span>
          </div>}
        </div>
        {actions.map(a=>(
          <button key={a.id}
            onClick={()=>{
              if(!a.avail)return;
              if(a.id==="challenge"){onChallenge(face);return;}
              onAction(face,a.id);
            }}
            style={{width:"100%",padding:"13px 16px",textAlign:"left",background:"transparent",border:`1px solid ${a.id==="tag"&&a.avail?GOLD+"44":a.avail?"#1E1E1E":"#0F0F0F"}`,borderLeft:`2px solid ${a.id==="tag"&&a.avail?GOLD:a.avail?fc.color:"#0F0F0F"}`,opacity:a.avail?1:0.3,cursor:a.avail?"pointer":"default",marginBottom:6}}
          >
            <div style={{fontSize:"10px",letterSpacing:"2px",color:a.id==="tag"&&a.avail?GOLD:a.avail?"#E8E8E0":"#333",fontFamily:"monospace"}}>{a.label}</div>
            {a.sub&&<div style={{fontSize:"8px",color:"#444",letterSpacing:"0.5px",marginTop:3,fontFamily:"monospace"}}>{a.sub}</div>}
          </button>
        ))}
        <button onClick={onClose} style={{width:"100%",marginTop:8,padding:"10px 0",background:"transparent",border:"1px solid #111",color:"#333",fontFamily:"monospace",fontSize:"10px",letterSpacing:"3px",cursor:"pointer"}}>CLOSE</button>
      </div>
      <style>{`@keyframes sheetUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
    </div>
  );
}

// ── Signal: Challenge Modal (proper component, no hooks violation) ─────────────
function SignalChallengeModal({ face, onClose, onConfirm }) {
  const fc = CREWS[face.crew];
  const [target, setTarget] = useState(15);
  const [metric, setMetric] = useState("REPS");
  const [stake, setStake]   = useState(100);
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.93)",zIndex:250,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={onClose}>
      <div style={{background:"#0A0A0A",border:`1px solid ${fc.color}`,padding:24,width:"100%",maxWidth:340,fontFamily:"monospace"}} onClick={e=>e.stopPropagation()}>
        <div style={{fontSize:"9px",color:"#444",letterSpacing:"3px",marginBottom:4}}>CHALLENGE</div>
        <div style={{fontSize:"15px",color:"#E8E8E0",letterSpacing:"2px",marginBottom:18}}>{face.handle}</div>
        <div style={{fontSize:"9px",color:"#333",letterSpacing:"2px",marginBottom:8}}>METRIC</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>
          {["REPS","ROUNDS","KM","MINUTES","FLOORS","SETS"].map(m=>(
            <button key={m} onClick={()=>setMetric(m)} style={{padding:"6px 10px",background:metric===m?"#E8E8E0":"transparent",border:`1px solid ${metric===m?"#E8E8E0":"#222"}`,color:metric===m?"#080808":"#555",fontFamily:"monospace",fontSize:"9px",letterSpacing:"2px",cursor:"pointer"}}>{m}</button>
          ))}
        </div>
        <div style={{fontSize:"9px",color:"#333",letterSpacing:"2px",marginBottom:6}}>TARGET — {target}</div>
        <input type="range" min={5} max={50} value={target} onChange={e=>setTarget(Number(e.target.value))} style={{width:"100%",accentColor:"#E8E8E0",marginBottom:16}}/>
        <div style={{fontSize:"9px",color:"#333",letterSpacing:"2px",marginBottom:8}}>KASH STAKE</div>
        <div style={{display:"flex",gap:6,marginBottom:16}}>
          {[50,100,200,500].map(v=>(
            <button key={v} onClick={()=>setStake(v)} style={{flex:1,padding:"8px 4px",background:stake===v?fc.color:"transparent",border:`1px solid ${stake===v?fc.color:"#222"}`,color:stake===v?"#E8E8E0":"#555",fontFamily:"monospace",fontSize:"10px",cursor:"pointer"}}>{v}K</button>
          ))}
        </div>
        <div style={{background:"#0F0F0F",border:"1px solid #111",padding:"10px 12px",marginBottom:14,fontSize:"11px",color:"#E8E8E0",letterSpacing:"1px",textAlign:"center",fontFamily:"monospace"}}>FIRST TO {target} {metric}</div>
        <div style={{fontSize:"8px",color:"#222",lineHeight:1.8,marginBottom:14,letterSpacing:"0.5px"}}>KASH LOCKED UNTIL RESULT. HONOUR SYSTEM. GAME OF SKILL. NOT LUCK.</div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={onClose} style={{flex:1,padding:10,background:"transparent",border:"1px solid #222",color:"#444",fontFamily:"monospace",fontSize:"10px",cursor:"pointer",letterSpacing:"2px"}}>CANCEL</button>
          <button onClick={()=>onConfirm(face,{target,metric,stake})} style={{flex:2,padding:10,background:fc.color,border:"none",color:"#E8E8E0",fontFamily:"monospace",fontSize:"10px",cursor:"pointer",letterSpacing:"2px",fontWeight:"bold"}}>SEND CHALLENGE</button>
        </div>
      </div>
    </div>
  );
}


function SignalTab({ member, kash, setKash, onFirstTag, onFirstWagerWin }) {
  const [showFirstVisit,setShowFirstVisit]=useState(!VISITED.signal);
  const [showGuide,setShowGuide]=useState(false);
  const dismissFirstVisit=()=>{ VISITED.signal=true; setShowFirstVisit(false); };
  const c=CREWS[member.crew];
  const [liveStatus,setLiveStatus]=useState(false);
  const [tagOn,setTagOn]=useState(false);
  const [isIt,setIsIt]=useState(false);
  const [tagActive]=useState(true);
  const [faces]=useState(NEARBY_FACES);
  const [selectedFace,setSelectedFace]=useState(null);
  const [toast,setToast]=useState(null);
  const [liveChallenge,setLiveChallenge]=useState(null);
  const [challengeTarget,setChallengeTarget]=useState(null);
  const [view,setView]=useState("RADAR");

  const showToast=(msg,sub,col)=>{ setToast({msg,sub,col}); setTimeout(()=>setToast(null),3200); };

  useEffect(()=>{
    if(tagOn&&tagActive){
      const t=setTimeout(()=>{ setIsIt(true); showToast("You've been tagged. Rook the Grim is watching.",null,"#7A1A1A"); if(onFirstTag) onFirstTag(); },9000);
      return ()=>clearTimeout(t);
    }
  },[tagOn]);

  const handleAction=(face,action)=>{
    setSelectedFace(null);
    if(action==="join") showToast(`Joined ${face.handle}'s session.`,`${face.activity} — show up.`,CREWS[face.crew].color);
    if(action==="challenge") setChallengeTarget(face);
    if(action==="spot") showToast("Someone asked for a spot. You were there. That counts.",`${face.handle} — nearby`,CREWS[face.crew].color);
    if(action==="tag"){ setIsIt(false); showToast("Clean.",`${face.handle} is it.`,GOLD); }
  };

  const size=240,cx=120,cy=120,maxD=1500;
  const getPos=(f)=>{
    const a=(f.id*137.5%360)*Math.PI/180;
    const r=(f.distance/maxD)*(size/2-22);
    return[cx+r*Math.cos(a),cy+r*Math.sin(a)];
  };

  return (
    <div style={{paddingBottom:80}}>
      <div style={{padding:"16px 20px",borderBottom:"1px solid #0F0F0F",background:BG,position:"sticky",top:0,zIndex:10,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontSize:"18px",letterSpacing:"4px",fontWeight:"bold",color:"#E8E8E0",fontFamily:"monospace"}}>SIGNAL</div>
          <div style={{fontSize:"9px",color:"#333",letterSpacing:"2px",marginTop:1,fontFamily:"monospace"}}>SKOLD SIGNAL</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:5,background:"#0A0A0A",border:"1px solid #1A3A1A",padding:"4px 10px"}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:"#2A5A2A",boxShadow:"0 0 5px #2A5A2A",animation:"pulse 2s infinite"}}/>
            <span style={{fontSize:"9px",color:"#2A5A2A",letterSpacing:"1px",fontFamily:"monospace"}}>{faces.filter(f=>f.status==="ACTIVE").length} ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Rook line */}
      <div style={{padding:"10px 16px",borderBottom:"1px solid #0F0F0F",display:"flex",alignItems:"center",gap:10,minHeight:40}}>
        <span style={{fontSize:"8px",color:GOLD,letterSpacing:"2px",flexShrink:0,fontFamily:"monospace"}}>ROOK //</span>
        <span style={{fontSize:"11px",color:"#555",lineHeight:1.5,letterSpacing:"0.5px",fontFamily:"monospace"}}>
          {isIt?"Still it. That's embarrassing.":tagActive?"Tag is live. Rook the Grim does not play games. This is not a game.":"Signal is live. Someone near you is moving. Pay attention."}
        </span>
      </div>

      {/* Tag banner */}
      {tagActive&&(
        <div style={{padding:"10px 16px",background:"#0A0A08",borderBottom:`1px solid ${GOLD}33`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:"9px",color:GOLD,letterSpacing:"3px",fontFamily:"monospace",marginBottom:2}}>◆ SKOLD TAG — LIVE</div>
            <div style={{fontSize:"8px",color:"#444",letterSpacing:"1px",fontFamily:"monospace"}}>47H 22M REMAINING</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {isIt&&<span style={{fontSize:"8px",color:"#FF6B6B",letterSpacing:"2px",fontFamily:"monospace",animation:"pulse 1s infinite"}}>YOU'RE IT</span>}
            <div onClick={()=>setTagOn(s=>!s)} style={{width:36,height:20,background:tagOn?GOLD:"#1A1A1A",borderRadius:10,position:"relative",cursor:"pointer",transition:"background 0.2s"}}>
              <div style={{position:"absolute",top:2,width:16,height:16,borderRadius:"50%",background:"#0A0A0A",left:tagOn?18:2,transition:"left 0.2s"}}/>
            </div>
          </div>
        </div>
      )}

      {/* Controls row */}
      <div style={{padding:"10px 16px",borderBottom:"1px solid #0A0A0A",display:"flex",alignItems:"center",justifyContent:"space-between",background:liveStatus?"#0A0C0A":"transparent"}}>
        <div>
          <div style={{fontSize:"10px",color:liveStatus?"#3A7A3A":"#444",letterSpacing:"2px",fontFamily:"monospace"}}>LIVE STATUS</div>
          <div style={{fontSize:"8px",color:"#222",letterSpacing:"1px",fontFamily:"monospace",marginTop:2}}>{liveStatus?"NEARBY FACES CAN SEE YOU":"OFF — YOU ARE INVISIBLE"}</div>
        </div>
        <div onClick={()=>setLiveStatus(s=>!s)} style={{width:36,height:20,background:liveStatus?"#2A5A2A":"#1A1A1A",borderRadius:10,position:"relative",cursor:"pointer",transition:"background 0.2s"}}>
          <div style={{position:"absolute",top:2,width:16,height:16,borderRadius:"50%",background:"#0A0A0A",left:liveStatus?18:2,transition:"left 0.2s"}}/>
        </div>
      </div>

      {/* Live challenge */}
      {liveChallenge&&(
        <div style={{background:"#0A0A08",border:`1px solid ${GOLD}44`,borderLeft:`3px solid ${GOLD}`,padding:"14px 16px",marginBottom:1}}>
          <div style={{fontSize:"9px",color:GOLD,letterSpacing:"3px",fontFamily:"monospace",marginBottom:6}}>◆ LIVE CHALLENGE — FIRST TO {liveChallenge.target} {liveChallenge.metric}</div>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10}}>
            <div style={{flex:1,textAlign:"center"}}>
              <div style={{fontSize:"8px",color:"#444",fontFamily:"monospace",marginBottom:3}}>YOU</div>
              <div style={{fontSize:"32px",color:"#E8E8E0",fontFamily:"monospace",fontWeight:"bold"}}>{liveChallenge.myScore}</div>
            </div>
            <div style={{fontSize:"16px",color:"#222",fontFamily:"monospace"}}>vs</div>
            <div style={{flex:1,textAlign:"center"}}>
              <div style={{fontSize:"8px",color:"#444",fontFamily:"monospace",marginBottom:3}}>{liveChallenge.face.handle}</div>
              <div style={{fontSize:"32px",color:CREWS[liveChallenge.face.crew].text,fontFamily:"monospace",fontWeight:"bold"}}>{liveChallenge.theirScore}</div>
            </div>
          </div>
          <button onClick={()=>{
            setLiveChallenge(prev=>{
              const mine=prev.myScore+1;
              const theirs=prev.theirScore+(Math.random()>0.55?1:0);
              if(mine>=prev.target){showToast("You win.",`${prev.stake}K released.`,GOLD);return null;}
              if(theirs>=prev.target){showToast(`${prev.face.handle} wins.`,`${prev.stake}K gone.`,"#7A1A1A");return null;}
              return{...prev,myScore:mine,theirScore:theirs};
            });
          }} style={{width:"100%",padding:"10px 0",background:"#E8E8E0",border:"none",color:"#080808",fontFamily:"monospace",fontSize:"11px",letterSpacing:"2px",cursor:"pointer",fontWeight:"bold"}}>
            +1
          </button>
        </div>
      )}

      {/* View toggle */}
      <div style={{display:"flex",borderBottom:"1px solid #111"}}>
        {["RADAR","FACES"].map(v=>(
          <button key={v} onClick={()=>setView(v)} style={{flex:1,padding:"10px 0",background:"transparent",border:"none",borderBottom:view===v?"2px solid #E8E8E0":"2px solid transparent",color:view===v?"#E8E8E0":"#333",fontFamily:"monospace",fontSize:"10px",letterSpacing:"3px",cursor:"pointer"}}>{v}</button>
        ))}
      </div>

      {/* Radar */}
      {view==="RADAR"&&(
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"28px 20px"}}>
          <div style={{position:"relative",width:size,height:size,display:"flex",alignItems:"center",justifyContent:"center"}}>
            {[0.33,0.66,1].map((r,i)=><div key={i} style={{position:"absolute",width:size*r,height:size*r,borderRadius:"50%",border:`1px solid ${i===0?"#1A1A1A":"#111"}`}}/>)}
            <div style={{position:"absolute",width:"50%",height:1,background:`linear-gradient(to right,transparent,${c.color}44)`,transformOrigin:"left center",left:"50%",top:"50%",animation:"radarSweep 3s linear infinite",opacity:0.6}}/>
            {faces.map(f=>{
              const[x,y]=getPos(f);const fc=CREWS[f.crew];const act=f.status==="ACTIVE";
              return <div key={f.id} onClick={()=>setSelectedFace(f)} style={{position:"absolute",left:x-6,top:y-6,width:12,height:12,borderRadius:"50%",background:act?fc.color:"#1A1A1A",border:`1px solid ${act?fc.text:"#333"}`,boxShadow:act?`0 0 8px ${fc.color}66`:"none",cursor:"pointer",zIndex:2,animation:act?"blipPulse 1.8s ease-in-out infinite":"none"}}/>;
            })}
            <div style={{position:"absolute",width:16,height:16,borderRadius:"50%",background:isIt?"#7A1A1A":c.color,border:`2px solid ${isIt?"#FF6B6B":"#E8E8E0"}`,boxShadow:isIt?"0 0 16px #7A1A1A":`0 0 10px ${c.color}66`,zIndex:3}}/>
            {tagOn&&tagActive&&[240,180,120].map((s,i)=><div key={s} style={{position:"absolute",width:s,height:s,borderRadius:"50%",border:`1px solid ${GOLD}`,animation:`pulseRing 2.4s ease-out ${i*0.6}s infinite`,pointerEvents:"none"}}/>)}
          </div>
          <div style={{display:"flex",gap:14,marginTop:18,fontFamily:"monospace",fontSize:"8px",color:"#2A2A2A",letterSpacing:"1px"}}>
            {Object.entries(CREWS).map(([k,v])=><span key={k} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:7,height:7,borderRadius:"50%",background:v.color,border:k==="GRIM"?"1px solid #444":"none"}}/>{v.label.split(" ")[1]}</span>)}
            <span style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:7,height:7,borderRadius:"50%",background:c.color,border:"1px solid #E8E8E0"}}/>YOU</span>
          </div>
          <div style={{marginTop:10,fontSize:"8px",color:"#1A1A1A",letterSpacing:"1px",fontFamily:"monospace"}}>TAP A BLIP TO INTERACT</div>
          <style>{`@keyframes radarSweep{from{transform:rotate(0deg)}to{transform:rotate(360deg)}} @keyframes blipPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.6;transform:scale(0.85)}} @keyframes pulseRing{0%{transform:scale(0.6);opacity:0.2}100%{transform:scale(1.4);opacity:0}}`}</style>
        </div>
      )}

      {/* Faces list */}
      {view==="FACES"&&(
        <div>
          <div style={{padding:"8px 16px",borderBottom:"1px solid #0A0A0A"}}><span style={{fontSize:"8px",color:"#2A2A2A",letterSpacing:"2px",fontFamily:"monospace"}}>{faces.length} FACES IN RANGE — TAP TO INTERACT</span></div>
          {[...faces].sort((a,b)=>a.distance-b.distance).map(f=>{
            const fc=CREWS[f.crew];const act=f.status==="ACTIVE";
            return (
              <div key={f.id} onClick={()=>setSelectedFace(f)} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:"1px solid #0A0A0A",cursor:"pointer",borderLeft:`2px solid ${act?fc.color:"transparent"}`}}>
                <div style={{width:32,height:32,borderRadius:"50%",flexShrink:0,background:fc.color,border:`1px solid ${fc.text}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:"bold",color:"#E8E8E0",position:"relative"}}>
                  {f.avatar}
                  {act&&<div style={{position:"absolute",bottom:-1,right:-1,width:8,height:8,borderRadius:"50%",background:"#2A5A2A",border:"1px solid #080808"}}/>}
                </div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                    <span style={{fontSize:"11px",color:act?"#E8E8E0":"#555",letterSpacing:"1px",fontFamily:"monospace"}}>{f.handle}</span>
                    {f.activity&&<span style={{fontSize:"8px",color:fc.text,border:`1px solid ${fc.color}44`,padding:"1px 6px",letterSpacing:"1px",fontFamily:"monospace"}}>{f.activity}</span>}
                    {tagOn&&tagActive&&f.tagOn&&<span style={{fontSize:"8px",color:GOLD,fontFamily:"monospace"}}>◆</span>}
                  </div>
                  <div style={{fontSize:"8px",color:"#2A2A2A",letterSpacing:"1px",fontFamily:"monospace"}}>{fc.label} · {"★".repeat(f.rank)}</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:"12px",color:act?fc.text:"#333",fontFamily:"monospace",letterSpacing:"1px"}}>{f.distance}M</div>
                  <div style={{fontSize:"8px",color:"#222",fontFamily:"monospace"}}>{f.status}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Face action sheet */}
      {selectedFace&&<SignalFaceSheet
        face={selectedFace}
        tagOn={tagOn}
        tagActive={tagActive}
        onAction={handleAction}
        onChallenge={(f)=>{setSelectedFace(null);setChallengeTarget(f);}}
        onClose={()=>setSelectedFace(null)}
      />}

      {/* Challenge modal */}
      {challengeTarget&&<SignalChallengeModal
        face={challengeTarget}
        onClose={()=>setChallengeTarget(null)}
        onConfirm={(f,cfg)=>{
          setKash(k=>k-cfg.stake);
          setLiveChallenge({face:f,target:cfg.target,metric:cfg.metric,stake:cfg.stake,myScore:0,theirScore:0});
          setChallengeTarget(null);
          showToast(`Challenge sent to ${f.handle}.`,`First to ${cfg.target} ${cfg.metric}. ${cfg.stake}K locked.`,CREWS[f.crew].color);
        }}
      />}

      {/* Toast */}
      {toast&&(
        <div style={{position:"fixed",top:72,left:"50%",transform:"translateX(-50%)",zIndex:300,width:"calc(100% - 40px)",maxWidth:400,background:"#0A0A0A",border:`1px solid ${toast.col||GOLD}`,borderLeft:`3px solid ${toast.col||GOLD}`,padding:"12px 16px",fontFamily:"monospace",boxShadow:`0 0 24px ${toast.col||GOLD}22`,animation:"toastIn 3.2s ease forwards"}}>
          <div style={{fontSize:"9px",color:toast.col||GOLD,letterSpacing:"2px",marginBottom:3}}>ROOK //</div>
          <div style={{fontSize:"12px",color:"#E8E8E0",letterSpacing:"0.5px",lineHeight:1.5}}>{toast.msg}</div>
          {toast.sub&&<div style={{fontSize:"9px",color:"#444",letterSpacing:"1px",marginTop:4}}>{toast.sub}</div>}
          <style>{`@keyframes toastIn{0%{opacity:0;transform:translateX(-50%) translateY(-8px)}10%{opacity:1;transform:translateX(-50%) translateY(0)}80%{opacity:1}100%{opacity:0;transform:translateX(-50%) translateY(-4px)}}`}</style>
        </div>
      )}
      {showFirstVisit&&<FirstVisitCard tabKey="signal" onDismiss={dismissFirstVisit}/>}
      {showGuide&&<QuickGuide tabKey="signal" onClose={()=>setShowGuide(false)}/>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT APP — FINAL
// ═══════════════════════════════════════════════════════════════════════════════
export default function SKOLDApp() {
  const [stage,setStage]           = useState("gate");
  const [foundingNumber,setFoundingNumber] = useState(null);
  const [regData,setRegData]       = useState(null);
  const [activeTab,setActiveTab]   = useState("home");
  const [member,setMember]         = useState(INIT_MEMBER);
  const [starPoints,setStarPoints] = useState(INIT_STAR_POINTS);
  const [kash,setKash]             = useState(INIT_MEMBER.kashBalance);
  const [tabTransition,setTabTransition] = useState(true);
  const [contextMoment,setContextMoment] = useState(null);

  const fireContextMoment=(key)=>{
    if(VISITED[key])return;
    VISITED[key]=true;
    setContextMoment(key);
  };

  const switchTab=(tab)=>{
    setTabTransition(false);
    setTimeout(()=>{ setActiveTab(tab); setTabTransition(true); },80);
  };

  const handleFoundingValid=(num)=>{ setFoundingNumber(num); setStage("register"); };
  const handleRegComplete=(data)=>{ setRegData(data); setStage("initiation"); };
  const handleInitComplete=(crew)=>{
    setMember(m=>({
      ...m,
      handle:regData?.handle||m.handle,
      crew:crew||m.crew,
      foundingNumber:foundingNumber||m.foundingNumber,
      joinDate:new Date().toLocaleDateString("en-AU",{month:"short",year:"numeric"}).toUpperCase(),
    }));
    setStage("app");
  };

  if(stage==="gate")       return <FoundingGate onValid={handleFoundingValid}/>;
  if(stage==="register")   return <DetailsForm foundingNumber={foundingNumber} onComplete={handleRegComplete}/>;
  if(stage==="initiation") return <EntryLayer onComplete={handleInitComplete} handle={regData?.handle||"FACE"}/>;

  const unreadNotifs=2;

  return (
    <div style={{background:BG,minHeight:"100vh",maxWidth:440,margin:"0 auto",color:"#E8E8E0",position:"relative",overflowX:"hidden"}}>
      <CRTOverlay/>
      <div style={{opacity:tabTransition?1:0,transition:"opacity 0.12s ease",overflowY:"auto",minHeight:"100vh"}}>
        {activeTab==="home"    && <HomeTab    member={member} starPoints={starPoints} setStarPoints={setStarPoints} kash={kash} setKash={setKash} onFirstStar={()=>fireContextMoment("firstStar")} onEmptyKash={()=>fireContextMoment("emptyKash")}/>}
        {activeTab==="signal"  && <SignalTab  member={member} kash={kash} setKash={setKash} onFirstTag={()=>fireContextMoment("firstTag")} onFirstWagerWin={()=>fireContextMoment("firstWagerWin")}/>}
        {activeTab==="skocial" && <SkocialTab member={member} kash={kash} setKash={setKash}/>}
        {activeTab==="store"   && <StoreTab   member={member} kash={kash} setKash={setKash}/>}
        {activeTab==="me"      && <MeTab      member={member} setMember={setMember} kash={kash}/>}
      </div>
      {contextMoment&&<ContextToast momentKey={contextMoment} onDone={()=>setContextMoment(null)}/>}
      <BottomNav active={activeTab} setActive={switchTab} notifCount={unreadNotifs}/>
      <style>{`
        *{box-sizing:border-box}
        body{margin:0;background:${BG}}
        ::-webkit-scrollbar{width:0}
        @keyframes scanBeam{0%{top:-1px}100%{top:100vh}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes kashIn{0%{opacity:0;transform:scale(0.7) translateY(20px)}20%{opacity:1;transform:scale(1.05) translateY(0)}70%{opacity:1}100%{opacity:0;transform:scale(0.95) translateY(-10px)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        input[type=range]{accent-color:#E8E8E0}
        input[type=time]{color-scheme:dark}
        input[type=date]{color-scheme:dark}
        button:focus{outline:none}
      `}</style>
    </div>
  );
}
