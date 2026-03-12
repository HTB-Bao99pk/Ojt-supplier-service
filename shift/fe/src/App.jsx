// shift/fe/src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom"; // Bổ sung Navigate ở đây
import { Toaster } from "react-hot-toast";

// === Các Layouts ===
import DashboardLayout from "./layouts/DashboardLayout";
import StaffLayout from "./layouts/StaffLayout"; // Bạn nhớ kiểm tra xem file này có .jsx không nhé, nếu lỗi thì thêm .jsx vào

// === Các trang của Admin ===
import ShiftDashboard from "./pages/shift/ShiftDashboard";
import CreateShift from "./pages/shift/CreateShift";
import ShiftList from "./pages/shift/ShiftList";
import UpdateShift from "./pages/shift/UpdateShift";
import AssignStaff from "./pages/shift/AssignStaff";

import Attendance from "./pages/shift/Attendance";
import ShiftAttendance from "./pages/shift/ShiftAttendance";
import AttendanceReport from "./pages/shift/AttendanceReport";
import StaffAttendanceHistory from "./pages/shift/StaffAttendanceHistory";

import StaffList from "./pages/staff/StaffList";
import CreateStaff from "./pages/staff/CreateStaff";
import UpdateStaff from "./pages/staff/UpdateStaff";
import StaffSchedules from "./pages/staff/StaffSchedules"; // Bỏ .jsx đi cho đồng bộ, hoặc thêm .jsx cho tất cả

// === Các trang của Staff Portal ===
// (Đã thêm đuôi .jsx để đề phòng Vite bắt lỗi)
import StaffDashboardPortal from "./pages/staff-portal/StaffDashboard.jsx";
import StaffScheduleView from "./pages/staff-portal/StaffScheduleView.jsx";
import StaffAttendanceView from "./pages/staff-portal/StaffAttendanceView.jsx";
import StaffReportView from "./pages/staff-portal/StaffReportView.jsx";

function App() {
    return (
        <>
            <Toaster position="top-center" />
            <Routes>
                {/* ======================= ADMIN ROUTES ======================= */}
                <Route path="/" element={<DashboardLayout />}>
                    <Route index element={<ShiftDashboard />} />

                    <Route path="shifts" element={<ShiftList />} />
                    <Route path="shifts/create" element={<CreateShift />} />
                    <Route path="shifts/update/:id" element={<UpdateShift />} />
                    <Route path="shifts/assign" element={<AssignStaff />} />

                    <Route path="attendance" element={<Attendance />} />
                    <Route path="attendance/:shiftId" element={<ShiftAttendance />} />
                    <Route path="attendance-report" element={<AttendanceReport />} />
                    <Route path="attendance-history" element={<StaffAttendanceHistory />} />

                    <Route path="staff" element={<StaffList />} />
                    <Route path="staff/create" element={<CreateStaff />} />
                    <Route path="staff/update/:id" element={<UpdateStaff />} />
                    <Route path="staff/schedules" element={<StaffSchedules />} />
                </Route>

                {/* ======================= STAFF PORTAL ROUTES ======================= */}
                <Route path="/staff-portal" element={<StaffLayout />}>
                    {/* Tự động chuyển hướng /staff-portal sang /staff-portal/dashboard */}
                    <Route index element={<Navigate to="dashboard" replace />} />

                    {/* Mình đổi tên biến import thành StaffDashboardPortal để không bị trùng tên với StaffDashboard của Admin */}
                    <Route path="dashboard" element={<StaffDashboardPortal />} />
                    <Route path="schedule" element={<StaffScheduleView />} />
                    <Route path="attendance" element={<StaffAttendanceView />} />
                    <Route path="report" element={<StaffReportView />} />
                </Route>

            </Routes>
        </>
    );
}

export default App;