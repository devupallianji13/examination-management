import { useState } from "react";
import { RiTicketLine, RiDownloadCloud2Line, RiCalendarLine, RiMapPinLine } from "react-icons/ri";
import "./StudentHallticket.css";

const StudentHallticket = () => {
  const [hallticket] = useState({
    rollNumber: "21CSE001",
    name: "Aarav Sharma",
    examType: "End Semester Examination",
    semester: "Semester 5",
    examDate: "May 20 - June 5, 2024",
    venue: "CSE Lab Block A",
    seatNumber: "A-12",
    examCenter: "Main Campus",
    instructions: [
      "Report 15 minutes before your exam",
      "Carry valid ID and Hall Ticket",
      "No electronic devices allowed",
      "Bring black/blue pen only",
    ],
  });

  return (
    <div className="hallticket-container">
      <div className="hallticket-header">
        <div className="hallticket-header__icon">
          <RiTicketLine size={32} />
        </div>
        <div>
          <h1>Hall Ticket</h1>
          <p>Your examination admission ticket</p>
        </div>
      </div>

      <div className="hallticket-content">
        {/* Ticket Card */}
        <div className="ticket-card">
          <div className="ticket-header">
            <h2>Examination Ticket</h2>
            <span className="ticket-date">{hallticket.semester}</span>
          </div>

          <div className="ticket-info">
            <div className="ticket-row">
              <span className="ticket-label">Roll Number</span>
              <span className="ticket-value">{hallticket.rollNumber}</span>
            </div>
            <div className="ticket-row">
              <span className="ticket-label">Name</span>
              <span className="ticket-value">{hallticket.name}</span>
            </div>
            <div className="ticket-row">
              <span className="ticket-label">Exam Type</span>
              <span className="ticket-value">{hallticket.examType}</span>
            </div>
            <div className="ticket-row">
              <span className="ticket-label">Seat Number</span>
              <span className="ticket-value">{hallticket.seatNumber}</span>
            </div>
          </div>

          {/* Exam Details */}
          <div className="exam-details">
            <div className="exam-detail">
              <RiCalendarLine size={18} />
              <div>
                <span className="detail-label">Exam Dates</span>
                <span className="detail-value">{hallticket.examDate}</span>
              </div>
            </div>
            <div className="exam-detail">
              <RiMapPinLine size={18} />
              <div>
                <span className="detail-label">Exam Center</span>
                <span className="detail-value">{hallticket.venue}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="ticket-instructions">
          <h3>Important Instructions</h3>
          <ul>
            {hallticket.instructions.map((instr, idx) => (
              <li key={idx}>{instr}</li>
            ))}
          </ul>
        </div>

        {/* Download Button */}
        <div className="ticket-actions">
          <button className="ticket-btn">
            <RiDownloadCloud2Line size={18} />
            Download Hall Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentHallticket;
