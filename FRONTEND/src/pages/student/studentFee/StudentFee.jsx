import { useState } from "react";
import { RiBankCardLine, RiCheckCircleLine, RiErrorWarningLine } from "react-icons/ri";
import "./StudentFee.css";

const StudentFee = () => {
  const [fees] = useState({
    totalAmount: 45000,
    paidAmount: 45000,
    pendingAmount: 0,
    status: "paid",
    semester: "Semester 5",
    dueDate: "May 15, 2024",
  });

  return (
    <div className="fee-container">
      <div className="fee-header">
        <div className="fee-header__icon">
          <RiBankCardLine size={32} />
        </div>
        <div>
          <h1>Fee Management</h1>
          <p>View and manage your fee payments</p>
        </div>
      </div>

      <div className="fee-content">
        {/* Fee Status Cards */}
        <div className="fee-cards">
          <div className="fee-card fee-card--total">
            <span className="fee-card__label">Total Amount</span>
            <span className="fee-card__value">₹{fees.totalAmount.toLocaleString()}</span>
          </div>
          <div className="fee-card fee-card--paid">
            <span className="fee-card__label">Paid Amount</span>
            <span className="fee-card__value">₹{fees.paidAmount.toLocaleString()}</span>
          </div>
          <div className="fee-card fee-card--pending">
            <span className="fee-card__label">Pending Amount</span>
            <span className="fee-card__value">₹{fees.pendingAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Fee Status */}
        <div className="fee-status">
          <div className={`fee-status__badge fee-status__badge--${fees.status}`}>
            {fees.status === "paid" ? (
              <>
                <RiCheckCircleLine size={20} />
                <span>Fees Paid</span>
              </>
            ) : (
              <>
                <RiErrorWarningLine size={20} />
                <span>Payment Due</span>
              </>
            )}
          </div>
          <p className="fee-status__details">
            {fees.semester} • Due: {fees.dueDate}
          </p>
        </div>

        {/* Payment Button */}
        {fees.pendingAmount > 0 && (
          <div className="fee-actions">
            <button className="fee-btn fee-btn--primary">Pay ₹{fees.pendingAmount.toLocaleString()}</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentFee;
