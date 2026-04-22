import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  RiIdCardLine,
  RiLockPasswordLine,
  RiMailLine,
  RiShieldCheckLine,
  RiEyeLine,
  RiEyeOffLine,
  RiSendPlaneLine,
  RiKeyLine,
  RiUserAddLine,
  RiLoginBoxLine,
  RiRefreshLine,
  RiCheckboxCircleLine,
  RiGraduationCapLine,
  RiBarChartBoxLine,
  RiSecurePaymentLine,
  RiFileListLine,
  RiArrowRightLine,
} from "react-icons/ri";
import * as auth from "../services/auth";

/* ══════════════════════════════════════════
   GLOBAL STYLES
══════════════════════════════════════════ */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap');

:root {
  --navy-deep:      #0b1120;
  --navy-mid:       #111d35;
  --navy-surface:   #162040;
  --navy-border:    #1e2d52;
  --gold:           #c9a84c;
  --gold-bright:    #e0be6f;
  --gold-dim:       #8a6e2f;
  --gold-glow:      rgba(201,168,76,0.12);
  --gold-hairline:  rgba(201,168,76,0.28);
  --text-primary:   #f0ead8;
  --text-muted:     #5a6e8c;
  --panel-bg:       #f5f3ed;
  --panel-card:     #ffffff;
  --panel-border:   #e0dbd2;
  --panel-input:    #f0ede6;
  --ink:            #0d1525;
  --ink-mid:        #3a4a62;
  --ink-light:      #8a96aa;
  --green:          #1f8a5e;
  --green-bg:       rgba(31,138,94,0.07);
  --red:            #b83232;
  --red-bg:         rgba(184,50,50,0.07);
  --font-display:   'Cormorant Garamond', Georgia, serif;
  --font-body:      'Outfit', sans-serif;
  --ease:           cubic-bezier(0.22,1,0.36,1);
  --shadow-card:    0 2px 4px rgba(0,0,0,0.04), 0 16px 56px rgba(0,0,0,0.13), 0 0 0 1px rgba(0,0,0,0.05);
  --shadow-btn:     0 4px 18px rgba(11,17,32,0.38);
}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body{height:100%;font-family:var(--font-body);background:var(--navy-deep);-webkit-font-smoothing:antialiased;overflow:hidden;}

/* Lock the whole layout to exactly the viewport */
.ef-wrap{display:flex;height:100vh;width:100vw;overflow:hidden;}

/* LEFT PANEL */
.ef-left{
  width:52%;background:var(--navy-deep);
  position:relative;display:flex;flex-direction:column;
  padding:36px 48px 24px;overflow:hidden;
  height:100vh;flex-shrink:0;
}
.ef-left::before{
  content:'';position:absolute;inset:0;
  background:radial-gradient(ellipse 80% 60% at 20% 80%,rgba(201,168,76,0.06) 0%,transparent 60%),
             radial-gradient(ellipse 60% 50% at 80% 10%,rgba(22,45,80,0.8) 0%,transparent 70%);
  pointer-events:none;
}
.ef-left::after{
  content:'';position:absolute;inset:0;
  background-image:repeating-linear-gradient(-55deg,transparent,transparent 80px,rgba(255,255,255,0.013) 80px,rgba(255,255,255,0.013) 81px);
  pointer-events:none;
}
.arc{position:absolute;border-radius:50%;pointer-events:none;border:1px solid rgba(201,168,76,0.06);}
.arc-1{width:620px;height:620px;bottom:-210px;left:-190px;}
.arc-2{width:430px;height:430px;bottom:-110px;left:-85px;border-color:rgba(201,168,76,0.04);}
.arc-3{width:210px;height:210px;top:55px;right:-65px;border-color:rgba(201,168,76,0.09);border-style:dashed;}

.brand{display:flex;align-items:center;gap:12px;position:relative;z-index:2;animation:fsDown .7s var(--ease) both;}
.brand-icon{
  width:40px;height:40px;
  background:linear-gradient(135deg,var(--gold) 0%,var(--gold-dim) 100%);
  border-radius:11px;display:flex;align-items:center;justify-content:center;
  box-shadow:0 4px 18px rgba(201,168,76,0.32);flex-shrink:0;
}
.brand-icon svg{width:20px;height:20px;color:#f0ead8;}
.brand-name{font-family:var(--font-display);color:var(--text-primary);font-size:20px;font-weight:600;letter-spacing:.5px;}

.gold-rule{position:relative;z-index:2;margin:28px 0 20px;display:flex;align-items:center;gap:14px;animation:fsDown .7s .1s var(--ease) both;}
.gold-rule::before{content:'';display:block;width:56px;height:1.5px;background:linear-gradient(90deg,var(--gold),transparent);}
.gold-rule::after{content:'';display:block;flex:1;height:1px;background:linear-gradient(90deg,rgba(201,168,76,0.18),transparent);}
.gold-rule-diamond{width:6px;height:6px;background:var(--gold);transform:rotate(45deg);flex-shrink:0;}

.hero-text{position:relative;z-index:2;animation:fsDown .7s .15s var(--ease) both;}
.college-eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--gold);font-weight:500;margin-bottom:12px;}
.college-eyebrow::before{content:'◆';font-size:6px;opacity:.7;}
.hero-text h1{font-family:var(--font-display);color:var(--text-primary);font-size:clamp(26px,2.6vw,40px);font-weight:600;line-height:1.15;margin-bottom:12px;font-style:italic;}
.hero-text h1 em{font-style:normal;color:var(--gold-bright);}
.hero-text p{color:var(--text-muted);font-size:13px;line-height:1.7;max-width:360px;font-weight:300;}

.stats-row{display:flex;gap:0;margin-top:24px;position:relative;z-index:2;animation:fsDown .7s .2s var(--ease) both;}
.stat-item{flex:1;padding:12px 0;border-top:1px solid var(--navy-border);position:relative;}
.stat-item:not(:last-child){margin-right:20px;}
.stat-item::before{content:'';position:absolute;top:-1px;left:0;width:0;height:1.5px;background:var(--gold);transition:width 1s var(--ease);}
.stat-item:hover::before{width:100%;}
.stat-number{font-family:var(--font-display);font-size:24px;font-weight:700;color:var(--text-primary);line-height:1;margin-bottom:3px;}
.stat-label{font-size:10px;color:var(--text-muted);letter-spacing:1.5px;text-transform:uppercase;font-weight:400;}

.features{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:20px;position:relative;z-index:2;animation:fsDown .7s .25s var(--ease) both;}
.feat-card{
  border:1px solid var(--navy-border);border-radius:12px;padding:12px 14px;
  background:rgba(255,255,255,0.025);transition:border-color .3s,background .3s,transform .25s var(--ease);
  cursor:default;position:relative;overflow:hidden;
}
.feat-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,var(--gold-glow) 0%,transparent 60%);opacity:0;transition:opacity .3s;}
.feat-card:hover{border-color:var(--gold-hairline);transform:translateY(-2px);}
.feat-card:hover::before{opacity:1;}
.feat-icon{
  width:28px;height:28px;border:1px solid var(--navy-border);border-radius:7px;
  display:flex;align-items:center;justify-content:center;margin-bottom:8px;
  color:var(--gold);position:relative;z-index:1;
}
.feat-icon svg{width:14px;height:14px;}
.feat-card strong{display:block;color:var(--text-primary);font-size:12px;font-weight:500;margin-bottom:2px;position:relative;z-index:1;}
.feat-card span{color:var(--text-muted);font-size:11px;font-weight:300;line-height:1.4;position:relative;z-index:1;}

.lf{
  margin-top:auto;position:relative;z-index:2;color:var(--text-muted);font-size:10.5px;letter-spacing:.4px;
  padding-top:16px;border-top:1px solid var(--navy-border);
  display:flex;align-items:center;justify-content:space-between;animation:fadeIn .7s .4s var(--ease) both;
  flex-shrink:0;
}
.lf-links{display:flex;gap:14px;}
.lf-links a{color:var(--text-muted);text-decoration:none;font-size:10.5px;transition:color .2s;}
.lf-links a:hover{color:var(--gold);}

/* RIGHT PANEL */
.ef-right{
  width:48%;background:var(--panel-bg);
  display:flex;align-items:flex-start;justify-content:center;
  padding:24px 32px;position:relative;
  height:100vh;overflow-y:auto;
}
.ef-right::before{
  content:'';position:absolute;inset:0;
  background-image:radial-gradient(circle at 80% 15%,rgba(201,168,76,0.07) 0%,transparent 50%),
                   radial-gradient(circle at 20% 90%,rgba(11,17,32,0.04) 0%,transparent 50%);
  pointer-events:none;
}
.watermark{
  position:absolute;bottom:12px;right:18px;font-family:var(--font-display);font-size:80px;
  font-weight:700;color:transparent;-webkit-text-stroke:1px rgba(11,17,32,0.055);
  line-height:1;user-select:none;pointer-events:none;letter-spacing:-4px;font-style:italic;z-index:0;
}

/* FORM CARD */
.form-card{
  background:var(--panel-card);border-radius:20px;padding:36px 38px;
  width:100%;max-width:428px;box-shadow:var(--shadow-card);
  position:relative;z-index:1;animation:cardRise .8s .1s var(--ease) both;
  border:1px solid var(--panel-border);margin:auto 0;
}
.form-card::before{
  content:'';position:absolute;top:0;left:28px;right:28px;height:3px;
  background:linear-gradient(90deg,transparent,var(--gold) 30%,var(--gold-bright) 50%,var(--gold) 70%,transparent);
  border-radius:0 0 4px 4px;
}

.fh{margin-bottom:20px;text-align:center;}
.fh-crest{
  width:46px;height:46px;
  background:linear-gradient(135deg,var(--navy-deep) 0%,var(--navy-mid) 100%);
  border-radius:12px;display:flex;align-items:center;justify-content:center;
  margin:0 auto 14px;box-shadow:0 4px 18px rgba(11,17,32,0.22);border:1px solid var(--navy-border);
  color:var(--gold);
}
.fh-crest svg{width:22px;height:22px;}
.fh h2{font-family:var(--font-display);font-size:26px;font-weight:600;color:var(--ink);margin-bottom:4px;}
.fh p{color:var(--ink-light);font-size:12.5px;font-weight:300;}

.fdiv{display:flex;align-items:center;gap:12px;margin-bottom:18px;}
.fdiv hr{flex:1;border:none;border-top:1px solid var(--panel-border);}
.fdiv-dot{width:5px;height:5px;background:var(--gold);border-radius:50%;}

/* FIELDS */
.field-group{display:flex;flex-direction:column;gap:12px;margin-bottom:4px;}
.field{display:flex;flex-direction:column;gap:5px;}
.field label{font-size:10px;font-weight:600;color:var(--ink-mid);letter-spacing:1.3px;text-transform:uppercase;}
.fi-wrap{position:relative;}

.fi-lead{
  position:absolute;left:12px;top:50%;transform:translateY(-50%);
  color:var(--ink-light);pointer-events:none;transition:color .2s;
  display:flex;align-items:center;
}
.fi-lead svg{width:15px;height:15px;}
.fi-wrap:focus-within .fi-lead{color:var(--navy-mid);}

.fi-trail{
  position:absolute;right:12px;top:50%;transform:translateY(-50%);
  color:var(--ink-light);cursor:pointer;transition:color .2s;
  display:flex;align-items:center;background:none;border:none;padding:2px;
}
.fi-trail svg{width:15px;height:15px;}
.fi-trail:hover{color:var(--ink-mid);}

.field input{
  width:100%;border:1.5px solid var(--panel-border);border-radius:10px;
  padding:11px 14px 11px 38px;font-family:var(--font-body);font-size:13.5px;
  color:var(--ink);background:var(--panel-input);outline:none;
  transition:border-color .2s,background .2s,box-shadow .2s;
}
.field input.has-trail{padding-right:40px;}
.field input:focus{border-color:var(--navy-deep);background:var(--panel-card);box-shadow:0 0 0 3px rgba(11,17,32,0.07);}
.field input::placeholder{color:var(--ink-light);font-weight:300;}
.field input.otp-input{letter-spacing:8px;font-weight:600;font-size:16px;text-align:center;padding-left:16px;}

.field-hint{
  display:flex;align-items:flex-start;gap:7px;font-size:11.5px;color:var(--gold-dim);
  margin-top:5px;padding:8px 11px;background:rgba(201,168,76,0.07);
  border-radius:8px;border-left:2px solid var(--gold);line-height:1.5;
  animation:fadeIn .2s var(--ease) both;
}
.field-hint svg{width:14px;height:14px;flex-shrink:0;margin-top:1px;color:var(--gold);}
.field-error{
  display:flex;align-items:flex-start;gap:7px;font-size:11.5px;color:var(--red);
  margin-top:5px;padding:8px 11px;background:var(--red-bg);
  border-radius:8px;border-left:2px solid var(--red);line-height:1.5;
  animation:fadeIn .2s var(--ease) both;
}
.field-error svg{width:14px;height:14px;flex-shrink:0;margin-top:1px;}

.otp-reveal{animation:otpReveal .35s var(--ease) both;}
@keyframes otpReveal{from{opacity:0;transform:translateY(-6px);}to{opacity:1;transform:translateY(0);}}

.otp-btn{
  display:flex;align-items:center;justify-content:center;gap:8px;
  width:100%;padding:10px;border:1.5px solid var(--navy-border);border-radius:10px;
  background:var(--panel-input);color:var(--ink-mid);font-family:var(--font-body);
  font-size:12.5px;font-weight:500;letter-spacing:.5px;cursor:pointer;
  transition:all .2s var(--ease);text-transform:uppercase;
}
.otp-btn svg{width:14px;height:14px;}
.otp-btn:hover:not(:disabled){border-color:var(--gold);color:var(--gold-dim);background:rgba(201,168,76,0.06);}
.otp-btn:disabled{opacity:.5;cursor:not-allowed;}
.otp-btn.sent{border-color:var(--green);color:var(--green);background:var(--green-bg);cursor:default;}

.submit-btn{
  display:flex;align-items:center;justify-content:center;gap:10px;
  width:100%;padding:13px;border:none;border-radius:11px;
  background:linear-gradient(135deg,var(--navy-deep) 0%,var(--navy-mid) 100%);
  color:var(--text-primary);font-family:var(--font-body);font-size:13.5px;
  font-weight:500;letter-spacing:.8px;text-transform:uppercase;cursor:pointer;
  margin-top:16px;position:relative;overflow:hidden;box-shadow:var(--shadow-btn);
  transition:transform .2s var(--ease),box-shadow .2s;
}
.submit-btn svg{width:15px;height:15px;flex-shrink:0;}
.submit-btn::before{
  content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;
  background:linear-gradient(90deg,transparent,rgba(201,168,76,0.18),transparent);
  transform:skewX(-20deg);transition:left .6s var(--ease);
}
.submit-btn:hover::before{left:160%;}
.submit-btn::after{
  content:'';position:absolute;top:0;left:20%;right:20%;height:1px;
  background:linear-gradient(90deg,transparent,var(--gold-bright),transparent);opacity:.45;
}
.submit-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 26px rgba(11,17,32,0.42);}
.submit-btn:active:not(:disabled){transform:translateY(0);}
.submit-btn:disabled{opacity:.55;cursor:not-allowed;transform:none;}

.nav-row{text-align:center;margin-top:14px;font-size:12px;color:var(--ink-light);}
.nav-row a{color:var(--gold-dim);text-decoration:none;font-weight:500;cursor:pointer;transition:color .2s;display:inline-flex;align-items:center;gap:3px;}
.nav-row a:hover{color:var(--gold);}

.ff{display:flex;align-items:center;justify-content:center;gap:6px;margin-top:16px;font-size:10.5px;color:var(--ink-light);}
.ff span{display:inline-flex;align-items:center;gap:4px;}
.ff svg{width:11px;height:11px;color:var(--green);}
.ff-dot{width:3px;height:3px;background:var(--panel-border);border-radius:50%;}

.success-wrap{display:flex;flex-direction:column;align-items:center;gap:12px;padding:16px 12px;text-align:center;}
.success-icon{
  width:62px;height:62px;border-radius:50%;
  background:linear-gradient(135deg,var(--navy-deep),var(--navy-mid));
  border:2px solid var(--gold-hairline);
  display:flex;align-items:center;justify-content:center;
  color:var(--gold);box-shadow:0 4px 20px rgba(201,168,76,0.2);
  animation:popIn .5s var(--ease) both;
}
.success-icon svg{width:28px;height:28px;}
.success-title{font-family:var(--font-display);font-size:22px;color:var(--ink);font-weight:600;}
.success-sub{font-size:12.5px;color:var(--ink-light);line-height:1.7;max-width:280px;}
@keyframes popIn{from{transform:scale(.3);opacity:0;}to{transform:scale(1);opacity:1;}}

@keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
@keyframes fsDown{from{opacity:0;transform:translateY(-12px);}to{opacity:1;transform:translateY(0);}}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
@keyframes cardRise{from{opacity:0;transform:translateY(24px) scale(.98);}to{opacity:1;transform:translateY(0) scale(1);}}

/* RESPONSIVE — stack vertically, both sections naturally scroll */
@media(max-width:960px){
  html,body{overflow:auto;background:var(--panel-bg);}
  .ef-wrap{flex-direction:column;height:auto;min-height:100vh;overflow:auto;}
  .ef-left{display:none;}
  .ef-right{width:100%;height:auto;min-height:100vh;overflow:visible;padding:40px 20px;display:flex;align-items:center;justify-content:center;}
  .stats-row{display:none;}
  .features{grid-template-columns:1fr 1fr;margin-top:20px;}
  .form-card{padding:32px 26px;}
}
@media(max-width:480px){
  .ef-left{display:none;}
  .ef-wrap{min-height:100vh;}
  .ef-right{width:100%;height:auto;min-height:100vh;padding:40px 16px;display:flex;align-items:center;justify-content:center;}
  .features{grid-template-columns:1fr;}
  .form-card{padding:28px 18px;}
  .hero-text h1{font-size:28px;}
}
`;

/* ── DATA ── */
const features = [
  { icon: <RiBarChartBoxLine />,   title: "AI Analytics",   desc: "Risk detection & performance trends" },
  { icon: <RiShieldCheckLine />,   title: "Secure Access",  desc: "Role-based institutional permissions" },
  { icon: <RiSecurePaymentLine />, title: "Fee Tracking",   desc: "Real-time payment & dues status" },
  { icon: <RiFileListLine />,      title: "Result Portal",  desc: "Instant grade & rank access" },
];
const stats = [
  { number: "4,200+", label: "Students" },
  { number: "38",     label: "Departments" },
  { number: "96%",    label: "Pass Rate" },
];
const DOMAIN = "@idealcollege.edu.in";

/* ── Left Panel ── */
function LeftPanel({ subtitle }) {
  return (  
    <div className="ef-left">
      <div className="arc arc-1"/><div className="arc arc-2"/><div className="arc arc-3"/>
      <div className="brand">
        <div className="brand-icon"><RiGraduationCapLine /></div>
        <span className="brand-name">ExamFlow</span>
      </div>
      <div className="gold-rule"><div className="gold-rule-diamond"/></div>
      <div className="hero-text">
        <p className="college-eyebrow">Ideal College of Arts &amp; Sciences</p>
        <h1>The <em>scholarly</em><br/>path to exam<br/>excellence.</h1>
        <p>{subtitle}</p>
      </div>
      <div className="stats-row">
        {stats.map(s => (
          <div className="stat-item" key={s.label}>
            <div className="stat-number">{s.number}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="features">
        {features.map(f => (
          <div className="feat-card" key={f.title}>
            <div className="feat-icon">{f.icon}</div>
            <strong>{f.title}</strong>
            <span>{f.desc}</span>
          </div>
        ))}
      </div>
      <div className="lf">
        <span>© 2025 ExamFlow · ICAS</span>
        <div className="lf-links">
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
          <a href="#support">Support</a>
        </div>
      </div>
    </div>
  );
}

/* ── Form Shell ── */
function FormShell({ title, subtitle, children }) {
  return (
    <div className="ef-right">
      <div className="watermark">ICAS</div>
      <div className="form-card">
        <div className="fh">
          <div className="fh-crest"><RiGraduationCapLine /></div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <div className="fdiv"><hr/><div className="fdiv-dot"/><hr/></div>
        {children}
        <div className="ff">
          <span><RiShieldCheckLine /> SSL Secured</span>
          <div className="ff-dot"/>
          <span>ICAS Portal v2.5</span>
          <div className="ff-dot"/>
          <span>Privacy Protected</span>
        </div>
      </div>
    </div>
  );
}

/* ── Password Field with toggle ── */
function PasswordField({ id, label, placeholder, value, onChange, autoComplete = "new-password" }) {
  const [show, setShow] = useState(false);
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="fi-wrap">
        <span className="fi-lead"><RiLockPasswordLine /></span>
        <input
          id={id} type={show ? "text" : "password"}
          className="has-trail" placeholder={placeholder}
          value={value} onChange={e => onChange(e.target.value)} autoComplete={autoComplete}
        />
        <button className="fi-trail" type="button" onClick={() => setShow(v => !v)}>
          {show ? <RiEyeOffLine /> : <RiEyeLine />}
        </button>
      </div>
    </div>
  );
}

/* ── College Email Field ── */
function EmailField({ value, onChange, disabled = false }) {
  const [focused, setFocused] = useState(false);
  const [error,   setError]   = useState("");

  const validate = v => {
    if (v && !v.endsWith(DOMAIN)) setError(`Only ${DOMAIN} addresses are accepted`);
    else setError("");
  };

  return (
    <div className="field">
      <label>College Email</label>
      <div className="fi-wrap">
        <span className="fi-lead"><RiMailLine /></span>
        <input
          type="email" placeholder={`yourname${DOMAIN}`}
          value={value}
          onChange={e => { onChange(e.target.value); if (error) validate(e.target.value); }}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); validate(value); }}
          disabled={disabled}
        />
      </div>
      {focused && !error && (
        <div className="field-hint">
          <RiMailLine />
          <span>Only college email addresses ending with <strong>{DOMAIN}</strong> are accepted.</span>
        </div>
      )}
      {error && (
        <div className="field-error">
          <RiShieldCheckLine />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

/* ── OTP Button + Reveal ── */
function OtpSection({ roll, email, canSend, otp, setOtp, mode = "register" }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!canSend || sent || loading) return;
    setLoading(true);
    try {
      if (mode === "forgot") {
        // forgot-password flow: send OTP via email or roll
        const target = roll || email;
        await auth.forgotPassword({ rollOrEmail: target });
      } else {
        // registration flow
        await auth.sendOtp({ roll, email });
      }
      setSent(true);
    } catch (err) {
      // show error briefly
      console.error("sendOtp failed", err);
      alert(err?.message || "Failed to send OTP. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className={`otp-btn ${sent ? "sent" : ""}`}
        onClick={send}
        disabled={loading || sent || !canSend}
        type="button"
      >
        {sent
          ? <><RiCheckboxCircleLine /> OTP Sent to your email</>
          : loading
          ? <><RiRefreshLine style={{ animation: "spin 1s linear infinite" }} /> Sending…</>
          : <><RiSendPlaneLine /> Send OTP</>
        }
      </button>

      {sent && (
        <div className="field otp-reveal">
          <label>Enter OTP</label>
          <div className="fi-wrap">
            <span className="fi-lead"><RiKeyLine /></span>
            <input
              type="text" className="otp-input"
              placeholder="• • • • • •"
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              maxLength={6}
            />
          </div>
        </div>
      )}
    </>
  );
}

/* ══════════════════════════════
   LOGIN PAGE
══════════════════════════════ */

// NOTE: SAMPLE_CREDENTIALS kept for local fallback during development
const SAMPLE_CREDENTIALS = {
  students: [
    { roll: "21CSE001", password: "student123" },
    { roll: "21CSE002", password: "student123" },
  ],
  admins: [
    { roll: "ADMIN001", password: "admin123" },
  ]
};

function LoginPage({ navigate }) {
  const router = useNavigate();
  const [roll,    setRoll]    = useState("");
  const [pass,    setPass]    = useState("");
  const [show,    setShow]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const submit = () => {
    setError("");
    setLoading(true);

    // Prefer backend auth, fallback to SAMPLE_CREDENTIALS when backend unreachable
    (async () => {
      try {
        const res = await auth.login({ roll, password: pass });
        // Expecting response like: { role: 'student'|'admin', user: {...}, token?: '...' }
        if (res && res.role) {
          localStorage.setItem("userRole", res.role);
          localStorage.setItem("userEmail", roll);
          if (res.token) localStorage.setItem("token", res.token);
          setLoading(false);
          router(res.role === "admin" ? "/admin-dashboard" : "/student-dashboard");
          return;
        }
        // if backend responded but didn't include role, show message
        throw { message: res.message || "Unexpected response from server" };
      } catch (err) {
        // If backend error, attempt local SAMPLE_CREDENTIALS fallback
        try {
          // small delay to keep UX consistent
          await new Promise(r => setTimeout(r, 500));
          const adminMatch = SAMPLE_CREDENTIALS.admins.find(a => a.roll === roll && a.password === pass);
          if (adminMatch) {
            localStorage.setItem("userRole", "admin");
            localStorage.setItem("userEmail", roll);
            setLoading(false);
            router("/admin-dashboard");
            return;
          }
          const studentMatch = SAMPLE_CREDENTIALS.students.find(s => s.roll === roll && s.password === pass);
          if (studentMatch) {
            localStorage.setItem("userRole", "student");
            localStorage.setItem("userEmail", roll);
            setLoading(false);
            router("/student-dashboard");
            return;
          }
          setError(err?.message || "Invalid roll number or password");
        } finally {
          setLoading(false);
        }
      }
    })();
  };

  return (
    <div className="ef-wrap">
      <LeftPanel subtitle="From fee governance to AI-powered academic performance insights — everything your institution needs, unified in one elegant portal." />
      <FormShell title="Welcome Back" subtitle="Sign in to access your student portal">
        <div className="field-group">
          <div className="field">
            <label htmlFor="roll">Roll Number</label>
            <div className="fi-wrap">
              <span className="fi-lead"><RiIdCardLine /></span>
              <input id="roll" type="text" placeholder="e.g. 21CSE001 or ADMIN001"
                value={roll} onChange={e => { setRoll(e.target.value); setError(""); }} autoComplete="username"/>
            </div>
          </div>

          <div className="field">
            <label htmlFor="pass">Password</label>
            <div className="fi-wrap">
              <span className="fi-lead"><RiLockPasswordLine /></span>
              <input id="pass" type={show ? "text" : "password"} className="has-trail"
                placeholder="Enter your password"
                value={pass} onChange={e => { setPass(e.target.value); setError(""); }} autoComplete="current-password"/>
              <button className="fi-trail" type="button" onClick={() => setShow(v => !v)}>
                {show ? <RiEyeOffLine /> : <RiEyeLine />}
              </button>
            </div>
          </div>

          {error && (
            <div className="field-error">
              <RiShieldCheckLine />
              <span>{error}</span>
            </div>
          )}

          <div style={{ textAlign: "right", marginTop: 4 }}>
            <span
              onClick={() => navigate("forgot")}
              style={{ fontSize: 12, color: "var(--ink-light)", cursor: "pointer",
                       textDecoration: "none", transition: "color .2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--gold-dim)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--ink-light)"}
            >
              Forgot password?
            </span>
          </div>
        </div>

        <button className="submit-btn" onClick={submit} disabled={loading || !roll || !pass}>
          {loading ? "Verifying…" : <><RiLoginBoxLine /> Sign In</>}
        </button>

        <div className="nav-row">
          Don't have an account?{" "}
          <a onClick={() => navigate("register")}>Register here <RiArrowRightLine /></a>
        </div>
      </FormShell>
    </div>
  );
}

/* ══════════════════════════════
   REGISTER PAGE
══════════════════════════════ */
function RegisterPage({ navigate }) {
  const [roll,    setRoll]    = useState("");
  const [email,   setEmail]   = useState("");
  const [pass,    setPass]    = useState("");
  const [confirm, setConfirm] = useState("");
  const [confErr, setConfErr] = useState("");
  const [otp,     setOtp]     = useState("");
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);

  const emailOk  = email && email.endsWith(DOMAIN);
  const canSend  = (roll || email) && emailOk;
  const passOk   = pass.length >= 6;
  const matchOk  = confirm === pass && !!confirm;
  const canSubmit = canSend && passOk && matchOk && otp.length === 6 && !loading;

  const submit = () => {
    setLoading(true);
    (async () => {
      try {
        await auth.register({ roll, email, password: pass, otp });
        setLoading(false);
        setDone(true);
      } catch (err) {
        setLoading(false);
        setConfErr(err?.message || "Registration failed. Please try again.");
      }
    })();
  };

  if (done) return (
    <div className="ef-wrap">
      <LeftPanel subtitle="Create your ICAS student account to access all portal features." />
      <FormShell title="Account Created" subtitle="You're all set">
        <div className="success-wrap">
          <div className="success-icon"><RiGraduationCapLine /></div>
          <div className="success-title">Welcome to ExamFlow!</div>
          <div className="success-sub">Your account is ready. Sign in with your roll number and password to get started.</div>
          <button className="submit-btn" style={{ marginTop: 10 }} onClick={() => navigate("login")}>
            <RiLoginBoxLine /> Go to Sign In
          </button>
        </div>
      </FormShell>
    </div>
  );

  return (
    <div className="ef-wrap">
      <LeftPanel subtitle="Create your ICAS student account to access results, fee status, and AI-powered performance insights." />
      <FormShell title="Create Account" subtitle="Register your student portal access">
        <div className="field-group">
          <div className="field">
            <label>Roll Number</label>
            <div className="fi-wrap">
              <span className="fi-lead"><RiIdCardLine /></span>
              <input type="text" placeholder="e.g. 21CSE001" value={roll} onChange={e => setRoll(e.target.value)}/>
            </div>
          </div>

          <EmailField value={email} onChange={setEmail} />

          <PasswordField id="reg-pass" label="Password"
            placeholder="Create a strong password (min 6 chars)"
            value={pass} onChange={e => setPass(e.target.value)} />

          <div className="field">
            <label>Confirm Password</label>
            <div className="fi-wrap">
              <span className="fi-lead"><RiLockPasswordLine /></span>
              <input type="password" placeholder="Re-enter your password"
                value={confirm}
                onChange={e => {
                  setConfirm(e.target.value);
                  setConfErr(e.target.value && e.target.value !== pass ? "Passwords do not match" : "");
                }}/>
            </div>
            {confErr && <div className="field-error"><RiShieldCheckLine /><span>{confErr}</span></div>}
          </div>

          <OtpSection roll={roll} email={email} canSend={canSend} otp={otp} setOtp={setOtp} mode="forgot" />
        </div>

        <button className="submit-btn" onClick={submit} disabled={!canSubmit}>
          {loading ? "Creating Account…" : <><RiUserAddLine /> Create Account</>}
        </button>

        <div className="nav-row">
          Already have an account?{" "}
          <a onClick={() => navigate("login")}>Sign in <RiArrowRightLine /></a>
        </div>
      </FormShell>
    </div>
  );
}

/* ══════════════════════════════
   FORGOT PASSWORD PAGE
══════════════════════════════ */
function ForgotPage({ navigate }) {
  const [roll,        setRoll]        = useState("");
  const [email,       setEmail]       = useState("");
  const [otp,         setOtp]         = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPass,    setShowPass]    = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [done,        setDone]        = useState(false);
  const [otpSent,     setOtpSent]     = useState(false);

  const emailOk  = email.endsWith(DOMAIN);
  const canSendOtp = !!roll && emailOk;
  const canResetPassword = otpSent && otp.length === 6 && newPassword.length >= 6 && !loading;

  const sendOtp = () => {
    setLoading(true);
    (async () => {
      try {
        const target = roll || email;
        await auth.forgotPassword({ rollOrEmail: target });
        setOtpSent(true);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        alert(err?.message || "Failed to send OTP");
      }
    })();
  };

  const submit = () => {
    if (!canResetPassword) return;
    setLoading(true);
    (async () => {
      try {
        await auth.resetPassword({ 
          email: email.toLowerCase(), 
          otp, 
          new_password: newPassword 
        });
        setLoading(false);
        setDone(true);
      } catch (err) {
        setLoading(false);
        alert(err?.message || "Failed to reset password");
      }
    })();
  };

  if (done) return (
    <div className="ef-wrap">
      <LeftPanel subtitle="Reset your ICAS portal password securely." />
      <FormShell title="Password Reset" subtitle="Your password has been updated">
        <div className="success-wrap">
          <div className="success-icon"><RiCheckboxCircleLine /></div>
          <div className="success-title">Password Updated!</div>
          <div className="success-sub">Your password has been reset. Sign in with your new credentials.</div>
          <button className="submit-btn" style={{ marginTop: 10 }} onClick={() => navigate("login")}>
            <RiLoginBoxLine /> Go to Sign In
          </button>
        </div>
      </FormShell>
    </div>
  );

  return (
    <div className="ef-wrap">
      <LeftPanel subtitle="Reset your portal access securely using your registered college email." />
      <FormShell title="Reset Password" subtitle="Verify your identity to regain access">
        <div className="field-group">
          <div className="field">
            <label>Roll Number</label>
            <div className="fi-wrap">
              <span className="fi-lead"><RiIdCardLine /></span>
              <input type="text" placeholder="e.g. 21CSE001" value={roll} onChange={e => setRoll(e.target.value)} disabled={otpSent}/>
            </div>
          </div>

          <EmailField value={email} onChange={setEmail} disabled={otpSent} />

          <button
            className={`otp-btn ${otpSent ? "sent" : ""}`}
            onClick={sendOtp}
            disabled={loading || otpSent || !canSendOtp}
            type="button"
          >
            {otpSent
              ? <><RiCheckboxCircleLine /> OTP Sent to your email</>
              : loading
              ? <><RiRefreshLine style={{ animation: "spin 1s linear infinite" }} /> Sending…</>
              : <><RiSendPlaneLine /> Send OTP</>
            }
          </button>

          {otpSent && (
            <>
              <div className="field">
                <label>Verification Code (OTP)</label>
                <div className="fi-wrap">
                  <span className="fi-lead"><RiKeyLine /></span>
                  <input 
                    type="text" 
                    placeholder="000000" 
                    maxLength="6"
                    value={otp} 
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>

              <PasswordField 
                id="newpass" 
                label="New Password" 
                placeholder="Create a new password" 
                value={newPassword} 
                onChange={setNewPassword}
              />
            </>
          )}
        </div>

        {otpSent && (
          <button className="submit-btn" onClick={submit} disabled={!canResetPassword}>
            {loading ? "Resetting…" : <><RiKeyLine /> Reset Password</>}
          </button>
        )}

        <div className="nav-row">
          Remember your password?{" "}
          <a onClick={() => navigate("login")}>Sign in <RiArrowRightLine /></a>
        </div>
      </FormShell>
    </div>
  );
}

/* ══════════════════════════════
   ROOT
══════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("login");
  return (
    <>
      <style>{css}</style>
      {page === "login"    && <LoginPage    navigate={setPage} />}
      {page === "register" && <RegisterPage navigate={setPage} />}
      {page === "forgot"   && <ForgotPage   navigate={setPage} />}
    </>
  );
}