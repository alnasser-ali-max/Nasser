import { useState, useEffect, useRef } from "react";

/* ── Intersection hook ── */
const useInView = (threshold = 0.1) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
};

/* ── Animated counter ── */
const Counter = ({ target, suffix = "", prefix = "", duration = 2000, decimals = 0 }) => {
  const [val, setVal] = useState(0);
  const [ref, inView] = useInView(0.2);
  useEffect(() => {
    if (!inView) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setVal(+(target * ease).toFixed(decimals));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration, decimals]);
  return (
    <span ref={ref}>
      {prefix}{decimals > 0 ? val.toFixed(decimals) : Math.floor(val)}{suffix}
    </span>
  );
};

/* ── Fade in on scroll ── */
const FadeIn = ({ children, delay = 0, from = "bottom" }) => {
  const [ref, inView] = useInView();
  const transforms = { bottom: "translateY(40px)", left: "translateX(-40px)", right: "translateX(40px)", scale: "scale(0.88)" };
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "none" : (transforms[from] || transforms.bottom),
      transition: `opacity 0.75s cubic-bezier(.22,1,.36,1) ${delay}s, transform 0.75s cubic-bezier(.22,1,.36,1) ${delay}s`,
    }}>
      {children}
    </div>
  );
};

/* ── Glowing divider ── */
const Divider = () => {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      height: "1px", margin: "14px 0 28px",
      background: "linear-gradient(90deg, transparent, #7C3AED, #A78BFA, #38BDF8, #A78BFA, #7C3AED, transparent)",
      width: inView ? "100%" : "0%",
      transition: "width 1.3s cubic-bezier(.22,1,.36,1)",
      boxShadow: inView ? "0 0 10px rgba(167,139,250,0.4)" : "none",
    }} />
  );
};

/* ── Stat card with animated number ── */
const StatCard = ({ value, suffix, prefix, label, color, delay, decimals }) => {
  const [hov, setHov] = useState(false);
  return (
    <FadeIn delay={delay} from="scale">
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background: hov
            ? `linear-gradient(135deg, ${color}22, ${color}11)`
            : "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
          border: `1px solid ${hov ? color : "rgba(255,255,255,0.1)"}`,
          borderRadius: "16px",
          padding: "22px 20px",
          textAlign: "center",
          transition: "all 0.4s ease",
          boxShadow: hov ? `0 8px 32px ${color}33` : "none",
          transform: hov ? "translateY(-4px)" : "none",
          cursor: "default",
          minWidth: "130px",
          flex: "1",
        }}
      >
        <div style={{
          fontSize: "clamp(26px,4vw,34px)", fontWeight: 800,
          color, fontFamily: "'Courier New', monospace",
          textShadow: hov ? `0 0 20px ${color}88` : "none",
          transition: "text-shadow 0.4s",
        }}>
          <Counter target={value} suffix={suffix} prefix={prefix} decimals={decimals} />
        </div>
        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", letterSpacing: "0.12em", marginTop: "6px", textTransform: "uppercase" }}>
          {label}
        </div>
      </div>
    </FadeIn>
  );
};

/* ── Skill pill ── */
const SkillPill = ({ skill, delay, color }) => {
  const [ref, inView] = useInView();
  const [hov, setHov] = useState(false);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? `linear-gradient(135deg, ${color}33, ${color}11)` : "rgba(255,255,255,0.04)",
        border: `1px solid ${hov ? color : "rgba(255,255,255,0.1)"}`,
        color: hov ? color : "rgba(255,255,255,0.65)",
        padding: "9px 18px", borderRadius: "100px",
        fontSize: "13px", letterSpacing: "0.03em",
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "scale(0.8) translateY(10px)",
        transition: `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s, background 0.3s, border-color 0.3s, color 0.3s, box-shadow 0.3s`,
        boxShadow: hov ? `0 4px 20px ${color}44` : "none",
        cursor: "default", whiteSpace: "nowrap",
      }}
    >
      {skill}
    </div>
  );
};

/* ── KPI badge ── */
const KPIBadge = ({ label, color = "#38BDF8" }) => (
  <span style={{
    display: "inline-block",
    background: `${color}18`,
    border: `1px solid ${color}55`,
    color,
    padding: "4px 13px",
    borderRadius: "100px",
    fontSize: "11px", letterSpacing: "0.07em",
    margin: "3px 4px 3px 0",
    fontFamily: "'Courier New', monospace",
    fontWeight: 600,
  }}>{label}</span>
);

/* ── Experience card ── */
const ExperienceCard = ({ role, company, period, location, bullets, kpis, delay, accent }) => {
  const [hov, setHov] = useState(false);
  return (
    <FadeIn delay={delay} from="left">
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background: hov ? "rgba(255,255,255,0.04)" : "transparent",
          borderLeft: `3px solid ${hov ? accent : accent + "55"}`,
          borderRadius: "0 12px 12px 0",
          paddingLeft: "24px", paddingTop: "4px", paddingBottom: "4px",
          marginBottom: "44px",
          transition: "all 0.4s ease",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginBottom: "4px" }}>
          <h3 style={{
            fontSize: "clamp(16px,2.5vw,20px)", color: "#F1F5F9",
            fontFamily: "'Georgia', serif", fontWeight: 700, margin: 0,
            letterSpacing: "0.01em",
            textShadow: hov ? `0 0 20px ${accent}66` : "none",
            transition: "text-shadow 0.4s",
          }}>{role}</h3>
          <span style={{
            fontSize: "11px", color: "rgba(255,255,255,0.35)",
            fontFamily: "'Courier New', monospace", letterSpacing: "0.1em", paddingTop: "4px",
          }}>{period}</span>
        </div>
        <div style={{
          fontSize: "13px", color: accent, letterSpacing: "0.08em",
          marginBottom: "14px", fontFamily: "'Courier New', monospace", fontWeight: 600,
        }}>
          {company} — {location}
        </div>
        <ul style={{ margin: 0, paddingLeft: "18px" }}>
          {bullets.map((b, i) => (
            <li key={i} style={{
              color: "rgba(255,255,255,0.55)", fontSize: "14px",
              lineHeight: "1.85", marginBottom: "5px",
            }}>{b}</li>
          ))}
        </ul>
        {kpis?.length > 0 && (
          <div style={{ marginTop: "14px" }}>
            {kpis.map((k, i) => <KPIBadge key={i} label={k} color={accent} />)}
          </div>
        )}
      </div>
    </FadeIn>
  );
};

/* ── Section wrapper ── */
const Section = ({ title, icon, children, delay = 0 }) => (
  <FadeIn delay={delay}>
    <div style={{ marginBottom: "60px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
        <span style={{ fontSize: "14px" }}>{icon}</span>
        <h2 style={{
          fontSize: "10px", letterSpacing: "0.35em", color: "#A78BFA",
          fontFamily: "'Courier New', monospace", textTransform: "uppercase",
          margin: 0, fontWeight: 500,
        }}>{title}</h2>
      </div>
      <Divider />
      {children}
    </div>
  </FadeIn>
);

/* ── Floating orbs background ── */
const Orbs = () => (
  <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
    <div style={{
      position: "absolute", top: "-10%", left: "-10%",
      width: "55vw", height: "55vw", borderRadius: "50%",
      background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
      animation: "orbFloat1 12s ease-in-out infinite alternate",
    }} />
    <div style={{
      position: "absolute", bottom: "10%", right: "-10%",
      width: "45vw", height: "45vw", borderRadius: "50%",
      background: "radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 70%)",
      animation: "orbFloat2 15s ease-in-out infinite alternate",
    }} />
    <div style={{
      position: "absolute", top: "50%", left: "40%",
      width: "30vw", height: "30vw", borderRadius: "50%",
      background: "radial-gradient(circle, rgba(244,114,182,0.07) 0%, transparent 70%)",
      animation: "orbFloat3 10s ease-in-out infinite alternate",
    }} />
    <style>{`
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: #080B14; }
      @keyframes orbFloat1 { 0%{transform:translate(0,0)} 100%{transform:translate(6%,8%)} }
      @keyframes orbFloat2 { 0%{transform:translate(0,0)} 100%{transform:translate(-5%,-6%)} }
      @keyframes orbFloat3 { 0%{transform:translate(0,0)} 100%{transform:translate(-4%,5%)} }
      @keyframes shimmer {
        0%{background-position:-200% center}
        100%{background-position:200% center}
      }
      @keyframes spinRing {
        from{transform:rotate(0deg)}
        to{transform:rotate(360deg)}
      }
      @keyframes spinRingR {
        from{transform:rotate(0deg)}
        to{transform:rotate(-360deg)}
      }
      @keyframes pulse {
        0%,100%{box-shadow:0 0 0 0 rgba(124,58,237,0.4)}
        50%{box-shadow:0 0 0 14px rgba(124,58,237,0)}
      }
      @keyframes blink {
        0%,100%{opacity:1} 50%{opacity:0.3}
      }
      ::-webkit-scrollbar{width:4px}
      ::-webkit-scrollbar-track{background:#080B14}
      ::-webkit-scrollbar-thumb{background:linear-gradient(#7C3AED,#38BDF8);border-radius:2px}
    `}</style>
  </div>
);

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: -200, y: -200 });

  useEffect(() => {
    setTimeout(() => setLoaded(true), 80);
    const onScroll = () => setScrollY(window.scrollY);
    const onMove = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("scroll", onScroll);
    window.addEventListener("mousemove", onMove);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("mousemove", onMove); };
  }, []);

  const skills = [
    "Branch Operations Management","P&L Control","KPI Management",
    "Team Leadership","Business Continuity","Customer Experience",
    "Cost Optimization","Inventory Control","Cash Flow Management",
    "Process Improvement","Govt Platforms & Compliance","Excel (Advanced)",
    "Power BI","Negotiation & Persuasion",
  ];
  const pillColors = ["#A78BFA","#38BDF8","#F472B6","#34D399","#FB923C"];

  return (
    <div style={{ minHeight: "100vh", background: "#080B14", color: "#F1F5F9", fontFamily: "'Georgia', serif", position: "relative", overflowX: "hidden" }}>
      <Orbs />

      {/* Cursor glow */}
      <div style={{
        position: "fixed", pointerEvents: "none", zIndex: 999,
        width: "300px", height: "300px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)",
        transform: `translate(${cursorPos.x - 150}px, ${cursorPos.y - 150}px)`,
        transition: "transform 0.12s ease",
      }} />

      {/* Progress bar */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: "2px", zIndex: 200,
        background: "linear-gradient(90deg, #7C3AED, #A78BFA, #38BDF8, #F472B6)",
        opacity: scrollY > 60 ? 1 : 0,
        transition: "opacity 0.4s",
        boxShadow: "0 0 8px rgba(167,139,250,0.6)",
      }} />

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 28px 100px", position: "relative", zIndex: 1 }}>

        {/* ══ HERO ══ */}
        <div style={{
          padding: "90px 0 56px",
          opacity: loaded ? 1 : 0,
          transform: loaded ? "none" : "translateY(-30px)",
          transition: "all 1.1s cubic-bezier(.22,1,.36,1)",
        }}>
          {/* Profile photo — wide banner */}
          <div style={{
            width: "100%", maxWidth: "560px",
            height: "280px",
            borderRadius: "20px",
            overflow: "hidden",
            marginBottom: "40px",
            position: "relative",
            border: "1px solid rgba(167,139,250,0.25)",
            boxShadow: "0 0 40px rgba(124,58,237,0.2), 0 0 80px rgba(56,189,248,0.08)",
          }}>
            <img
              src="/photo.jpg"
              alt="Nasser Ali Bamuilaa"
              style={{
                width: "100%", height: "100%",
                objectFit: "cover",
                objectPosition: "center 15%",
                display: "block",
              }}
            />
            {/* gradient overlay bottom */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              height: "60%",
              background: "linear-gradient(to top, #080B14 0%, transparent 100%)",
            }} />
            {/* gradient overlay sides */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to right, #080B1488 0%, transparent 20%, transparent 80%, #080B1488 100%)",
            }} />
          </div>

          <div style={{
            fontSize: "10px", letterSpacing: "0.45em", marginBottom: "16px",
            fontFamily: "'Courier New', monospace",
            background: "linear-gradient(90deg, #7C3AED, #38BDF8)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            CURRICULUM VITAE
          </div>

          <h1 style={{
            fontSize: "clamp(42px, 8vw, 72px)", fontWeight: 300,
            letterSpacing: "0.06em", margin: "0 0 6px", lineHeight: 1.05,
            background: "linear-gradient(120deg, #E2E8F0 0%, #A78BFA 35%, #38BDF8 65%, #F472B6 100%)",
            backgroundSize: "300% auto",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            animation: "shimmer 6s linear infinite",
          }}>
            NASSER ALI<br /><strong style={{ fontWeight: 800 }}>BAMUILAA</strong>
          </h1>

          <div style={{
            fontSize: "12px", letterSpacing: "0.3em",
            fontFamily: "'Courier New', monospace", marginTop: "14px", marginBottom: "10px",
            color: "rgba(255,255,255,0.35)",
          }}>
            <span style={{ color: "#A78BFA", animation: "blink 2s infinite" }}>▮</span>
            {"  "}OPERATIONS MANAGER{"  "}
            <span style={{ color: "#38BDF8", animation: "blink 2s infinite 1s" }}>▮</span>
          </div>

          <div style={{ height: "1px", background: "linear-gradient(90deg, #7C3AED44, #38BDF844, transparent)", margin: "24px 0" }} />

          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {[
              { text: "Jeddah, Saudi Arabia", color: "#A78BFA", href: null },
              { text: "Nass3r_ali@icloud.com", color: "#38BDF8", href: "mailto:Nass3r_ali@icloud.com" },
              { text: "+966-555430206", color: "#F472B6", href: "tel:+966555430206" },
            ].map((c, i) => (
              c.href ? (
                <a key={i} href={c.href} style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  color: "rgba(255,255,255,0.45)", fontSize: "13px",
                  fontFamily: "'Courier New', monospace",
                  textDecoration: "none", cursor: "pointer",
                  transition: "color 0.3s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.color = c.color; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}
                >
                  <span style={{ color: c.color, fontSize: "8px" }}>●</span>
                  {c.text}
                </a>
              ) : (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  color: "rgba(255,255,255,0.45)", fontSize: "13px",
                  fontFamily: "'Courier New', monospace",
                }}>
                  <span style={{ color: c.color, fontSize: "8px" }}>●</span>
                  {c.text}
                </div>
              )
            ))}
          </div>
        </div>

        {/* ══ KEY STATS ══ */}
        <FadeIn delay={0.1}>
          <div style={{
            display: "flex", gap: "14px", flexWrap: "wrap",
            marginBottom: "64px",
            padding: "28px", borderRadius: "20px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(10px)",
          }}>
            <StatCard value={10} prefix="SAR " suffix="M+" label="Monthly Revenue" color="#A78BFA" delay={0.15} />
            <StatCard value={1000} suffix="+" label="Monthly Customers" color="#38BDF8" delay={0.2} />
            <StatCard value={98} suffix="%" label="Financial Accuracy" color="#34D399" delay={0.25} />
            <StatCard value={2300} prefix="SAR " suffix="+" label="Daily Sales (Wk1)" color="#F472B6" delay={0.3} />
            <StatCard value={9.7} suffix="/10" label="Academic Score" color="#FB923C" delay={0.35} decimals={1} />
          </div>
        </FadeIn>

        {/* ══ SUMMARY ══ */}
        <Section title="Professional Summary" icon="◈" delay={0.1}>
          <div style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(56,189,248,0.05))",
            border: "1px solid rgba(167,139,250,0.2)",
            borderRadius: "14px", padding: "24px 28px",
          }}>
            <p style={{
              fontSize: "15px", lineHeight: "1.9",
              color: "rgba(255,255,255,0.65)", fontStyle: "italic", margin: 0,
            }}>
              Operations professional with experience in founding and managing restaurant operations, overseeing F&amp;B processes, staffing, inventory, and customer service. Strong in KPI management, financial accuracy, compliance, and cost control. Skilled in influencing teams, improving efficiency, and driving sales performance in fast-paced environments.
            </p>
          </div>
        </Section>

        {/* ══ EXPERIENCE ══ */}
        <Section title="Experience" icon="◉" delay={0.1}>
          <ExperienceCard
            delay={0.1} accent="#A78BFA"
            role="Founding Operations Manager"
            company="Madghout Takeaway Restaurant"
            period="September 2025 – April 2026"
            location="Jeddah"
            bullets={[
              "Launched full F&B operation from zero and established stable daily operations within first month.",
              "Achieved SAR 2,300+ daily sales in first week of launch.",
              "Built customer base of 1,000+ monthly active customers within 3 months.",
              "Maintained full business continuity during banking disruption using supplier credit strategy.",
              "Improved workflow speed through POS setup, supplier onboarding, and daily staffing routines.",
            ]}
            kpis={["Revenue Growth: +60–80%", "1,000+ Monthly Customers", "100% Operational Uptime"]}
          />
          <ExperienceCard
            delay={0.15} accent="#38BDF8"
            role="Administrative & Accounting Officer"
            company="Alnaiem Catering & Restaurant Groups"
            period="March 2016 – May 2025"
            location="Jeddah"
            bullets={[
              "Managed SAR 10M+ monthly revenue environment.",
              "Daily cash closing and financial reconciliation with high accuracy.",
              "Reduced discrepancies to near-zero levels through strict control and continuous monitoring.",
              "Streamlined month-end reporting in Excel; cross-checked POS, supplier, and cash records.",
            ]}
            kpis={["Financial Accuracy >98%", "Compliance 100%", "Near-Zero Cash Variance"]}
          />
          <ExperienceCard
            delay={0.2} accent="#F472B6"
            role="Branch Manager"
            company="E-tech Store"
            period="July 2013 – December 2015"
            location="Jeddah"
            bullets={[
              "Managed customer journey and daily operations.",
              "Improved service efficiency and staff productivity.",
              "Handled cash operations and reporting accuracy.",
            ]}
            kpis={[]}
          />
        </Section>

        {/* ══ EDUCATION ══ */}
        <Section title="Education & Certifications" icon="◎" delay={0.1}>
          {[
            { title: "Advanced Diploma – Network Engineering", org: "TVTC • Jeddah • 2013", badge: "9.7 / 10", color: "#34D399" },
            { title: "CCNA – Cisco Certified Network Associate", org: "ALKHALEEJ TRAINING & EDUCATION • 2013", badge: "Certified", color: "#38BDF8" },
            { title: "English – Upper Intermediate", org: "Wall Street English", badge: "B2", color: "#A78BFA" },
          ].map((e, i) => (
            <FadeIn key={i} delay={0.1 + i * 0.08} from="left">
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                flexWrap: "wrap", gap: "12px",
                padding: "18px 20px", borderRadius: "12px", marginBottom: "10px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                transition: "background 0.3s, border-color 0.3s",
              }}
                onMouseEnter={ev => { ev.currentTarget.style.background = `${e.color}11`; ev.currentTarget.style.borderColor = `${e.color}44`; }}
                onMouseLeave={ev => { ev.currentTarget.style.background = "rgba(255,255,255,0.03)"; ev.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
              >
                <div>
                  <div style={{ fontSize: "15px", color: "#F1F5F9", fontWeight: 600, marginBottom: "4px" }}>{e.title}</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", fontFamily: "'Courier New', monospace" }}>{e.org}</div>
                </div>
                <span style={{
                  background: `${e.color}22`, border: `1px solid ${e.color}66`,
                  color: e.color, padding: "5px 14px", borderRadius: "100px",
                  fontSize: "12px", fontFamily: "'Courier New', monospace", fontWeight: 700,
                }}>{e.badge}</span>
              </div>
            </FadeIn>
          ))}
        </Section>

        {/* ══ SKILLS ══ */}
        <Section title="Core Competencies" icon="✦" delay={0.1}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {skills.map((s, i) => (
              <SkillPill key={i} skill={s} delay={0.08 + i * 0.04} color={pillColors[i % pillColors.length]} />
            ))}
          </div>
        </Section>

        {/* Footer */}
        <FadeIn delay={0.2}>
          <div style={{
            textAlign: "center", paddingTop: "36px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            fontFamily: "'Courier New', monospace", fontSize: "11px",
            letterSpacing: "0.25em",
            background: "linear-gradient(90deg, #7C3AED, #A78BFA, #38BDF8, #F472B6)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            ✦  NASSER ALI BAMUILAA  ✦
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
