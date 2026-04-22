import { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  RiDashboardLine,
  RiFileListLine,
  RiTicketLine,
  RiBankCardLine,
  RiLogoutBoxRLine,
  RiTimeLine,
  RiSparklingLine,
  RiBarChartGroupedLine,
  RiSendPlaneFill,
  RiRobot2Line,
  RiCloseLine,
  RiUserLine,
  RiMenuLine,
  RiArrowRightSLine,
} from "react-icons/ri";
import "./StudentLayout.css";

/* ── Static Data ── */
const student = {
  name: "Aarav Sharma",
  rollNumber: "21CSE001",
  group: "CSE-A",
  semester: "Semester 5",
  avatar: "AS",
  attendance: 92,
};

const navItems = [
  { id: "dashboard", path: "dashboard", label: "Dashboard", icon: <RiDashboardLine /> },
  { id: "results", path: "results", label: "Results", icon: <RiFileListLine /> },
  { id: "hallticket", path: "hallticket", label: "Hall Ticket", icon: <RiTicketLine /> },
  { id: "fees", path: "fees", label: "Pay Fees", icon: <RiBankCardLine /> },
  { id: "profile", path: "profile", label: "Profile", icon: <RiUserLine /> },
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

export default function StudentLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "ai", text: "Hi Aarav 👋 I'm your ExamFlow AI Assistant. How can I help you today?" },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [typing, setTyping] = useState(false);
  const msgEndRef = useRef(null);

  // Determine current active tab based on URL
  const currentPath = location.pathname.split("/").pop();
  const activeTab = navItems.find(n => n.path === currentPath)?.id || "dashboard";

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
                className={`d-nav__item ${activeTab === n.id ? "d-nav__item--active" : ""}`}
                onClick={() => { navigate(n.path); setSidebarOpen(false); }}
              >
                <span className="d-nav__icon">{n.icon}</span>
                <span className="d-nav__label">{n.label}</span>
                {activeTab === n.id && <RiArrowRightSLine size={14} className="d-nav__arrow" />}
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

        {/* ════════ PAGE OUTLET ════════ */}
        <Outlet />

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
