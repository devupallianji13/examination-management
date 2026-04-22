import { useState } from "react";
import { RiUserLine, RiMailLine, RiPhoneLine, RiMapPinLine, RiCalendarLine, RiEditLine } from "react-icons/ri";
import "./StudentProfile.css";

const StudentProfile = () => {
  const [profile] = useState({
    name: "Aarav Sharma",
    email: "aarav.sharma@university.edu",
    phone: "+91 98765 43210",
    rollNumber: "21CSE001",
    department: "Computer Science & Engineering",
    batch: "2021-2025",
    semester: "Semester 5",
    address: "123 Main Street, City, State 12345",
    joinDate: "August 1, 2021",
    cgpa: 8.0,
    attendance: 92,
    avatar: "AS",
  });

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-header__icon">
          <RiUserLine size={32} />
        </div>
        <div>
          <h1>Student Profile</h1>
          <p>Your personal and academic information</p>
        </div>
      </div>

      <div className="profile-content">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-top">
            <div className="profile-avatar">{profile.avatar}</div>
            <div className="profile-basic">
              <h2>{profile.name}</h2>
              <p className="profile-roll">{profile.rollNumber}</p>
              <p className="profile-dept">{profile.department}</p>
            </div>
            <button className="profile-edit-btn">
              <RiEditLine size={18} />
            </button>
          </div>

          {/* Contact Information */}
          <div className="profile-section">
            <h3>Contact Information</h3>
            <div className="profile-info-grid">
              <div className="profile-info-item">
                <RiMailLine size={18} />
                <div>
                  <span className="info-label">Email</span>
                  <span className="info-value">{profile.email}</span>
                </div>
              </div>
              <div className="profile-info-item">
                <RiPhoneLine size={18} />
                <div>
                  <span className="info-label">Phone</span>
                  <span className="info-value">{profile.phone}</span>
                </div>
              </div>
              <div className="profile-info-item">
                <RiMapPinLine size={18} />
                <div>
                  <span className="info-label">Address</span>
                  <span className="info-value">{profile.address}</span>
                </div>
              </div>
              <div className="profile-info-item">
                <RiCalendarLine size={18} />
                <div>
                  <span className="info-label">Joined</span>
                  <span className="info-value">{profile.joinDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="profile-section">
            <h3>Academic Information</h3>
            <div className="profile-academics">
              <div className="academic-item">
                <span className="academic-label">Batch</span>
                <span className="academic-value">{profile.batch}</span>
              </div>
              <div className="academic-item">
                <span className="academic-label">Current Semester</span>
                <span className="academic-value">{profile.semester}</span>
              </div>
              <div className="academic-item">
                <span className="academic-label">CGPA</span>
                <span className="academic-value">{profile.cgpa}</span>
              </div>
              <div className="academic-item">
                <span className="academic-label">Attendance</span>
                <span className="academic-value">{profile.attendance}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
