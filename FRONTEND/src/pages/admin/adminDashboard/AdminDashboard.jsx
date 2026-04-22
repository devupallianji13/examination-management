import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  RiLogoutBoxLine,
  RiHome4Line,
  RiTeamLine,
  RiFileListLine,
  RiSettingsLine,
  RiBarChartBoxLine,
  RiUserLine,
  RiCheckboxCircleLine,
} from "react-icons/ri";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [admin] = useState({
    name: "Admin User",
    email: "admin@icas.edu.in",
    role: "Administrator",
    department: "Academic Affairs",
  });

  const stats = [
    { label: "Total Students", value: "4200", icon: RiTeamLine, color: "blue" },
    { label: "Active Exams", value: "12", icon: RiCheckboxCircleLine, color: "green" },
    { label: "Departments", value: "38", icon: RiBarChartBoxLine, color: "purple" },
  ];

  const recentActivities = [
    { id: 1, action: "Exam Created", description: "Data Structures Exam created", time: "2 hours ago" },
    { id: 2, action: "Student Registered", description: "New student 21CSE045 registered", time: "4 hours ago" },
    { id: 3, action: "Result Published", description: "Results for Algorithms exam published", time: "1 day ago" },
    { id: 4, action: "Fee Collected", description: "Fee collected from 150 students", time: "2 days ago" },
  ];

  const departments = [
    { id: 1, name: "Computer Science", students: 420 },
    { id: 2, name: "Electronics", students: 380 },
    { id: 3, name: "Mechanical", students: 410 },
    { id: 4, name: "Civil", students: 390 },
  ];

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  return (
    <div className="admin-dashboard-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&display=swap');
      `}</style>

      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-title">Admin Dashboard</h1>
        </div>
        <div className="header-right">
          <div className="user-info">
            <RiUserLine className="user-icon" />
            <span>{admin.name}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <RiLogoutBoxLine /> Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Left Sidebar */}
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            <a href="#dashboard" className="nav-item active">
              <RiHome4Line /> Dashboard
            </a>
            <a href="#students" className="nav-item">
              <RiTeamLine /> Students
            </a>
            <a href="#exams" className="nav-item">
              <RiCheckboxCircleLine /> Exams
            </a>
            <a href="#reports" className="nav-item">
              <RiBarChartBoxLine /> Reports
            </a>
            <a href="#documents" className="nav-item">
              <RiFileListLine /> Documents
            </a>
            <a href="#settings" className="nav-item">
              <RiSettingsLine /> Settings
            </a>
          </nav>
        </aside>

        {/* Content Area */}
        <section className="dashboard-content">
          {/* Admin Info Card */}
          <div className="info-card">
            <h2>Administrator Information</h2>
            <div className="admin-info-grid">
              <div className="info-item">
                <label>Administrator Name</label>
                <p>{admin.name}</p>
              </div>
              <div className="info-item">
                <label>Email</label>
                <p>{admin.email}</p>
              </div>
              <div className="info-item">
                <label>Role</label>
                <p>{admin.role}</p>
              </div>
              <div className="info-item">
                <label>Department</label>
                <p>{admin.department}</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="stats-container">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="stat-card">
                  <div className={`stat-icon ${stat.color}`}>
                    <IconComponent />
                  </div>
                  <div className="stat-content">
                    <h3>{stat.label}</h3>
                    <p className="stat-value">{stat.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Department Overview */}
          <div className="section-card">
            <h2>Department Overview</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Department Name</th>
                  <th>Total Students</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept) => (
                  <tr key={dept.id}>
                    <td>{dept.name}</td>
                    <td>{dept.students}</td>
                    <td>
                      <button className="action-btn">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent Activities */}
          <div className="section-card">
            <h2>Recent Activities</h2>
            <div className="activities-list">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-left">
                    <h4>{activity.action}</h4>
                    <p>{activity.description}</p>
                  </div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
