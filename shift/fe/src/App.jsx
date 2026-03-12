import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// === Các Layouts ===
import DashboardLayout from "./layouts/DashboardLayout";
import StaffLayout from "./layouts/StaffLayout";

// === Các trang của Admin ===
import ShiftDashboard from "./pages/Shift/ShiftDashboard";
import CreateShift from "./pages/Shift/CreateShift";
import ShiftList from "./pages/Shift/ShiftList";
import UpdateShift from "./pages/Shift/UpdateShift";
import AssignStaff from "./pages/Shift/AssignStaff";

import Attendance from "./pages/Shift/Attendance";
import ShiftAttendance from "./pages/Shift/ShiftAttendance";
import AttendanceReport from "./pages/Shift/AttendanceReport";
import StaffAttendanceHistory from "./pages/Shift/StaffAttendanceHistory";

import StaffList from "./pages/Admin/StaffList";
import CreateStaff from "./pages/Admin/CreateStaff";
import UpdateStaff from "./pages/Admin/UpdateStaff";
import StaffSchedules from "./pages/Admin/StaffSchedules";

// === Các trang của Staff Portal ===
import StaffDashboardPortal from "./pages/Staff/StaffDashboard.jsx";
import StaffScheduleView from "./pages/Staff/StaffScheduleView.jsx";
import StaffAttendanceView from "./pages/Staff/StaffAttendanceView.jsx";
import StaffReportView from "./pages/Staff/StaffReportView.jsx";

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
                    <Route path="admin" element={<StaffList />} />
                    <Route path="admin/create" element={<CreateStaff />} />
                    <Route path="admin/update/:id" element={<UpdateStaff />} />
                    <Route path="admin/schedules" element={<StaffSchedules />} />
                </Route>

                {/* ======================= STAFF PORTAL ROUTES ======================= */}
                <Route path="/staff" element={<StaffLayout />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
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