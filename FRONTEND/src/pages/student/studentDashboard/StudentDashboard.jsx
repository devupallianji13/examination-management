import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  RiDashboardLine,
  RiFileListLine,
  RiTicketLine,
  RiBankCardLine,
  RiBellLine,
  RiLogoutBoxRLine,
  RiShieldCheckLine,
  RiTimeLine,
  RiSparklingLine,
  RiBarChartGroupedLine,
  RiAlertLine,
  RiLightbulbLine,
  RiSendPlaneFill,
  RiRobot2Line,
  RiCloseLine,
  RiUserLine,
  RiMenuLine,
  RiArrowRightSLine,
  RiCheckboxCircleLine,
  RiErrorWarningLine,
} from "react-icons/ri";
import "./StudentDashboard.css";

/* ── Static Data ── */
const student = {
  name: "Aarav Sharma",
  rollNumber: "21CSE001",
  group: "CSE-A",
  semester: "Semester 5",
  avatar: "AS",
  feePaid: true,
  attendance: 92,
  cgpa: 8.0,
  overallGrade: "A",
  percentage: 73.5,
  feeAmount: "₹45,000",
};

const subjects = [
  { code: "CS301", name: "Data Structures",      marks: 55 },
  { code: "CS302", name: "Computer Networks",    marks: 62 },
  { code: "CS303", name: "Operating Systems",    marks: 68 },
  { code: "CS304", name: "Database Management",  marks: 74 },
  { code: "MA301", name: "Mathematics III",      marks: 81 },
  { code: "EN301", name: "Engineering Ethics",   marks: 88 },
];

const notifications = [
  {
    icon: <RiBankCardLine />,
    color: "orange",
    title: "Fee payment due",
    desc: "Semester 5 fees due by May 15. Pay to unlock your hall ticket.",
    time: "2h ago",
  },
  {
    icon: <RiFileListLine />,
    color: "blue",
    title: "Mid-sem results published",
    desc: "Your mid-semester results are now available in the Results section.",
    time: "1d ago",
  },
  {
    icon: <RiTicketLine />,
    color: "purple",
    title: "End-sem exam schedule",
    desc: "End-semester exams begin May 20. Check your hall ticket for details.",
    time: "2d ago",
  },
];

const navItems = [
  { id: "dashboard",     path: "/student-dashboard", label: "Dashboard",     icon: <RiDashboardLine /> },
  { id: "results",       path: "/student-results",     label: "Results",       icon: <RiFileListLine /> },
  { id: "hallticket",    path: "/student-hallticket",  label: "Hall Ticket",   icon: <RiTicketLine /> },
  { id: "payfees",       path: "/student-fees",        label: "Pay Fees",      icon: <RiBankCardLine /> },
  { id: "profile",       path: "/student-profile",     label: "Profile",      icon: <RiUserLine /> },
];

const aiResponses = {
  default: "I can help you with fee status, exam schedules, results, and academic insights. What would you like to know?",
  fee: "Your fee of ₹45,000 for Semester 5 has been paid ✅. Your hall ticket is now unlocked and ready to download.",
  result: "Your current CGPA is 8.0 with an overall grade of A (73.5%). You are performing above the class average of 68%.",
  exam: "Your end-semester exams begin May 20. You have 4 upcoming exams. Check the Hall Ticket section for the full schedule.",
  attendance: "Your attendance is 92%, which is above the minimum required 75%. Keep it up!",
  hall: "Your hall ticket is available and ready to download. Navigate to the Hall Ticket section to get it.",
  risk: "No academic risks detected. You are on track with all subjects. Focus on Data Structures (CS301) for the highest impact improvement.",
};

function getAIResponse(msg) {
  const m = msg.toLowerCase();
  if (m.includes("fee") || m.includes("paid") || m.includes("payment")) return aiResponses.fee;
  if (m.includes("result") || m.includes("grade") || m.includes("cgpa") || m.includes("mark")) return aiResponses.result;
  if (m.includes("exam") || m.includes("schedule") || m.includes("date")) return aiResponses.exam;
  if (m.includes("attend")) return aiResponses.attendance;
  if (m.includes("hall") || m.includes("ticket")) return aiResponses.hall;
  if (m.includes("risk") || m.includes("fail") || m.includes("danger")) return aiResponses.risk;
  return aiResponses.default;
}

/* ── Bar Chart ── */
function BarChart({ data }) {
  const max = 100;
  const H   = 180;
  return (
    <div className="d-chart">
      <div className="d-chart__y-axis">
        {[100, 75, 50, 25, 0].map(v => (
          <span key={v} className="d-chart__y-label">{v}</span>
        ))}
      </div>
      <div className="d-chart__plot">
        {[100, 75, 50, 25, 0].map(v => (
          <div key={v} className="d-chart__gridline" style={{ bottom: `${(v / max) * H}px` }} />
        ))}
        <div className="d-chart__bars">
          {data.map((s, i) => (
            <div key={i} className="d-chart__bar-col">
              <div className="d-chart__bar-wrap" style={{ height: `${H}px` }}>
                <div
                  className="d-chart__bar"
                  style={{ height: `${(s.marks / max) * H}px`, animationDelay: `${i * 0.08}s` }}
                  title={`${s.name}: ${s.marks}`}
                >
                  <span className="d-chart__tooltip">{s.marks}</span>
                </div>
              </div>
              <span className="d-chart__x-label">{s.code}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN DASHBOARD COMPONENT
══════════════════════════════════════════ */
export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen,    setChatOpen]    = useState(false);
  const [messages,    setMessages]    = useState([
    { from: "ai", text: "Hi Aarav 👋 I'm your ExamFlow AI Assistant. How can I help you today?" },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [typing,   setTyping]   = useState(false);
  const msgEndRef = useRef(null);

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function sendMessage() {
    const msg = inputVal.trim();
    if (!msg) return;
    setMessages(prev => [...prev, { from: "user", text: msg }]);
    setInputVal("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { from: "ai", text: getAIResponse(msg) }]);
    }, 1100);
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  return (
    <div className="d-root">

      {/* ──────── SIDEBAR ──────── */}
      <aside className={`d-sidebar ${sidebarOpen ? "d-sidebar--open" : ""}`}>
        <div className="d-sidebar__inner">
          {/* Brand */}
          <div className="d-brand">
            <div className="d-brand__logo">
              <RiBarChartGroupedLine size={18} color="#fff" />
            </div>
            <div>
              <p className="d-brand__name">ExamFlow</p>
              <p className="d-brand__sub">AI Exam Suite</p>
            </div>
          </div>

          <p className="d-nav__section">Student Portal</p>

          {/* Nav */}
          <nav className="d-nav">
            {navItems.map(n => (
              <button
                key={n.id}
                className="d-nav__item d-nav__item--active"
                onClick={() => { navigate(n.path); setSidebarOpen(false); }}
              >
                <span className="d-nav__icon">{n.icon}</span>
                <span className="d-nav__label">{n.label}</span>
                <RiArrowRightSLine size={14} className="d-nav__arrow" />
              </button>
            ))}
          </nav>
        </div>

        {/* User */}
        <div className="d-sidebar__user">
          <div className="d-avatar">{student.avatar}</div>
          <div className="d-user-info">
            <p className="d-user-name">{student.name}</p>
            <p className="d-user-roll">{student.rollNumber}</p>
          </div>
          <button className="d-logout" title="Logout">
            <RiLogoutBoxRLine size={15} />
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="d-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ──────── MAIN ──────── */}
      <main className="d-main">

        {/* Topbar */}
        <header className="d-topbar">
          <div className="d-topbar__left">
            <button className="d-hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <RiMenuLine size={20} />
            </button>
            <div className="d-topbar__crumbs">
              <span className="d-topbar__roll">{student.rollNumber}</span>
              <span className="d-dot">•</span>
              <span>{student.group}</span>
              <span className="d-dot">•</span>
              <span>{student.semester}</span>
            </div>
          </div>
          <div className="d-topbar__right">
            <div className="d-topbar__chip d-topbar__chip--green">
              <RiTimeLine size={12} />
              Attendance {student.attendance}%
            </div>
            <div className="d-topbar__chip d-topbar__chip--purple">
              <RiSparklingLine size={12} />
              AI Insights Active
            </div>
            <span className="d-topbar__portal">
              <RiUserLine size={13} /> Student Portal
            </span>
          </div>
        </header>

        {/* ════════ DASHBOARD PAGE ════════ */}
        <div className="d-page">

            {/* ── Stat Cards ── */}
            <div className="d-cards">
              {/* Fee Status */}
              <div className="d-card d-card--fee">
                <div className="d-card__content">
                  <p className="d-card__label">FEE STATUS</p>
                  <p className="d-card__value">{student.feePaid ? "Paid" : "Pending"}</p>
                  <p className="d-card__sub">{student.feeAmount}</p>
                </div>
                <div className="d-card__icon-wrap d-card__icon-wrap--green">
                  {student.feePaid
                    ? <RiCheckboxCircleLine size={22} />
                    : <RiErrorWarningLine size={22} />}
                </div>
              </div>

              {/* Hall Ticket */}
              <div className="d-card d-card--ticket">
                <div className="d-card__content">
                  <p className="d-card__label">HALL TICKET</p>
                  <p className="d-card__value">{student.feePaid ? "Available" : "Locked"}</p>
                  <p className="d-card__sub">{student.feePaid ? "Ready to download" : "Pay fees first"}</p>
                </div>
                <div className="d-card__icon-wrap d-card__icon-wrap--teal">
                  <RiTicketLine size={22} />
                </div>
              </div>

              {/* Overall Grade */}
              <div className="d-card d-card--grade">
                <div className="d-card__content">
                  <p className="d-card__label">OVERALL GRADE</p>
                  <p className="d-card__value">{student.overallGrade}</p>
                  <p className="d-card__sub">{student.percentage}% • CGPA {student.cgpa}</p>
                </div>
                <div className="d-card__icon-wrap d-card__icon-wrap--purple">
                  <RiBarChartGroupedLine size={22} />
                </div>
              </div>

              {/* Subjects */}
              <div className="d-card d-card--subjects">
                <div className="d-card__content">
                  <p className="d-card__label">SUBJECTS</p>
                  <p className="d-card__value">{subjects.length}</p>
                  <p className="d-card__sub">All cleared</p>
                </div>
                <div className="d-card__icon-wrap d-card__icon-wrap--indigo">
                  <RiFileListLine size={22} />
                </div>
              </div>
            </div>

            {/* ── Chart + AI Insights ── */}
            <div className="d-mid">
              {/* Bar Chart Panel */}
              <div className="d-panel d-panel--chart">
                <div className="d-panel__head">
                  <div>
                    <h2 className="d-panel__title">Subject Performance</h2>
                    <p className="d-panel__sub">Marks across enrolled subjects</p>
                  </div>
                  <span className="d-out-badge">Out of 100</span>
                </div>
                <BarChart data={subjects} />
              </div>

              {/* AI Insights Panel */}
              <div className="d-panel d-panel--ai">
                <h2 className="d-panel__title d-panel__title--ai">
                  <RiSparklingLine size={16} />
                  AI Insights
                </h2>
                <div className="d-ai-items">
                  <div className="d-ai-item d-ai-item--blue">
                    <div className="d-ai-item__icon"><RiBarChartGroupedLine size={14} /></div>
                    <div>
                      <p className="d-ai-item__head">Performance Trend</p>
                      <p className="d-ai-item__body">You're above class average (74% vs 68%).</p>
                    </div>
                  </div>
                  <div className="d-ai-item d-ai-item--green">
                    <div className="d-ai-item__icon"><RiShieldCheckLine size={14} /></div>
                    <div>
                      <p className="d-ai-item__head">Risk Detection</p>
                      <p className="d-ai-item__body">No academic risks detected.</p>
                    </div>
                  </div>
                  <div className="d-ai-item d-ai-item--amber">
                    <div className="d-ai-item__icon"><RiLightbulbLine size={14} /></div>
                    <div>
                      <p className="d-ai-item__head">Recommendation</p>
                      <p className="d-ai-item__body">Focus on Data Structures for greatest impact.</p>
                    </div>
                  </div>
                  <div className="d-ai-item d-ai-item--red">
                    <div className="d-ai-item__icon"><RiAlertLine size={14} /></div>
                    <div>
                      <p className="d-ai-item__head">Attention Needed</p>
                      <p className="d-ai-item__body">CS301 marks (55) are below your average of 71.3.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Recent Notifications ── */}
            <div className="d-panel d-panel--notifs">
              <div className="d-panel__head">
                <h2 className="d-panel__title">Recent Notifications</h2>
                <button className="d-view-all">
                  View all <RiArrowRightSLine size={14} />
                </button>
              </div>
              <div className="d-notif-list">
                {notifications.map((n, i) => (
                  <div className="d-notif" key={i} style={{ animationDelay: `${i * 0.07}s` }}>
                    <div className={`d-notif__icon-wrap d-notif__icon-wrap--${n.color}`}>
                      {n.icon}
                    </div>
                    <div className="d-notif__body">
                      <p className="d-notif__title">{n.title}</p>
                      <p className="d-notif__desc">{n.desc}</p>
                    </div>
                    <span className="d-notif__time">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>

        </div>

      </main>

      {/* ──────── AI CHATBOT FAB ──────── */}
      <div className={`d-chat-fab ${chatOpen ? "d-chat-fab--open" : ""}`}>
        {/* Chat window */}
        {chatOpen && (
          <div className="d-chat-window">
            {/* Header */}
            <div className="d-chat-header">
              <div className="d-chat-header__left">
                <div className="d-chat-avatar">
                  <RiRobot2Line size={18} />
                  <span className="d-chat-status" />
                </div>
                <div>
                  <p className="d-chat-name">ExamFlow AI</p>
                  <p className="d-chat-online">Online • Always available</p>
                </div>
              </div>
              <button className="d-chat-close" onClick={() => setChatOpen(false)}>
                <RiCloseLine size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="d-chat-messages">
              {messages.map((m, i) => (
                <div key={i} className={`d-msg d-msg--${m.from}`}>
                  {m.from === "ai" && (
                    <div className="d-msg-avatar">
                      <RiRobot2Line size={14} />
                    </div>
                  )}
                  <div className="d-msg-bubble">{m.text}</div>
                </div>
              ))}
              {typing && (
                <div className="d-msg d-msg--ai">
                  <div className="d-msg-avatar"><RiRobot2Line size={14} /></div>
                  <div className="d-msg-bubble d-msg-bubble--typing">
                    <span /><span /><span />
                  </div>
                </div>
              )}
              <div ref={msgEndRef} />
            </div>

            {/* Quick suggestions */}
            <div className="d-chat-suggestions">
              {["Fee status", "My results", "Exam schedule"].map(s => (
                <button key={s} className="d-suggestion"
                  onClick={() => { setInputVal(s); setTimeout(sendMessage, 50); }}>
                  {s}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="d-chat-input-row">
              <input
                className="d-chat-input"
                placeholder="Ask about fees, results, exams…"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={handleKey}
              />
              <button className="d-chat-send" onClick={sendMessage} disabled={!inputVal.trim()}>
                <RiSendPlaneFill size={16} />
              </button>
            </div>
          </div>
        )}

        {/* FAB button */}
        <button
          className="d-fab-btn"
          onClick={() => setChatOpen(!chatOpen)}
          title="AI Assistant"
        >
          {chatOpen
            ? <RiCloseLine size={22} />
            : <RiRobot2Line size={22} />}
          {!chatOpen && <span className="d-fab-ping" />}
        </button>
      </div>

    </div>
  );
}