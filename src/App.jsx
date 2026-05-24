import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// SUPABASE
// ═══════════════════════════════════════════════════════════════════════════════
const SUPABASE_URL = "https://kujhynqkzqxvytvpaaia.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1amh5bnFrenF4dnl0dnBhYWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1MzUxNDUsImV4cCI6MjA5NTExMTE0NX0.l5MnWHRZUwSuMNn7JOgXMhc8UL5JhZoSZDi1BnxhwiY";

const supabase = {
  async checkNumber(number) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/founding_numbers?number=eq.${number}&select=number,claimed`, {
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
    });
    const data = await res.json();
    return data[0] || null;
  },
  async claimNumber(number, memberId) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/founding_numbers?number=eq.${number}`, {
      method: "PATCH",
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", "Prefer": "return=minimal" },
      body: JSON.stringify({ claimed: true, claimed_at: new Date().toISOString(), member_id: memberId })
    });
    return res.ok;
  },
  async checkHandle(handle) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/members?handle=eq.${handle}&select=handle`, {
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
    });
    const data = await res.json();
    return data.length > 0;
  },
  async checkEmail(email) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/members?email=eq.${encodeURIComponent(email)}&select=email`, {
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
    });
    const data = await res.json();
    return data.length > 0;
  },
  async createMember(data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/members`, {
      method: "POST",
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", "Prefer": "return=representation" },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    return result[0] || null;
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// BRAND
// ═══════════════════════════════════════════════════════════════════════════════
const GOLD = "#C8A84B";
const BG = "#080808";
const CREWS = {
  FIRM: { label: "THE FIRM", color: "#7A1A1A", text: "#FF6B6B",
    stack: "Built for high output. Protein. Creatine. Hydration. Recovery.",
    stackItems: ["SHIELD — Whey isolate protein", "HOLD — Creatine monohydrate", "SKOLD HYDRATION — Electrolytes", "RECOVER — Night formula"] },
  MOD:  { label: "THE MOD",  color: "#D4A017", text: "#FFD04A",
    stack: "Built for precision movement. Mobility support. Hydration. Recovery.",
    stackItems: ["SHIELD — Whey isolate protein", "SKOLD HYDRATION — Electrolytes", "RECOVER — Night formula", "HOLD — Creatine monohydrate"] },
  GRIM: { label: "THE GRIM", color: "#1E3A5F", text: "#6B9AC4",
    stack: "Built for combat and strength. High protein. Creatine. Recovery.",
    stackItems: ["SHIELD — Whey isolate protein", "HOLD — Creatine monohydrate", "RECOVER — Night formula", "SKOLD HYDRATION — Electrolytes"] },
};

const TRAINING_OPTIONS = [
  { key: "FIRM", label: "HARD AND OFTEN", sub: "Hyrox. Gym. Track. You show up and you talk about it." },
  { key: "MOD",  label: "SLOW AND DELIBERATE", sub: "Yoga. Pilates. Mobility. Precision over noise." },
  { key: "GRIM", label: "UNTIL SOMETHING BREAKS", sub: "Lifting. Sparring. Combat. You don't stop." },
];

const ROOK_LINES = {
  signal:  "Signal goes live with DROP 002. Rook the Grim is watching the map.",
  skocial: "Skocial opens when the first 1000 Faces are in. Not before.",
  board:   "The board has no one on it yet. Be the reason it does.",
  draw:    "The Draw opens with DROP 002. The Vespa is already waiting.",
};

// ═══════════════════════════════════════════════════════════════════════════════
// CHROME STAR SVG
// ═══════════════════════════════════════════════════════════════════════════════
function ChromeStar({ size = 200, pulse = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{
      display: "block",
      filter: pulse
        ? "drop-shadow(0 0 24px rgba(220,230,240,0.2))"
        : "drop-shadow(0 0 8px rgba(220,230,240,0.08))",
      transition: "filter 1s ease",
    }}>
      <defs>
        <radialGradient id="sc" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95"/>
          <stop offset="40%" stopColor="#C8D4E0" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#4A5A6A" stopOpacity="0.7"/>
        </radialGradient>
        <radialGradient id="sl" cx="30%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#A0B0C0" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#202830" stopOpacity="0.9"/>
        </radialGradient>
        <filter id="ss">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.5"/>
        </filter>
      </defs>
      <path d="M100,10 L112,88 L190,100 L112,112 L100,190 L88,112 L10,100 L88,88 Z" fill="url(#sl)" filter="url(#ss)"/>
      <path d="M100,10 L108,72 L155,45 L108,88 L190,100 L128,108 L155,155 L112,112 L100,190 L92,128 L45,155 L88,112 L10,100 L72,92 L45,45 L88,72 Z" fill="url(#sc)" opacity="0.85"/>
      <ellipse cx="97" cy="94" rx="8" ry="10" fill="white" opacity="0.25" transform="rotate(-15 97 94)"/>
      <path d="M100,14 C103,50 97,80 100,100 C103,120 97,150 100,186" stroke="rgba(0,0,0,0.35)" strokeWidth="2.5" fill="none"/>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CRT OVERLAY
// ═══════════════════════════════════════════════════════════════════════════════
function CRTOverlay() {
  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999,
      background: `repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.022) 2px,rgba(0,0,0,0.022) 4px)`,
    }}/>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STAGE 1 — FOUNDING NUMBER GATE
// ═══════════════════════════════════════════════════════════════════════════════
function FoundingGate({ onValid }) {
  const [value, setValue]     = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [starIn, setStarIn]   = useState(false);

  useEffect(() => { setTimeout(() => setStarIn(true), 300); }, []);

  const check = async () => {
    const num = value.trim();
    if (!num) { setError("Enter your founding number."); return; }
    if (num.length < 4) { setError("Enter all 4 digits. Numbers start at 0001."); return; }
    if (num === "0000") { setError("That number is not recognised. Try again."); return; }
    setLoading(true); setError("");
    try {
      const record = await supabase.checkNumber(num);
      if (!record) { setError("That number is not recognised. Try again."); }
      else if (record.claimed) { setError("This number has already been claimed."); }
      else { onValid(num); }
    } catch {
      setError("Connection error. Try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      background: BG, minHeight: "100vh", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "40px 32px", fontFamily: "monospace", position: "relative",
    }}>
      <CRTOverlay/>
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(to right,transparent,${GOLD}22,transparent)`,
        animation: "scanBeam 5s linear infinite", pointerEvents: "none", zIndex: 9997,
      }}/>

      <div style={{
        marginBottom: 40,
        opacity: starIn ? 1 : 0, transform: starIn ? "scale(1)" : "scale(0.85)",
        transition: "all 0.8s ease",
      }}>
        <img src="./icon-192.PNG" alt="SKOLD" style={{
          width: 110, height: 110, objectFit: "contain",
          filter: starIn ? "drop-shadow(0 0 24px rgba(220,230,240,0.2))" : "drop-shadow(0 0 8px rgba(220,230,240,0.08))",
          transition: "filter 1s ease",
        }}/>
      </div>

      <div style={{ textAlign: "center", marginBottom: 36, opacity: starIn ? 1 : 0, transition: "opacity 0.8s ease 0.4s" }}>
        <div style={{ fontSize: "9px", color: "#333", letterSpacing: "4px", marginBottom: 12, fontFamily: "monospace" }}>MEMBERSHIP ONLY</div>
        <div style={{ fontSize: "12px", color: "#555", letterSpacing: "0.5px", lineHeight: 1.7, maxWidth: 240, fontFamily: "monospace" }}>
          Enter your founding number.<br/>It came with the vessel.
        </div>
      </div>

      <div style={{ width: "100%", maxWidth: 280, marginBottom: 8 }}>
        <input
          style={{
            width: "100%", padding: "14px 16px", background: "transparent",
            border: "none", borderBottom: `1px solid ${error ? "#7A1A1A" : "#2A2A2A"}`,
            color: "#E8E8E0", fontFamily: "monospace", fontSize: "28px",
            letterSpacing: "10px", outline: "none", textAlign: "center",
            caretColor: GOLD, boxSizing: "border-box",
            transition: "border-color 0.3s",
          }}
          type="text" maxLength={4} placeholder="0000"
          value={value}
          onChange={e => { setValue(e.target.value.replace(/\D/g, "")); setError(""); }}
          onKeyDown={e => e.key === "Enter" && check()}
        />
      </div>

      <div style={{
        height: 20, marginBottom: 24, fontSize: "9px",
        color: "#7A1A1A", letterSpacing: "1px", textAlign: "center",
        fontFamily: "monospace", transition: "opacity 0.3s", opacity: error ? 1 : 0,
      }}>{error || " "}</div>

      <button onClick={check} disabled={loading} style={{
        padding: "12px 40px", background: "transparent",
        border: `1px solid ${loading ? "#2A2A2A" : "#444"}`,
        color: loading ? "#333" : "#888",
        fontFamily: "monospace", fontSize: "10px",
        letterSpacing: "4px", cursor: loading ? "default" : "pointer",
        transition: "all 0.2s ease", minWidth: 160,
      }}
        onMouseEnter={e => { if (!loading) { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD; }}}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "#444"; e.currentTarget.style.color = "#888"; }}
      >
        {loading ? "CHECKING..." : "CONFIRM"}
      </button>

      <div style={{ position: "absolute", bottom: 32, fontSize: "8px", color: "#1A1A1A", letterSpacing: "2px", fontFamily: "monospace" }}>
        SKOLD — MEMBERSHIP ONLY
      </div>

      <style>{`
        @keyframes scanBeam{0%{top:-1px}100%{top:100vh}}
        input::placeholder{color:#1E1E1E;letter-spacing:6px}
        button:focus{outline:none}
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STAGE 2 — REGISTRATION
// ═══════════════════════════════════════════════════════════════════════════════
function Registration({ foundingNumber, onComplete }) {
  const [step, setStep]     = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [fields, setFields] = useState({
    firstName: "", handle: "", email: "", password: "", dob: "",
    trainingStyle: "", crew: "",
    goal: "", dietary: "NONE", ritual: "",
  });

  const set = (k, v) => setFields(f => ({ ...f, [k]: v }));
  const inpStyle = (key) => ({
    width: "100%", padding: "12px 14px",
    background: "#0A0A0A",
    border: `1px solid ${errors[key] ? "#7A1A1A" : "#1E1E1E"}`,
    borderLeft: `2px solid ${errors[key] ? "#7A1A1A" : "#2A2A2A"}`,
    color: "#E8E8E0", fontFamily: "monospace",
    fontSize: "13px", letterSpacing: "1px",
    outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s",
  });
  const labelStyle = {
    fontSize: "8px", color: "#444", letterSpacing: "3px",
    display: "block", marginBottom: 6, fontFamily: "monospace",
  };
  const errStyle = {
    fontSize: "8px", color: "#7A1A1A", letterSpacing: "1px",
    marginTop: 4, fontFamily: "monospace", minHeight: 14,
  };

  const validateStep0 = async () => {
    const e = {};
    if (!fields.firstName.trim()) e.firstName = "Required.";
    if (!fields.handle.trim()) e.handle = "Required.";
    else if (fields.handle.includes(" ")) e.handle = "No spaces.";
    if (!fields.email.includes("@")) e.email = "Valid email required.";
    if (fields.password.length < 8) e.password = "Minimum 8 characters.";
    if (!fields.dob) e.dob = "Required.";
    else {
      const age = (new Date() - new Date(fields.dob)) / (1000 * 60 * 60 * 24 * 365.25);
      if (age < 18) e.dob = "Must be 18 or older.";
    }
    if (Object.keys(e).length) { setErrors(e); return false; }
    setLoading(true);
    const handleTaken = await supabase.checkHandle(fields.handle.toUpperCase());
    if (handleTaken) { setErrors({ handle: "This handle is already taken." }); setLoading(false); return false; }
    const emailTaken = await supabase.checkEmail(fields.email);
    if (emailTaken) { setErrors({ email: "This email is already registered." }); setLoading(false); return false; }
    setLoading(false);
    setErrors({});
    return true;
  };

  const GOALS = [
    { key: "BUILD",   label: "BUILD",   sub: "Muscle, strength, performance" },
    { key: "RECOVER", label: "RECOVER", sub: "Sleep, stress, repair" },
    { key: "MOVE",    label: "MOVE",    sub: "Endurance, cardio, energy" },
  ];

  const DIETARY = ["NONE", "DAIRY FREE", "VEGAN", "OTHER"];

  const RITUAL = [
    { key: "MORNING", label: "MORNING ONLY", price: "$55/mo", sub: "Crew stack. 30 sachets." },
    { key: "FULL",    label: "FULL RITUAL",  price: "$75/mo", sub: "Morning + RECOVER. 60 sachets.", highlight: true },
    { key: "UNSURE",  label: "NOT SURE YET", price: null,     sub: "You can update this anytime." },
  ];

  const handleSubmit = async () => {
    if (!fields.goal) { setErrors({ goal: "Choose your goal." }); return; }
    if (!fields.ritual) { setErrors({ ritual: "Choose a preference." }); return; }
    setLoading(true);
    try {
      const member = await supabase.createMember({
        founding_number: foundingNumber,
        handle: fields.handle.toUpperCase(),
        first_name: fields.firstName,
        email: fields.email,
        password_hash: btoa(fields.password),
        dob: fields.dob,
        crew: fields.crew,
        training_style: fields.trainingStyle,
        goal: fields.goal,
        dietary: fields.dietary,
        ritual_preference: fields.ritual,
        order_status: "PROCESSING",
        kash_balance: 0,
        rank: 0,
      });
      if (member) {
        await supabase.claimNumber(foundingNumber, member.id);
        onComplete({ ...fields, handle: fields.handle.toUpperCase(), foundingNumber, memberId: member.id });
      } else {
        setErrors({ general: "Something went wrong. Try again." });
      }
    } catch {
      setErrors({ general: "Connection error. Try again." });
    }
    setLoading(false);
  };

  // Step dots
  const totalSteps = 4;
  const StepDots = () => (
    <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div key={i} style={{
          width: i === step ? 16 : 4, height: 2,
          background: i <= step ? "#E8E8E0" : "#1A1A1A",
          transition: "all 0.3s ease",
        }}/>
      ))}
    </div>
  );

  return (
    <div style={{
      background: BG, minHeight: "100vh",
      display: "flex", flexDirection: "column",
      fontFamily: "monospace", position: "relative",
    }}>
      <CRTOverlay/>

      {/* Header */}
      <div style={{
        padding: "16px 20px", borderBottom: "1px solid #111",
        display: "flex", alignItems: "center", gap: 14,
        background: BG,
      }}>
        <img src="./icon-192.PNG" alt="SKOLD" style={{ width: 28, height: 28, objectFit: "contain" }}/>
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#E8E8E0" }}>JOIN SKOLD</div>
          <div style={{ fontSize: "8px", color: "#333", letterSpacing: "2px", marginTop: 2 }}>
            FOUNDING MEMBER #{foundingNumber}
          </div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <StepDots/>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "28px 20px" }}>

        {/* STEP 0 — WHO ARE YOU */}
        {step === 0 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ fontSize: "9px", color: "#333", letterSpacing: "3px", marginBottom: 28 }}>WHO ARE YOU</div>

            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>FIRST NAME</label>
              <input style={inpStyle("firstName")} placeholder="First name only"
                value={fields.firstName} onChange={e => set("firstName", e.target.value)}/>
              <div style={errStyle}>{errors.firstName}</div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>HANDLE</label>
              <input style={inpStyle("handle")} placeholder="What the crew calls you"
                value={fields.handle} onChange={e => { set("handle", e.target.value.toUpperCase()); setErrors({}); }}/>
              <div style={{ ...errStyle, color: errors.handle ? "#7A1A1A" : "#2A2A2A" }}>
                {errors.handle || "Your identity in the app. Never shown as your real name."}
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>EMAIL</label>
              <input style={inpStyle("email")} type="email" placeholder="your@email.com"
                value={fields.email} onChange={e => { set("email", e.target.value); setErrors({}); }}/>
              <div style={errStyle}>{errors.email}</div>
            </div>

            <div style={{ marginBottom: 18, position: "relative" }}>
              <label style={labelStyle}>PASSWORD</label>
              <input style={inpStyle("password")} type="password" placeholder="Min. 8 characters"
                value={fields.password} onChange={e => set("password", e.target.value)}/>
              <div style={errStyle}>{errors.password}</div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>DATE OF BIRTH</label>
              <input style={{ ...inpStyle("dob"), colorScheme: "dark" }} type="date"
                value={fields.dob} onChange={e => set("dob", e.target.value)}/>
              <div style={{ ...errStyle, color: errors.dob ? "#7A1A1A" : "#2A2A2A" }}>
                {errors.dob || "Must be 18 or older."}
              </div>
            </div>
          </div>
        )}

        {/* STEP 1 — HOW DO YOU TRAIN */}
        {step === 1 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ fontSize: "9px", color: "#333", letterSpacing: "3px", marginBottom: 6 }}>ONE QUESTION</div>
            <div style={{ fontSize: "15px", color: "#E8E8E0", letterSpacing: "1px", marginBottom: 6, lineHeight: 1.4 }}>
              How do you train.
            </div>
            <div style={{ fontSize: "10px", color: "#444", letterSpacing: "1px", marginBottom: 28 }}>
              The room doesn't judge.
            </div>

            {TRAINING_OPTIONS.map(opt => (
              <button key={opt.key} onClick={() => { set("trainingStyle", opt.label); set("crew", opt.key); }}
                style={{
                  width: "100%", padding: "14px 16px", marginBottom: 8,
                  background: fields.crew === opt.key ? `${CREWS[opt.key].color}18` : "transparent",
                  border: `1px solid ${fields.crew === opt.key ? CREWS[opt.key].color : "#1E1E1E"}`,
                  borderLeft: `3px solid ${fields.crew === opt.key ? CREWS[opt.key].color : "#1E1E1E"}`,
                  fontFamily: "monospace", cursor: "pointer", textAlign: "left",
                  transition: "all 0.2s ease",
                }}>
                <div style={{
                  fontSize: "10px", letterSpacing: "2px", marginBottom: 5,
                  color: fields.crew === opt.key ? CREWS[opt.key].text : "#E8E8E0",
                }}>{opt.label}</div>
                <div style={{ fontSize: "9px", color: "#3A3A3A", letterSpacing: "0.3px", lineHeight: 1.5 }}>{opt.sub}</div>
              </button>
            ))}
          </div>
        )}

        {/* STEP 2 — YOUR STACK + DIETARY */}
        {step === 2 && fields.crew && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ fontSize: "9px", color: "#333", letterSpacing: "3px", marginBottom: 6 }}>YOUR STACK</div>
            <div style={{ fontSize: "11px", color: CREWS[fields.crew].text, letterSpacing: "2px", marginBottom: 4 }}>
              {CREWS[fields.crew].label}
            </div>
            <div style={{ fontSize: "10px", color: "#555", letterSpacing: "0.5px", lineHeight: 1.6, marginBottom: 16 }}>
              {CREWS[fields.crew].stack}
            </div>

            {/* Stack items */}
            <div style={{ marginBottom: 24 }}>
              {CREWS[fields.crew].stackItems.map((item, i) => (
                <div key={i} style={{
                  padding: "10px 12px", marginBottom: 1,
                  background: "#0A0A0A", border: "1px solid #111",
                  borderLeft: `2px solid ${CREWS[fields.crew].color}`,
                  fontSize: "10px", color: "#666", fontFamily: "monospace", letterSpacing: "0.5px",
                }}>{item}</div>
              ))}
            </div>

            {/* Goal */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>MAIN GOAL</label>
              <div style={{ display: "flex", gap: 6 }}>
                {GOALS.map(g => (
                  <button key={g.key} onClick={() => set("goal", g.key)} style={{
                    flex: 1, padding: "10px 4px",
                    background: fields.goal === g.key ? CREWS[fields.crew].color : "transparent",
                    border: `1px solid ${fields.goal === g.key ? CREWS[fields.crew].color : "#1E1E1E"}`,
                    color: fields.goal === g.key ? "#E8E8E0" : "#555",
                    fontFamily: "monospace", fontSize: "9px", letterSpacing: "1px", cursor: "pointer",
                  }}>
                    <div>{g.label}</div>
                    <div style={{ fontSize: "7px", color: fields.goal === g.key ? "#E8E8E0BB" : "#2A2A2A", marginTop: 3 }}>{g.sub}</div>
                  </button>
                ))}
              </div>
              <div style={errStyle}>{errors.goal}</div>
            </div>

            {/* Dietary */}
            <div style={{ marginBottom: 8 }}>
              <label style={labelStyle}>DIETARY REQUIREMENTS</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {DIETARY.map(d => (
                  <button key={d} onClick={() => set("dietary", d)} style={{
                    padding: "7px 12px",
                    background: fields.dietary === d ? "#E8E8E0" : "transparent",
                    border: `1px solid ${fields.dietary === d ? "#E8E8E0" : "#1E1E1E"}`,
                    color: fields.dietary === d ? "#080808" : "#555",
                    fontFamily: "monospace", fontSize: "9px", letterSpacing: "1px", cursor: "pointer",
                  }}>{d}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 — RITUAL PREFERENCE */}
        {step === 3 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ fontSize: "9px", color: "#333", letterSpacing: "3px", marginBottom: 6 }}>WHEN RITUAL LAUNCHES</div>
            <div style={{ fontSize: "11px", color: "#888", letterSpacing: "0.5px", lineHeight: 1.7, marginBottom: 24 }}>
              Supplements aren't live yet. But your preference locks your price forever — even if it goes up before you activate.
            </div>

            {RITUAL.map(r => (
              <button key={r.key} onClick={() => set("ritual", r.key)} style={{
                width: "100%", padding: "16px", marginBottom: 6, textAlign: "left",
                background: fields.ritual === r.key ? (r.highlight ? `${GOLD}18` : "#0C0C0C") : "transparent",
                border: `1px solid ${fields.ritual === r.key ? (r.highlight ? GOLD : "#444") : "#1E1E1E"}`,
                borderLeft: `3px solid ${fields.ritual === r.key ? (r.highlight ? GOLD : "#E8E8E0") : "#1E1E1E"}`,
                fontFamily: "monospace", cursor: "pointer",
                transition: "all 0.2s ease",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <div style={{
                    fontSize: "11px", letterSpacing: "2px",
                    color: fields.ritual === r.key ? (r.highlight ? GOLD : "#E8E8E0") : "#666",
                  }}>{r.label}</div>
                  {r.price && <div style={{
                    fontSize: "12px", color: fields.ritual === r.key ? (r.highlight ? GOLD : "#E8E8E0") : "#444",
                    letterSpacing: "1px",
                  }}>{r.price}</div>}
                </div>
                <div style={{ fontSize: "9px", color: "#444", letterSpacing: "0.5px" }}>{r.sub}</div>
              </button>
            ))}

            <div style={{
              marginTop: 16, padding: "12px 14px",
              background: "#0A0A0A", border: `1px solid ${GOLD}22`,
              borderLeft: `2px solid ${GOLD}44`,
            }}>
              <div style={{ fontSize: "8px", color: "#444", letterSpacing: "1px", lineHeight: 1.8 }}>
                Price locked at your join rate. Forever.<br/>
                Activate when ritual launches. No action needed until then.
              </div>
            </div>

            {errors.ritual && <div style={{ ...errStyle, marginTop: 8 }}>{errors.ritual}</div>}
            {errors.general && <div style={{ ...errStyle, marginTop: 8 }}>{errors.general}</div>}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div style={{ padding: "16px 20px 28px", borderTop: "1px solid #111" }}>
        {step < 3 ? (
          <div style={{ display: "flex", gap: 8 }}>
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} style={{
                width: 48, padding: 14, background: "transparent",
                border: "1px solid #1E1E1E", color: "#444",
                fontFamily: "monospace", fontSize: "14px", cursor: "pointer",
              }}>←</button>
            )}
            <button onClick={async () => {
              if (step === 0) { const ok = await validateStep0(); if (ok) setStep(1); }
              else if (step === 1) { if (!fields.crew) { setErrors({ crew: "Choose how you train." }); return; } setErrors({}); setStep(2); }
              else if (step === 2) { if (!fields.goal) { setErrors({ goal: "Choose your goal." }); return; } setErrors({}); setStep(3); }
            }} disabled={loading} style={{
              flex: 1, padding: 14,
              background: loading ? "#111" : "#E8E8E0",
              border: "none",
              color: loading ? "#333" : "#080808",
              fontFamily: "monospace", fontSize: "11px",
              letterSpacing: "3px", cursor: loading ? "default" : "pointer",
            }}>
              {loading ? "CHECKING..." : "CONTINUE"}
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setStep(2)} style={{
              width: 48, padding: 14, background: "transparent",
              border: "1px solid #1E1E1E", color: "#444",
              fontFamily: "monospace", fontSize: "14px", cursor: "pointer",
            }}>←</button>
            <button onClick={handleSubmit} disabled={loading || !fields.ritual} style={{
              flex: 1, padding: 14,
              background: loading || !fields.ritual ? "#111" : "#E8E8E0",
              border: "none",
              color: loading || !fields.ritual ? "#333" : "#080808",
              fontFamily: "monospace", fontSize: "11px",
              letterSpacing: "3px", cursor: loading || !fields.ritual ? "default" : "pointer",
            }}>
              {loading ? "JOINING..." : "JOIN SKOLD"}
            </button>
          </div>
        )}
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}} button:focus{outline:none}`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STAGE 3 — INITIATION
// ═══════════════════════════════════════════════════════════════════════════════
function Initiation({ member, onComplete }) {
  const handle = member.handle || "FACE";
  const crew = member.crew || "FIRM";
  const c = CREWS[crew];

  const CREW_REVEAL = {
    FIRM: "THE FIRM. You show up. You make noise. Own it.",
    MOD:  "THE MOD. Controlled. Precise. Harder than it looks.",
    GRIM: "THE GRIM. We already knew.",
  };

  const PHASES = [
    { text: `${handle}.`, big: true, color: "#E8E8E0" },
    { text: "Welcome to SKOLD.", big: false, color: "#E8E8E0" },
    { text: "Once you're a Skold. You stay Skold.", big: true, color: "#E8E8E0" },
    { text: CREW_REVEAL[crew] || CREW_REVEAL.FIRM, big: false, color: c?.text || GOLD },
    { text: "You're in. Don't give Rook the Grim a reason to remember your name for the wrong reason.", big: false, color: "#888" },
  ];

  const [phaseIdx, setPhaseIdx] = useState(0);
  const [typed, setTyped]       = useState("");
  const [typeDone, setTypeDone] = useState(false);
  const [starSmall, setStarSmall] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (phaseIdx === 1) setStarSmall(true);
    const phase = PHASES[phaseIdx];
    if (!phase || phase.skip) { setTypeDone(true); return; }
    setTyped(""); setTypeDone(false);
    let i = 0;
    const speed = phaseIdx === 0 ? 80 : phaseIdx === 2 ? 65 : 40;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      i++;
      setTyped(phase.text.slice(0, i));
      if (i >= phase.text.length) { clearInterval(timerRef.current); setTypeDone(true); }
    }, speed);
    return () => clearInterval(timerRef.current);
  }, [phaseIdx]);

  const advance = () => {
    if (!typeDone) return;
    if (phaseIdx >= PHASES.length - 1) { onComplete(); return; }
    setPhaseIdx(p => p + 1);
  };

  const phase = PHASES[phaseIdx];
  const isLast = phaseIdx === PHASES.length - 1;

  return (
    <div style={{
      background: BG, minHeight: "100vh",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "40px 32px", fontFamily: "monospace",
      position: "relative", cursor: typeDone ? "pointer" : "default",
      userSelect: "none",
    }} onClick={() => { if (typeDone) advance(); }}>
      <CRTOverlay/>
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(to right,transparent,${GOLD}22,transparent)`,
        animation: "scanBeam 5s linear infinite", pointerEvents: "none", zIndex: 9997,
      }}/>

      {/* Star */}
      <div style={{
        marginBottom: starSmall ? 24 : 0,
        transition: "all 0.8s ease", pointerEvents: "none",
      }}>
        <img src="./icon-192.PNG" alt="SKOLD" style={{
          width: starSmall ? 68 : 160,
          height: starSmall ? 68 : 160,
          objectFit: "contain",
          filter: phaseIdx === 0 ? "drop-shadow(0 0 30px rgba(220,230,240,0.2))" : "drop-shadow(0 0 10px rgba(220,230,240,0.08))",
          transition: "width 0.8s ease, height 0.8s ease, filter 1s ease",
        }}/>
      </div>

      {phaseIdx > 0 && (
        <div style={{
          fontSize: "10px", letterSpacing: "6px", color: "#2A2A2A",
          marginBottom: 24, pointerEvents: "none",
          animation: "fadeUp 0.5s ease",
        }}>SKOLD</div>
      )}

      {/* Crew badge after crew reveal */}
      {phaseIdx === 4 && typeDone && (
        <div style={{
          fontSize: "9px", color: c.text,
          border: `1px solid ${c.color}55`,
          padding: "5px 16px", letterSpacing: "4px",
          marginBottom: 20, animation: "fadeUp 0.5s ease",
          pointerEvents: "none",
        }}>{c.label}</div>
      )}

      {/* Text */}
      {phase && !phase.skip && (
        <div style={{
          maxWidth: 300, textAlign: "center", minHeight: 80,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 32, pointerEvents: "none",
        }}>
          <p style={{
            margin: 0, lineHeight: 1.85,
            fontSize: phase.big ? "20px" : "13px",
            color: phase.color,
            letterSpacing: phase.big ? "2px" : "0.3px",
            fontWeight: phase.big ? "bold" : "normal",
            textShadow: phaseIdx === 2 ? "0 0 24px rgba(232,232,224,0.12)" : "none",
          }}>
            {typed}
            {!typeDone && <span style={{ opacity: 0.4, animation: "blink 0.9s infinite" }}>|</span>}
          </p>
        </div>
      )}

      {/* CTA */}
      <div style={{
        opacity: typeDone ? 1 : 0, transition: "opacity 0.4s ease",
        pointerEvents: "none",
      }}>
        <div style={{
          padding: "11px 36px",
          border: `1px solid ${isLast ? GOLD : "#2A2A2A"}`,
          color: isLast ? GOLD : "#555",
          fontFamily: "monospace", fontSize: "10px",
          letterSpacing: "4px", textAlign: "center",
        }}>
          {isLast ? "ENTER" : "CONTINUE"}
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 40,
        fontSize: "8px", color: typeDone ? "#333" : "#1A1A1A",
        letterSpacing: "2px", fontFamily: "monospace",
        pointerEvents: "none", transition: "color 0.5s ease",
      }}>TAP ANYWHERE TO CONTINUE</div>

      <style>{`
        @keyframes scanBeam{0%{top:-1px}100%{top:100vh}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMING SOON SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
function ComingSoon({ title, rookLine, drop = "DROP 002" }) {
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: 40, textAlign: "center",
    }}>
      <div style={{ width: 48, height: 48, marginBottom: 24, opacity: 0.15 }}>
        <img src="./icon-192.PNG" alt="SKOLD" style={{ width: 48, height: 48, objectFit: "contain" }}/>
      </div>
      <div style={{
        fontSize: "9px", color: "#222",
        letterSpacing: "3px", fontFamily: "monospace",
        marginBottom: 12,
      }}>{drop}</div>
      <div style={{
        fontSize: "14px", color: "#2A2A2A",
        letterSpacing: "3px", fontFamily: "monospace",
        marginBottom: 20, fontWeight: "bold",
      }}>{title}</div>
      <div style={{
        padding: "12px 16px",
        background: "#0A0A0A", border: `1px solid ${GOLD}22`,
        borderLeft: `2px solid ${GOLD}33`,
        maxWidth: 280,
      }}>
        <span style={{ fontSize: "8px", color: GOLD, letterSpacing: "2px", fontFamily: "monospace", marginRight: 8 }}>ROOK //</span>
        <span style={{ fontSize: "10px", color: "#555", fontFamily: "monospace", letterSpacing: "0.5px", lineHeight: 1.6 }}>{rookLine}</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB — HOME (STAR TRACKER)
// ═══════════════════════════════════════════════════════════════════════════════
const STAR_POINTS = [
  { id: "move",    label: "MOVE",    icon: "◈", unit: "STEPS", target: 8000, current: 0,  auto: true  },
  { id: "train",   label: "TRAIN",   icon: "◉", unit: "MIN",   target: 45,   current: 0,  auto: true  },
  { id: "hydrate", label: "HYDRATE", icon: "◇", unit: "LOG",   target: 1,    current: 0,  auto: false },
  { id: "recover", label: "RECOVER", icon: "◌", unit: "HRS",   target: 7,    current: 0,  auto: true  },
  { id: "fuel",    label: "FUEL",    icon: "◆", unit: "LOG",   target: 1,    current: 0,  auto: false },
  { id: "skocial", label: "SKOCIAL", icon: "◎", unit: "ACT",   target: 1,    current: 0,  auto: false },
  { id: "streak",  label: "STREAK",  icon: "▲", unit: "DAYS",  target: 1,    current: 1,  auto: true  },
  { id: "connect", label: "CONNECT", icon: "◫", unit: "INT",   target: 1,    current: 0,  auto: false },
];

function StarSVG({ points, crewColor }) {
  const size = 200, cx = 100, cy = 100, outerR = 80, innerR = 32, N = 8;
  const allDone = points.every(p => p.current >= p.target);
  const doneCt = points.filter(p => p.current >= p.target).length;

  const seg = (i) => {
    const sa = (i * 2 * Math.PI / N) - Math.PI / 2 - (Math.PI / N);
    const ea = sa + (2 * Math.PI / N);
    const tipA = (i * 2 * Math.PI / N) - Math.PI / 2;
    const steps = 10;
    const arc = Array.from({ length: steps + 1 }, (_, k) => {
      const a = sa + (ea - sa) * (k / steps);
      return `${cx + outerR * Math.cos(a)},${cy + outerR * Math.sin(a)}`;
    });
    const tip = `${cx + outerR * 1.22 * Math.cos(tipA)},${cy + outerR * 1.22 * Math.sin(tipA)}`;
    const is0 = `${cx + innerR * Math.cos(sa + 0.15)},${cy + innerR * Math.sin(sa + 0.15)}`;
    const ie0 = `${cx + innerR * Math.cos(ea - 0.15)},${cy + innerR * Math.sin(ea - 0.15)}`;
    const mid = Math.floor(steps / 2);
    return `M${is0} ${arc.slice(0, mid + 1).map(p => `L${p}`).join(" ")} L${tip} ${arc.slice(mid + 1).map(p => `L${p}`).join(" ")} L${ie0} A${innerR} ${innerR} 0 0 0 ${is0} Z`;
  };

  const iconPos = (i) => {
    const a = (i * 2 * Math.PI / N) - Math.PI / 2;
    return [cx + outerR * 1.45 * Math.cos(a), cy + outerR * 1.45 * Math.sin(a)];
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
      <defs>
        <filter id="gs2"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <radialGradient id="cg2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={allDone ? GOLD : "#1A1A1A"} stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#080808" stopOpacity="1"/>
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={outerR * 1.6} fill="none" stroke="#0F0F0F" strokeWidth="1"/>
      {points.map((p, i) => {
        const done = p.current >= p.target;
        const prog = Math.min(p.current / p.target, 1);
        return (
          <g key={p.id}>
            {!done && prog > 0 && <path d={seg(i)} fill={crewColor} opacity={prog * 0.3}/>}
            <path d={seg(i)}
              fill={done ? (allDone ? GOLD : crewColor) : "transparent"}
              stroke={done ? (allDone ? GOLD : crewColor) : "#161616"} strokeWidth="0.5"
              style={{ filter: done ? "url(#gs2)" : "none", transition: "fill 0.5s ease" }}
            />
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={innerR - 2} fill="url(#cg2)"
        stroke={allDone ? GOLD : "#1E1E1E"} strokeWidth="1"
        style={{ filter: allDone ? "url(#gs2)" : "none" }}
      />
      <text x={cx} y={cy - (allDone ? 1 : 3)} textAnchor="middle" dominantBaseline="middle"
        fill={allDone ? GOLD : "#E8E8E0"} fontSize={allDone ? 13 : 18}
        fontFamily="monospace" fontWeight="bold"
        style={{ filter: allDone ? "url(#gs2)" : "none" }}>
        {allDone ? "S" : doneCt}
      </text>
      {!allDone && <text x={cx} y={cy + 12} textAnchor="middle" dominantBaseline="middle" fill="#2A2A2A" fontSize="7" fontFamily="monospace" letterSpacing="2">OF 8</text>}
      {points.map((p, i) => {
        const [ix, iy] = iconPos(i);
        const done = p.current >= p.target;
        return (
          <text key={p.id} x={ix} y={iy} textAnchor="middle" dominantBaseline="middle"
            fill={done ? (allDone ? GOLD : "#E8E8E0") : "#232323"} fontSize="8" fontFamily="monospace"
            style={{ transition: "fill 0.4s ease" }}>
            {p.icon}
          </text>
        );
      })}
    </svg>
  );
}

function HomeTab({ member }) {
  const crew = member.crew || "FIRM";
  const c = CREWS[crew];
  const [points, setPoints] = useState(STAR_POINTS);
  const [kashDrop, setKashDrop] = useState(false);
  const [prevDone, setPrevDone] = useState(0);

  const doneCt = points.filter(p => p.current >= p.target).length;
  const allDone = doneCt === 8;

  useEffect(() => {
    if (doneCt > prevDone) {
      setPrevDone(doneCt);
      if (doneCt === 8) { setKashDrop(true); setTimeout(() => setKashDrop(false), 2800); }
    }
  }, [doneCt]);

  const log = (id) => setPoints(prev => prev.map(p => p.id === id ? { ...p, current: p.target } : p));

  const streak = 1;
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const today = (new Date().getDay() + 6) % 7;

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* Header */}
      <div style={{
        padding: "16px 20px", borderBottom: "1px solid #0F0F0F",
        background: BG, position: "sticky", top: 0, zIndex: 10,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: "18px", letterSpacing: "4px", fontWeight: "bold", color: "#E8E8E0", fontFamily: "monospace" }}>SKOLD</div>
          <div style={{ fontSize: "9px", color: "#333", letterSpacing: "2px", marginTop: 1, fontFamily: "monospace" }}>DAILY STAR</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: "9px", color: c.text, border: `1px solid ${c.color}`, padding: "3px 8px", fontFamily: "monospace", letterSpacing: "2px" }}>
            {c.label}
          </div>
        </div>
      </div>

      {/* Member strip */}
      <div style={{ padding: "10px 20px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #0F0F0F", background: "#0A0A0A" }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: c.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "bold", color: "#E8E8E0" }}>
          {(member.handle || "F")[0]}
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: "10px", color: "#E8E8E0", letterSpacing: "1px", fontFamily: "monospace" }}>{member.handle || "FACE"}</span>
          <span style={{ fontSize: "8px", color: "#333", marginLeft: 8, fontFamily: "monospace" }}>#{member.foundingNumber}</span>
        </div>
        <span style={{ fontSize: "9px", color: "#444", fontFamily: "monospace", letterSpacing: "1px" }}>PROSPECT</span>
      </div>

      {/* Rook line */}
      <div style={{ padding: "10px 16px", borderBottom: "1px solid #0F0F0F", display: "flex", alignItems: "center", gap: 10, minHeight: 40 }}>
        <span style={{ fontSize: "8px", color: GOLD, letterSpacing: "2px", flexShrink: 0, fontFamily: "monospace" }}>ROOK //</span>
        <span style={{ fontSize: "11px", color: "#555", lineHeight: 1.5, letterSpacing: "0.5px", fontFamily: "monospace" }}>
          {allDone ? "Full star. Don't make a thing of it." : "Eight points. Complete them all. Kash drops."}
        </span>
      </div>

      {/* Star */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 20px 8px" }}>
        <div style={{ fontSize: "9px", color: "#2A2A2A", letterSpacing: "3px", marginBottom: 18, fontFamily: "monospace" }}>
          {new Date().toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" }).toUpperCase()}
        </div>
        <StarSVG points={points} crewColor={c.color}/>
        <div style={{ marginTop: 16, fontSize: "10px", letterSpacing: "2px", fontFamily: "monospace", color: allDone ? GOLD : "#2A2A2A" }}>
          {allDone ? "STAR COMPLETE" : `${8 - doneCt} POINT${8 - doneCt !== 1 ? "S" : ""} REMAINING`}
        </div>
      </div>

      {/* Streak */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #0F0F0F" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: "9px", color: "#333", letterSpacing: "2px", fontFamily: "monospace" }}>STREAK</span>
          <span style={{ fontSize: "10px", color: c.text, letterSpacing: "2px", fontFamily: "monospace" }}>{streak} DAY</span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {days.map((d, i) => {
            const inStreak = i >= today - streak + 1 && i <= today;
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <div style={{ width: "100%", height: 16, background: inStreak ? c.color : "#0F0F0F", border: i === today ? `1px solid ${c.color}` : "1px solid transparent" }}/>
                <span style={{ fontSize: "7px", fontFamily: "monospace", color: i === today ? "#E8E8E0" : "#2A2A2A" }}>{d}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Points */}
      {points.map(p => {
        const done = p.current >= p.target;
        const prog = Math.min(p.current / p.target, 1);
        return (
          <div key={p.id} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "11px 16px", borderBottom: "1px solid #0A0A0A",
            background: done ? "#0C0C0C" : "transparent",
            borderLeft: `2px solid ${done ? c.color : "transparent"}`,
            transition: "all 0.3s ease",
          }}>
            <div style={{ width: 28, flexShrink: 0, textAlign: "center", fontSize: "14px", fontFamily: "monospace", color: done ? c.color : "#2A2A2A" }}>{p.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "2px", color: done ? "#E8E8E0" : "#444" }}>{p.label}</span>
                <span style={{ fontFamily: "monospace", fontSize: "9px", color: done ? c.text : "#333", letterSpacing: "1px" }}>
                  {done ? "DONE" : p.auto ? "AUTO — PHASE 2" : "TAP"}
                </span>
              </div>
              <div style={{ height: 2, background: "#111", position: "relative" }}>
                <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${prog * 100}%`, background: done ? c.color : "#2A2A2A", transition: "width 0.6s ease" }}/>
              </div>
            </div>
            {!p.auto && !done && (
              <button onClick={() => log(p.id)} style={{ width: 28, height: 28, flexShrink: 0, background: "transparent", border: "1px solid #222", color: "#444", fontFamily: "monospace", fontSize: "14px", cursor: "pointer" }}>+</button>
            )}
            {done && <div style={{ width: 28, height: 28, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: c.color, fontSize: "12px" }}>✓</div>}
          </div>
        );
      })}

      <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#1A2A1A", flexShrink: 0 }}/>
        <span style={{ fontSize: "8px", color: "#2A2A2A", fontFamily: "monospace", letterSpacing: "1px", lineHeight: 1.6 }}>
          AUTO points connect to Apple Health and Google Fit in Phase 2. Tap manually for now.
        </span>
      </div>

      {/* Kash drop */}
      {kashDrop && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.85)", pointerEvents: "none" }}>
          <div style={{ textAlign: "center", animation: "kashIn 2.8s ease forwards" }}>
            <div style={{ fontSize: "48px", color: GOLD, fontFamily: "monospace", fontWeight: "bold", letterSpacing: "4px", textShadow: `0 0 40px ${GOLD}` }}>STAR</div>
            <div style={{ fontSize: "14px", color: `${GOLD}99`, fontFamily: "monospace", letterSpacing: "4px", marginTop: 8 }}>COMPLETE</div>
          </div>
        </div>
      )}
      <style>{`@keyframes kashIn{0%{opacity:0;transform:scale(0.7) translateY(20px)}20%{opacity:1;transform:scale(1.05) translateY(0)}70%{opacity:1}100%{opacity:0;transform:scale(0.95) translateY(-10px)}}`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB — STORE (Phase 1 — Supplements only, rest coming soon)
// ═══════════════════════════════════════════════════════════════════════════════
const SUPPLEMENTS = [
  { id: 1, label: "SHIELD",          sub: "Protein",     desc: "Whey isolate. Unflavoured. Nothing added. 30 serves.", detail: "26g protein per serve. No artificial sweeteners. No fillers. Mixes clean.", price: "$79.95" },
  { id: 2, label: "HOLD",            sub: "Creatine",    desc: "Monohydrate. Pure. No filler. 60 serves.",             detail: "5g per serve. Micronised. Unflavoured.", price: "$49.95" },
  { id: 3, label: "SKOLD HYDRATION", sub: "Electrolytes",desc: "Coconut water base. Electrolytes. No sugar. 30 serves.",detail: "Sodium, potassium, magnesium. Natural flavour only.", price: "$54.95" },
  { id: 4, label: "RECOVER",         sub: "Night",       desc: "Magnesium glycinate. Tart cherry. Zinc. Ashwagandha.", detail: "Take at night. Sleep is where the work happens.", price: "$59.95" },
];

function StoreTab({ member }) {
  const [section, setSection] = useState("SUPPLEMENTS");
  const [expanded, setExpanded] = useState(null);
  const SECTIONS = ["SUPPLEMENTS", "UNIFORM", "THE DRAW", "KASH"];

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #0F0F0F", background: BG, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ fontSize: "18px", letterSpacing: "4px", fontWeight: "bold", color: "#E8E8E0", fontFamily: "monospace", marginBottom: 10 }}>STORE</div>
        <div style={{ display: "flex", gap: 0, overflowX: "auto", scrollbarWidth: "none" }}>
          {SECTIONS.map(s => (
            <button key={s} onClick={() => setSection(s)} style={{
              padding: "8px 12px", flexShrink: 0, background: "transparent", border: "none",
              borderBottom: section === s ? "2px solid #E8E8E0" : "2px solid transparent",
              color: section === s ? "#E8E8E0" : "#333",
              fontFamily: "monospace", fontSize: "9px", letterSpacing: "2px", cursor: "pointer",
              whiteSpace: "nowrap",
            }}>{s}</button>
          ))}
        </div>
      </div>

      {section === "SUPPLEMENTS" && (
        <div>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #0A0A0A" }}>
            <span style={{ fontSize: "9px", color: "#2A2A2A", letterSpacing: "2px", fontFamily: "monospace" }}>OPEN TO ALL MEMBERS</span>
          </div>
          {SUPPLEMENTS.map(s => (
            <div key={s.id} style={{ borderBottom: "1px solid #0A0A0A" }}>
              <div onClick={() => setExpanded(expanded === s.id ? null : s.id)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
                cursor: "pointer", background: expanded === s.id ? "#0C0C0C" : "transparent",
                borderLeft: `2px solid ${expanded === s.id ? "#E8E8E0" : "transparent"}`,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: "12px", color: "#E8E8E0", fontFamily: "monospace", letterSpacing: "2px" }}>{s.label}</span>
                    <span style={{ fontSize: "8px", color: "#444", fontFamily: "monospace", letterSpacing: "2px" }}>{s.sub}</span>
                  </div>
                  <div style={{ fontSize: "9px", color: "#555", fontFamily: "monospace", lineHeight: 1.5 }}>{s.desc}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: "14px", color: "#E8E8E0", fontFamily: "monospace", marginBottom: 6 }}>{s.price}</div>
                  <button onClick={e => { e.stopPropagation(); window.location.href = `mailto:support@stayskold.com?subject=Order: ${s.label}`; }} style={{
                    padding: "6px 12px", background: "transparent", border: "1px solid #222",
                    color: "#666", fontFamily: "monospace", fontSize: "9px", letterSpacing: "1px", cursor: "pointer",
                  }}>ORDER</button>
                </div>
              </div>
              {expanded === s.id && (
                <div style={{ padding: "0 16px 14px 18px" }}>
                  <p style={{ margin: 0, fontSize: "10px", color: "#555", fontFamily: "monospace", lineHeight: 1.8, borderLeft: `1px solid ${GOLD}33`, paddingLeft: 12 }}>{s.detail}</p>
                </div>
              )}
            </div>
          ))}
          <div style={{ padding: "14px 16px", background: "#0A0A0A", borderTop: "1px solid #0A0A0A" }}>
            <div style={{ fontSize: "9px", color: "#2A2A2A", letterSpacing: "2px", fontFamily: "monospace", marginBottom: 4 }}>CREW STACKS COMING WITH DROP 002</div>
            <div style={{ fontSize: "8px", color: "#1A1A1A", fontFamily: "monospace", letterSpacing: "1px", lineHeight: 1.8 }}>
              Your ritual preference is locked at your join price.<br/>Activates when stacks launch.
            </div>
          </div>
        </div>
      )}

      {section === "UNIFORM" && (
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <ComingSoon title="UNIFORM" rookLine="Pieces are being made. You'll know when they're ready." drop="DROP 002"/>
        </div>
      )}

      {section === "THE DRAW" && (
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <ComingSoon title="THE DRAW" rookLine={ROOK_LINES.draw} drop="DROP 002"/>
        </div>
      )}

      {section === "KASH" && (
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <ComingSoon title="KASH" rookLine="Kash economy opens with DROP 002. Start earning through daily stars now." drop="DROP 002"/>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB — ME
// ═══════════════════════════════════════════════════════════════════════════════
function MeTab({ member }) {
  const c = CREWS[member.crew] || CREWS.FIRM;
  const [section, setSection] = useState("PROFILE");
  const [showCodex, setShowCodex] = useState(false);

  const CODEX_SECTIONS = [
    { title: "KASH", body: "Earned through training. Spent on prizes and wagers in DROP 002. No cash value. Cannot be withdrawn. Ever." },
    { title: "THE STAR TRACKER", body: "Eight points. Complete all eight and the star fills. AUTO points connect to Apple Health in Phase 2. HYDRATE, FUEL, SKOCIAL, and CONNECT are one tap manually." },
    { title: "CREW", body: "Three crews based on how you train. THE FIRM trains hard and often. THE MOD trains slow and deliberate. THE GRIM trains until something breaks. Crew determines your stack." },
    { title: "RITUAL", body: "Your preference is locked at your join price. Morning Only $55/mo or Full Ritual $75/mo. Activates when crew stacks launch. Price never increases from what you locked in." },
    { title: "FOUNDING NUMBER", body: "Single use. Tied to your account. Cannot be transferred. Ships with the vessel. The number is yours. DROP 001 numbers do not change." },
    { title: "SKOCIAL + SIGNAL", body: "Opens when the first 1000 Faces are registered. Post activities. Tap in. Challenge nearby members. Tag goes live city wide. Coming DROP 002." },
    { title: "THE DRAW", body: "Five prizes always live. Entered using Kash. One of them is a Vespa. Opens DROP 002. Earned Kash only counts on the board." },
    { title: "UNIFORM", body: "Rank gated. App only. Rook delivers the unlock. Pieces are being made. More coming. You will know when they are ready." },
  ];

  const [openCodex, setOpenCodex] = useState(null);

  const ORDER_STATUS_COLORS = {
    "PROCESSING": "#D4A017",
    "PACKED":     "#2A5A2A",
    "IN TRANSIT": "#3A7A3A",
    "DELIVERED":  "#444",
  };

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #0F0F0F", background: BG, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: "18px", letterSpacing: "4px", fontWeight: "bold", color: "#E8E8E0", fontFamily: "monospace" }}>ME</div>
            <div style={{ fontSize: "9px", color: "#333", letterSpacing: "2px", marginTop: 1, fontFamily: "monospace" }}>FACE #{member.foundingNumber}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 0, overflowX: "auto", scrollbarWidth: "none" }}>
          {["PROFILE", "ORDER", "MEMBERSHIP"].map(s => (
            <button key={s} onClick={() => setSection(s)} style={{
              padding: "8px 12px", flexShrink: 0, background: "transparent", border: "none",
              borderBottom: section === s ? "2px solid #E8E8E0" : "2px solid transparent",
              color: section === s ? "#E8E8E0" : "#333",
              fontFamily: "monospace", fontSize: "9px", letterSpacing: "2px", cursor: "pointer",
            }}>{s}</button>
          ))}
        </div>
      </div>

      {/* PROFILE */}
      {section === "PROFILE" && (
        <div>
          {/* Member card */}
          <div style={{ margin: 16, background: "#0A0A0A", border: `1px solid ${c.color}44`, position: "relative", overflow: "hidden" }}>
            <div style={{ height: 3, background: c.color, boxShadow: `0 0 12px ${c.color}66` }}/>
            <div style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: c.color, border: `2px solid ${c.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontFamily: "monospace", fontWeight: "bold", color: "#E8E8E0" }}>
                  {(member.handle || "F")[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "20px", fontFamily: "monospace", fontWeight: "bold", color: "#E8E8E0", letterSpacing: "3px", lineHeight: 1, marginBottom: 6 }}>{member.handle || "FACE"}</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: "9px", color: c.text, border: `1px solid ${c.color}`, padding: "2px 8px", fontFamily: "monospace", letterSpacing: "2px" }}>{c.label}</span>
                    <span style={{ fontSize: "9px", color: "#444", fontFamily: "monospace", letterSpacing: "1px" }}>PROSPECT</span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", borderTop: "1px solid #111", padding: "10px 0" }}>
                {[["FOUNDING", `#${member.foundingNumber}`], ["DROP", "001"], ["JOINED", new Date().toLocaleDateString("en-AU", { month: "short", year: "numeric" }).toUpperCase()]].map(([l, v], i) => (
                  <div key={l} style={{ flex: 1, textAlign: "center", borderRight: i < 2 ? "1px solid #111" : "none" }}>
                    <div style={{ fontSize: "7px", color: "#2A2A2A", letterSpacing: "2px", fontFamily: "monospace", marginBottom: 3 }}>{l}</div>
                    <div style={{ fontSize: "11px", color: "#E8E8E0", fontFamily: "monospace", letterSpacing: "2px" }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ritual preference */}
          <div style={{ padding: "0 16px 16px" }}>
            <div style={{ fontSize: "9px", color: "#222", letterSpacing: "3px", fontFamily: "monospace", marginBottom: 10 }}>RITUAL PREFERENCE</div>
            <div style={{ background: "#0A0A0A", border: `1px solid ${GOLD}22`, borderLeft: `3px solid ${GOLD}44`, padding: "12px 14px" }}>
              <div style={{ fontSize: "11px", color: GOLD, fontFamily: "monospace", letterSpacing: "2px", marginBottom: 4 }}>
                {member.ritual === "MORNING" ? "MORNING ONLY" : member.ritual === "FULL" ? "FULL RITUAL" : "UNDECIDED"}
              </div>
              <div style={{ fontSize: "8px", color: "#444", fontFamily: "monospace", letterSpacing: "1px", lineHeight: 1.8 }}>
                {member.ritual === "MORNING" ? "$55/mo locked" : member.ritual === "FULL" ? "$75/mo locked" : "Update when stacks launch"}<br/>
                Price locked at join rate. Forever.
              </div>
            </div>
          </div>

          {/* Codex entry */}
          <div style={{ padding: "0 16px 16px" }}>
            <div onClick={() => setShowCodex(true)} style={{
              background: "#0A0A0A", border: `1px solid ${GOLD}33`, borderLeft: `3px solid ${GOLD}`,
              padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer",
            }}>
              <div>
                <div style={{ fontSize: "11px", color: GOLD, fontFamily: "monospace", letterSpacing: "3px", marginBottom: 3 }}>CODEX</div>
                <div style={{ fontSize: "8px", color: "#444", fontFamily: "monospace", letterSpacing: "1px" }}>Everything you need to know.</div>
              </div>
              <span style={{ fontSize: "16px", color: `${GOLD}66` }}>›</span>
            </div>
          </div>
        </div>
      )}

      {/* ORDER */}
      {section === "ORDER" && (
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: "9px", color: "#222", letterSpacing: "3px", fontFamily: "monospace", marginBottom: 12 }}>VESSEL SHIPMENT</div>
          <div style={{ background: "#0A0A0A", border: "1px solid #141414", borderLeft: `2px solid ${ORDER_STATUS_COLORS[member.orderStatus] || "#2A2A2A"}`, padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: "11px", color: "#E8E8E0", fontFamily: "monospace", letterSpacing: "1px", marginBottom: 4 }}>DROP 001 VESSEL</div>
                <div style={{ fontSize: "9px", color: "#444", fontFamily: "monospace", letterSpacing: "1px" }}>FOUNDING MEMBER #{member.foundingNumber}</div>
              </div>
              <div style={{ fontSize: "10px", color: ORDER_STATUS_COLORS[member.orderStatus] || "#444", fontFamily: "monospace", letterSpacing: "2px" }}>
                {member.orderStatus || "PROCESSING"}
              </div>
            </div>

            {/* Status bar */}
            <div style={{ display: "flex", gap: 1, marginBottom: 10 }}>
              {["PROCESSING", "PACKED", "IN TRANSIT", "DELIVERED"].map((status, i) => {
                const statuses = ["PROCESSING", "PACKED", "IN TRANSIT", "DELIVERED"];
                const currentIdx = statuses.indexOf(member.orderStatus || "PROCESSING");
                const isActive = i <= currentIdx;
                return (
                  <div key={status} style={{ flex: 1, height: 3, background: isActive ? (ORDER_STATUS_COLORS[status]) : "#111", transition: "background 0.3s" }}/>
                );
              })}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "7px", color: "#1A1A1A", fontFamily: "monospace", letterSpacing: "0.5px", marginBottom: 12 }}>
              <span>PROCESSING</span><span>PACKED</span><span>IN TRANSIT</span><span>DELIVERED</span>
            </div>

            {member.trackingNumber ? (
              <div style={{ fontSize: "9px", color: "#2A2A2A", fontFamily: "monospace", letterSpacing: "1px" }}>
                TRACKING: {member.trackingNumber}
              </div>
            ) : (
              <div style={{ fontSize: "8px", color: "#1A1A1A", fontFamily: "monospace", letterSpacing: "1px" }}>
                Tracking number added when dispatched.
              </div>
            )}
          <div style={{ marginTop: 12 }}>
            <button
              onClick={() => window.location.href = `mailto:support@stayskold.com?subject=Order Enquiry — Founding Member %23${member.foundingNumber}&body=Hi SKOLD team, I have a question about my order.`}
              style={{
                width: "100%", padding: "10px 0", background: "transparent",
                border: "1px solid #1A1A1A", color: "#444",
                fontFamily: "monospace", fontSize: "9px",
                letterSpacing: "2px", cursor: "pointer",
              }}>
              EMAIL SUPPORT
            </button>
          </div>
          </div>

          <div style={{ marginTop: 16, padding: "12px 14px", background: "#0A0A0A", border: "1px solid #111" }}>
            <div style={{ fontSize: "9px", color: "#333", fontFamily: "monospace", letterSpacing: "2px", marginBottom: 4 }}>QUESTIONS ABOUT YOUR ORDER</div>
            <div style={{ fontSize: "8px", color: "#2A2A2A", fontFamily: "monospace", letterSpacing: "1px", lineHeight: 1.8 }}>
              Email the team — <span style={{ color: GOLD }}>support@stayskold.com</span>
            </div>
          </div>
        </div>
      )}

      {/* MEMBERSHIP */}
      {section === "MEMBERSHIP" && (
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: "9px", color: "#222", letterSpacing: "3px", fontFamily: "monospace", marginBottom: 12 }}>YOUR MEMBERSHIP</div>

          {/* Crew */}
          <div style={{ background: "#0A0A0A", border: `1px solid ${c.color}33`, borderLeft: `3px solid ${c.color}`, padding: "14px 16px", marginBottom: 8 }}>
            <div style={{ fontSize: "9px", color: "#444", letterSpacing: "3px", fontFamily: "monospace", marginBottom: 4 }}>CREW</div>
            <div style={{ fontSize: "14px", color: c.text, letterSpacing: "2px", fontFamily: "monospace", marginBottom: 3 }}>{c.label}</div>
            <div style={{ fontSize: "8px", color: "#333", fontFamily: "monospace", letterSpacing: "1px" }}>{c.stack}</div>
          </div>

          {/* Training style */}
          <div style={{ background: "#0A0A0A", border: "1px solid #141414", padding: "12px 14px", marginBottom: 8 }}>
            <div style={{ fontSize: "9px", color: "#444", letterSpacing: "2px", fontFamily: "monospace", marginBottom: 3 }}>TRAINING STYLE</div>
            <div style={{ fontSize: "11px", color: "#E8E8E0", fontFamily: "monospace", letterSpacing: "1px" }}>{member.trainingStyle || "—"}</div>
          </div>

          {/* Goal */}
          <div style={{ background: "#0A0A0A", border: "1px solid #141414", padding: "12px 14px", marginBottom: 8 }}>
            <div style={{ fontSize: "9px", color: "#444", letterSpacing: "2px", fontFamily: "monospace", marginBottom: 3 }}>GOAL</div>
            <div style={{ fontSize: "11px", color: "#E8E8E0", fontFamily: "monospace", letterSpacing: "1px" }}>{member.goal || "—"}</div>
          </div>

          {/* Dietary */}
          <div style={{ background: "#0A0A0A", border: "1px solid #141414", padding: "12px 14px", marginBottom: 16 }}>
            <div style={{ fontSize: "9px", color: "#444", letterSpacing: "2px", fontFamily: "monospace", marginBottom: 3 }}>DIETARY</div>
            <div style={{ fontSize: "11px", color: "#E8E8E0", fontFamily: "monospace", letterSpacing: "1px" }}>{member.dietary || "NONE"}</div>
          </div>

          {/* SKOLD Station teaser */}
          <div style={{ background: "#0A0A0A", border: "1px solid #0F0F0F", padding: "14px 16px", marginBottom: 16, opacity: 0.4 }}>
            <div style={{ fontSize: "10px", color: "#2A2A2A", fontFamily: "monospace", letterSpacing: "2px", marginBottom: 4 }}>SKOLD STATION</div>
            <div style={{ fontSize: "8px", color: "#1A1A1A", fontFamily: "monospace", letterSpacing: "1px", lineHeight: 1.7 }}>
              Rook the Grim is building something.<br/>You'll know when it's ready.
            </div>
          </div>

          {/* Settings */}
          <div style={{ fontSize: "9px", color: "#222", letterSpacing: "3px", fontFamily: "monospace", marginBottom: 10 }}>SETTINGS</div>
          {["NOTIFICATION PREFERENCES", "CONTACT SKOLD"].map(item => (
            <div key={item} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #0A0A0A", cursor: "pointer" }}
              onClick={() => { if (item === "CONTACT SKOLD") window.location.href = "mailto:support@stayskold.com"; }}>
              <span style={{ fontSize: "10px", color: "#333", fontFamily: "monospace", letterSpacing: "1px" }}>{item}</span>
              <span style={{ fontSize: "10px", color: "#1A1A1A" }}>›</span>
            </div>
          ))}
          <div style={{ marginTop: 20, textAlign: "center", fontSize: "9px", color: "#1E1E1E", fontFamily: "monospace", letterSpacing: "2px", cursor: "pointer", padding: "10px 0" }}>
            SIGN OUT
          </div>
        </div>
      )}

      {/* CODEX */}
      {showCodex && (
        <div style={{ position: "fixed", inset: 0, background: BG, zIndex: 400, display: "flex", flexDirection: "column", fontFamily: "monospace", overflowY: "auto" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #111", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: BG, zIndex: 10 }}>
            <div>
              <div style={{ fontSize: "18px", letterSpacing: "4px", fontWeight: "bold", color: "#E8E8E0" }}>CODEX</div>
              <div style={{ fontSize: "9px", color: "#333", letterSpacing: "2px", marginTop: 1 }}>EVERYTHING YOU NEED TO KNOW</div>
            </div>
            <button onClick={() => setShowCodex(false)} style={{ background: "none", border: "none", color: "#444", fontSize: "20px", cursor: "pointer" }}>×</button>
          </div>

          <div style={{ padding: "12px 20px", borderBottom: "1px solid #0F0F0F", display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ fontSize: "8px", color: GOLD, letterSpacing: "2px", flexShrink: 0, marginTop: 2 }}>ROOK //</span>
            <span style={{ fontSize: "11px", color: "#555", lineHeight: 1.65, letterSpacing: "0.3px" }}>Eight things. Read them once. The app will make sense.</span>
          </div>

          {CODEX_SECTIONS.map((s, i) => (
            <div key={s.title} style={{ borderBottom: "1px solid #0A0A0A" }}>
              <div onClick={() => setOpenCodex(openCodex === i ? null : i)} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 20px", cursor: "pointer",
                background: openCodex === i ? "#0C0C0C" : "transparent",
                borderLeft: `2px solid ${openCodex === i ? GOLD : "transparent"}`,
              }}>
                <span style={{ fontSize: "11px", color: openCodex === i ? "#E8E8E0" : "#555", letterSpacing: "2px" }}>{s.title}</span>
                <span style={{ fontSize: "14px", color: openCodex === i ? GOLD : "#2A2A2A", transform: openCodex === i ? "rotate(45deg)" : "none", transition: "transform 0.2s", display: "block" }}>+</span>
              </div>
              {openCodex === i && (
                <div style={{ padding: "0 20px 16px 22px" }}>
                  <p style={{ margin: 0, fontSize: "11px", color: "#666", lineHeight: 1.8, letterSpacing: "0.3px" }}>{s.body}</p>
                </div>
              )}
            </div>
          ))}

          <div style={{ padding: "20px", borderTop: "1px solid #0F0F0F", background: "#0A0A0A" }}>
            <div style={{ fontSize: "9px", color: "#333", letterSpacing: "1px", lineHeight: 1.9 }}>
              Still unsure? Email the team.<br/>
              <span style={{ color: GOLD, letterSpacing: "0.5px" }}>support@stayskold.com</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BOTTOM NAV
// ═══════════════════════════════════════════════════════════════════════════════
const NAV = [
  { id: "home",    label: "HOME",    icon: "◈" },
  { id: "signal",  label: "SIGNAL",  icon: "◉" },
  { id: "skocial", label: "SKOCIAL", icon: "◎" },
  { id: "store",   label: "STORE",   icon: "◧" },
  { id: "me",      label: "ME",      icon: "◫" },
];

function BottomNav({ active, setActive }) {
  return (
    <div style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 440, background: "#060606", borderTop: "1px solid #111",
      display: "flex", justifyContent: "space-around", padding: "10px 0 18px", zIndex: 50,
    }}>
      {NAV.map(tab => (
        <button key={tab.id} onClick={() => setActive(tab.id)} style={{
          background: "none", border: "none", display: "flex", flexDirection: "column",
          alignItems: "center", gap: 3, cursor: "pointer", padding: "0 8px",
        }}>
          <span style={{ fontSize: "16px", color: active === tab.id ? "#E8E8E0" : "#2A2A2A", transition: "color 0.2s" }}>{tab.icon}</span>
          <span style={{ fontSize: "7px", letterSpacing: "1.5px", color: active === tab.id ? "#E8E8E0" : "#1E1E1E", fontFamily: "monospace" }}>{tab.label}</span>
          {active === tab.id && <div style={{ width: 4, height: 1, background: "#E8E8E0", marginTop: 1 }}/>}
        </button>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [stage, setStage]         = useState("gate");
  const [foundingNumber, setFN]   = useState(null);
  const [member, setMember]       = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [tabFade, setTabFade]     = useState(true);

  const switchTab = (tab) => {
    setTabFade(false);
    setTimeout(() => { setActiveTab(tab); setTabFade(true); }, 80);
  };

  if (stage === "gate")       return <FoundingGate onValid={(n) => { setFN(n); setStage("register"); }}/>;
  if (stage === "register")   return <Registration foundingNumber={foundingNumber} onComplete={(data) => { setMember(data); setStage("initiation"); }}/>;
  if (stage === "initiation") return <Initiation member={member} onComplete={() => setStage("app")}/>;

  return (
    <div style={{ background: BG, minHeight: "100vh", maxWidth: 440, margin: "0 auto", color: "#E8E8E0", position: "relative", overflowX: "hidden" }}>
      <CRTOverlay/>
      <div style={{ opacity: tabFade ? 1 : 0, transition: "opacity 0.12s ease", overflowY: "auto", minHeight: "100vh" }}>
        {activeTab === "home"    && <HomeTab   member={member}/>}
        {activeTab === "signal"  && (
          <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #0F0F0F" }}>
              <div style={{ fontSize: "18px", letterSpacing: "4px", fontWeight: "bold", color: "#E8E8E0", fontFamily: "monospace" }}>SIGNAL</div>
            </div>
            <ComingSoon title="SKOLD SIGNAL" rookLine={ROOK_LINES.signal} drop="DROP 002"/>
          </div>
        )}
        {activeTab === "skocial" && (
          <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #0F0F0F" }}>
              <div style={{ fontSize: "18px", letterSpacing: "4px", fontWeight: "bold", color: "#E8E8E0", fontFamily: "monospace" }}>SKOCIAL</div>
            </div>
            <ComingSoon title="SKOCIAL" rookLine={ROOK_LINES.skocial} drop="DROP 002"/>
          </div>
        )}
        {activeTab === "store"   && <StoreTab  member={member}/>}
        {activeTab === "me"      && <MeTab     member={member}/>}
      </div>
      <BottomNav active={activeTab} setActive={switchTab}/>
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
