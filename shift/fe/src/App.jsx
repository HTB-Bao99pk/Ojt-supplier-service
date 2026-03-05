import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";

import ShiftDashboard from "./pages/shift/ShiftDashboard";
import CreateShift from "./pages/shift/CreateShift";
import ShiftList from "./pages/shift/ShiftList";
import UpdateShift from "./pages/shift/UpdateShift";

import Attendance from "./pages/shift/Attendance";
import ShiftAttendance from "./pages/shift/ShiftAttendance";

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

                {/* Router cho Attendance */}
                <Route path="attendance" element={<Attendance />} />
                <Route path="attendance/:shiftId" element={<ShiftAttendance />} />

            </Route>
        </Routes>
    );
}

export default App;