import { useState, useRef } from "react";
import {
  RiFileTextLine,
  RiDownload2Line,
  RiFileExcel2Line,
  RiCheckboxCircleLine,
  RiArrowDownSLine,
  RiMedalLine,
  RiBarChartLine,
  RiAwardLine,
} from "react-icons/ri";
import "./StudentResult.css";

/* ── Semester Data ── */
const semesterData = {
  "Semester 1": {
    subjects: [
      { code: "CS101", name: "Programming Fundamentals", marks: 82, grade: "A", status: "Pass" },
      { code: "MA101", name: "Engineering Mathematics I", marks: 74, grade: "B+", status: "Pass" },
      { code: "PH101", name: "Engineering Physics", marks: 68, grade: "B", status: "Pass" },
      { code: "CH101", name: "Engineering Chemistry", marks: 71, grade: "B+", status: "Pass" },
      { code: "EN101", name: "Communication Skills", marks: 88, grade: "A+", status: "Pass" },
      { code: "ME101", name: "Workshop Practice", marks: 79, grade: "A", status: "Pass" },
    ],
    cgpa: 7.6,
    promoted: true,
  },
  "Semester 2": {
    subjects: [
      { code: "CS201", name: "Object Oriented Programming", marks: 78, grade: "A", status: "Pass" },
      { code: "MA201", name: "Engineering Mathematics II", marks: 65, grade: "B", status: "Pass" },
      { code: "CS202", name: "Digital Logic Design", marks: 72, grade: "B+", status: "Pass" },
      { code: "EC201", name: "Basic Electronics", marks: 69, grade: "B", status: "Pass" },
      { code: "EN201", name: "Technical Writing", marks: 85, grade: "A+", status: "Pass" },
      { code: "CS203", name: "Discrete Mathematics", marks: 61, grade: "B", status: "Pass" },
    ],
    cgpa: 7.3,
    promoted: true,
  },
  "Semester 3": {
    subjects: [
      { code: "CS301", name: "Data Structures", marks: 55, grade: "B", status: "Pass" },
      { code: "CS302", name: "Computer Networks", marks: 62, grade: "B+", status: "Pass" },
      { code: "CS303", name: "Operating Systems", marks: 68, grade: "B", status: "Pass" },
      { code: "CS304", name: "Database Management", marks: 74, grade: "A", status: "Pass" },
      { code: "MA301", name: "Mathematics III", marks: 81, grade: "A+", status: "Pass" },
      { code: "EN301", name: "Engineering Ethics", marks: 88, grade: "O", status: "Pass" },
    ],
    cgpa: 7.9,
    promoted: true,
  },
  "Semester 4": {
    subjects: [
      { code: "CS401", name: "Algorithms & Complexity", marks: 66, grade: "B", status: "Pass" },
      { code: "CS402", name: "Software Engineering", marks: 79, grade: "A", status: "Pass" },
      { code: "CS403", name: "Computer Architecture", marks: 72, grade: "B+", status: "Pass" },
      { code: "CS404", name: "Theory of Computation", marks: 58, grade: "B", status: "Pass" },
      { code: "MA401", name: "Probability & Statistics", marks: 84, grade: "A+", status: "Pass" },
      { code: "CS405", name: "Web Technologies", marks: 91, grade: "O", status: "Pass" },
    ],
    cgpa: 7.8,
    promoted: true,
  },
  "Semester 5": {
    subjects: [
      { code: "CS501", name: "Data Structures", marks: 56, grade: "B", status: "Pass" },
      { code: "CS502", name: "Operating Systems", marks: 63, grade: "B+", status: "Pass" },
      { code: "CS503", name: "Database Systems", marks: 70, grade: "A", status: "Pass" },
      { code: "CS504", name: "Computer Networks", marks: 77, grade: "A", status: "Pass" },
      { code: "MA501", name: "Discrete Mathematics", marks: 84, grade: "A+", status: "Pass" },
      { code: "EN501", name: "Technical English", marks: 91, grade: "O", status: "Pass" },
    ],
    cgpa: 8.0,
    promoted: true,
  },
  "Semester 6": {
    subjects: [
      { code: "CS601", name: "Machine Learning", marks: 88, grade: "A+", status: "Pass" },
      { code: "CS602", name: "Cloud Computing", marks: 82, grade: "A", status: "Pass" },
      { code: "CS603", name: "Cybersecurity", marks: 75, grade: "A", status: "Pass" },
      { code: "CS604", name: "Mobile App Development", marks: 90, grade: "O", status: "Pass" },
      { code: "CS605", name: "Big Data Analytics", marks: 71, grade: "B+", status: "Pass" },
      { code: "CS606", name: "Project Work", marks: 94, grade: "O", status: "Pass" },
    ],
    cgpa: 8.7,
    promoted: true,
  },
};

function getLetterGrade(marks) {
  if (marks >= 90) return "O";
  if (marks >= 80) return "A+";
  if (marks >= 70) return "A";
  if (marks >= 60) return "B+";
  if (marks >= 50) return "B";
  if (marks >= 40) return "C";
  return "F";
}

function getGradeColor(grade) {
  if (grade === "O" || grade === "A+") return "grade--o";
  if (grade === "A") return "grade--a";
  if (grade === "B+" || grade === "B") return "grade--b";
  return "grade--c";
}

export default function StudentResult() {
  const [selectedSem, setSelectedSem] = useState("Semester 5");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropRef = useRef(null);

  const semList = Object.keys(semesterData);
  const data = semesterData[selectedSem];
  const totalMarks = data.subjects.reduce((s, sub) => s + sub.marks, 0);
  const maxMarks = data.subjects.length * 100;
  const percentage = ((totalMarks / maxMarks) * 100).toFixed(2);
  const finalGrade = getLetterGrade(parseFloat(percentage));
  const progressPct = Math.min((totalMarks / maxMarks) * 100, 100);

  function handleSemSelect(sem) {
    setSelectedSem(sem);
    setDropdownOpen(false);
  }

  return (
    <div className="sr-root">
      {/* ── Header ── */}
      <div className="sr-header">
        <div className="sr-header__left">
          <div className="sr-header__icon">
            <RiFileTextLine size={20} />
          </div>
          <div>
            <h1 className="sr-title">Academic Results</h1>
            <p className="sr-subtitle">
              {selectedSem} • CSE-A
            </p>
          </div>
        </div>

        <div className="sr-header__right">
          {/* Semester Dropdown */}
          <div className="sr-dropdown" ref={dropRef}>
            <button
              className={`sr-dropdown__btn ${dropdownOpen ? "sr-dropdown__btn--open" : ""}`}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <RiBarChartLine size={14} />
              {selectedSem}
              <RiArrowDownSLine
                size={16}
                className={`sr-dropdown__arrow ${dropdownOpen ? "sr-dropdown__arrow--up" : ""}`}
              />
            </button>
            {dropdownOpen && (
              <div className="sr-dropdown__menu">
                <p className="sr-dropdown__label">Select Semester</p>
                {semList.map((sem) => (
                  <button
                    key={sem}
                    className={`sr-dropdown__item ${selectedSem === sem ? "sr-dropdown__item--active" : ""}`}
                    onClick={() => handleSemSelect(sem)}
                  >
                    <span className="sr-dropdown__dot" />
                    {sem}
                    {selectedSem === sem && (
                      <RiCheckboxCircleLine size={14} className="sr-dropdown__check" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export buttons */}
          <button className="sr-export-btn sr-export-btn--excel">
            <RiFileExcel2Line size={15} />
            Excel
          </button>
          <button className="sr-export-btn sr-export-btn--pdf">
            <RiDownload2Line size={15} />
            PDF
          </button>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="sr-summary">
        {/* Total Marks */}
        <div className="sr-card sr-card--marks">
          <p className="sr-card__label">TOTAL MARKS</p>
          <div className="sr-card__value-row">
            <span className="sr-card__big">{totalMarks}</span>
            <span className="sr-card__denom">/{maxMarks}</span>
          </div>
          <div className="sr-progress-track">
            <div
              className="sr-progress-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Percentage */}
        <div className="sr-card sr-card--percent">
          <p className="sr-card__label">PERCENTAGE</p>
          <p className="sr-card__big sr-card__big--purple">{percentage}%</p>
          <p className="sr-card__meta">CGPA {data.cgpa} / 10</p>
        </div>

        {/* Final Grade */}
        <div className="sr-card sr-card--grade">
          <p className="sr-card__label">FINAL GRADE</p>
          <div className="sr-card__grade-display">
            <RiAwardLine size={18} className="sr-card__grade-icon" />
            <p className={`sr-card__grade-letter ${getGradeColor(finalGrade)}`}>
              {finalGrade}
            </p>
          </div>
          <p className="sr-card__meta">
            {data.promoted ? "Promoted" : "Detained"}
          </p>
        </div>
      </div>

      {/* ── Subject Table ── */}
      <div className="sr-table-wrap">
        <div className="sr-table-header">
          <h2 className="sr-table-title">Subject-wise breakdown</h2>
          <span className="sr-table-count">{data.subjects.length} subjects</span>
        </div>

        <table className="sr-table">
          <thead>
            <tr className="sr-thead-row">
              <th className="sr-th">Code</th>
              <th className="sr-th">Subject</th>
              <th className="sr-th sr-th--right">Marks</th>
              <th className="sr-th sr-th--center">Grade</th>
              <th className="sr-th sr-th--center">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.subjects.map((sub, i) => (
              <tr
                key={sub.code}
                className="sr-row"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <td className="sr-td sr-td--code">{sub.code}</td>
                <td className="sr-td sr-td--name">{sub.name}</td>
                <td className="sr-td sr-td--marks">
                  <div className="sr-marks-cell">
                    <span className="sr-marks-num">{sub.marks}/100</span>
                    <div className="sr-mini-bar">
                      <div
                        className="sr-mini-fill"
                        style={{ width: `${sub.marks}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="sr-td sr-td--center">
                  <span className={`sr-grade-badge ${getGradeColor(sub.grade)}`}>
                    {sub.grade}
                  </span>
                </td>
                <td className="sr-td sr-td--center">
                  <span className={`sr-status-badge ${sub.status === "Pass" ? "sr-status--pass" : "sr-status--fail"}`}>
                    <RiCheckboxCircleLine size={11} />
                    {sub.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer summary row */}
        <div className="sr-table-footer">
          <div className="sr-footer-stat">
            <span className="sr-footer-label">Total</span>
            <span className="sr-footer-val">{totalMarks} / {maxMarks}</span>
          </div>
          <div className="sr-footer-stat">
            <span className="sr-footer-label">Percentage</span>
            <span className="sr-footer-val sr-footer-val--accent">{percentage}%</span>
          </div>
          <div className="sr-footer-stat">
            <span className="sr-footer-label">CGPA</span>
            <span className="sr-footer-val sr-footer-val--accent">{data.cgpa} / 10</span>
          </div>
          <div className="sr-footer-stat">
            <span className="sr-footer-label">Result</span>
            <span className="sr-footer-val sr-footer-val--green">
              <RiMedalLine size={13} />
              {data.promoted ? "Promoted" : "Detained"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}