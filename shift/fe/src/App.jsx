import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";

import ShiftDashboard from "./pages/shift/ShiftDashboard";
import CreateShift from "./pages/shift/CreateShift";
import ShiftList from "./pages/shift/ShiftList";
import UpdateShift from "./pages/shift/UpdateShift";

import Attendance from "./pages/shift/Attendance";
import ShiftAttendance from "./pages/shift/ShiftAttendance";
import AttendanceReport from "./pages/shift/AttendanceReport";
import StaffList from "./pages/staff/StaffList";
import CreateStaff from "./pages/staff/CreateStaff";
import UpdateStaff from "./pages/staff/UpdateStaff";
import AssignStaff from "./pages/shift/AssignStaff";
import StaffAttendanceHistory from "./pages/shift/StaffAttendanceHistory";
function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        {/* Dashboard */}
        <Route index element={<ShiftDashboard />} />

        {/* Router cho Shift */}
        <Route path="shifts" element={<ShiftList />} />
        <Route path="shifts/create" element={<CreateShift />} />
        <Route path="shifts/update/:id" element={<UpdateShift />} />
          <Route path="shifts/assign" element={<AssignStaff />} />
        {/* Router cho Attendance */}
        <Route path="attendance" element={<Attendance />} />
        <Route path="attendance/:shiftId" element={<ShiftAttendance />} />
          <Route path="attendance-report" element={<AttendanceReport />} />
          <Route path="attendance-history" element={<StaffAttendanceHistory />} />
        {/* Router cho Staff */}
        <Route path="staff" element={<StaffList />} />
        <Route path="staff/create" element={<CreateStaff />} />
        <Route path="staff/update/:id" element={<UpdateStaff />} />
      </Route>
    </Routes>
  );
}

export default App;
