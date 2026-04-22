import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../Auth/login';
import StudentDashboard from '../pages/student/studentDashboard/StudentDashboard';
import StudentResult from '../pages/student/studentResults/StudentResult';
import StudentFee from '../pages/student/studentFee/StudentFee';
import StudentHallticket from '../pages/student/studentHallticket/StudentHallticket';
import StudentProfile from '../pages/student/studentProfile/StudentProfile';
import AdminDashboard from '../pages/admin/adminDashboard/AdminDashboard';

// Protected Route Component
const ProtectedRoute = ({ element, requiredRole }) => {
    const userRole = localStorage.getItem('userRole');
    
    if (!userRole) {
        return <Navigate to="/" replace />;
    }
    
    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/" replace />;
    }
    
    return element;
};

const AppRouting = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route 
                path="/student-dashboard" 
                element={<ProtectedRoute element={<StudentDashboard />} requiredRole="student" />} 
            />
            <Route 
                path="/student-results" 
                element={<ProtectedRoute element={<StudentResult />} requiredRole="student" />} 
            />
            <Route 
                path="/student-fees" 
                element={<ProtectedRoute element={<StudentFee />} requiredRole="student" />} 
            />
            <Route 
                path="/student-hallticket" 
                element={<ProtectedRoute element={<StudentHallticket />} requiredRole="student" />} 
            />
            <Route 
                path="/student-profile" 
                element={<ProtectedRoute element={<StudentProfile />} requiredRole="student" />} 
            />
            <Route 
                path="/admin-dashboard" 
                element={<ProtectedRoute element={<AdminDashboard />} requiredRole="admin" />} 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRouting;