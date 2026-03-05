import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import ShiftDashboard from "./pages/shift/ShiftDashboard";
import CreateShift from "./pages/shift/CreateShift";

function App() {
    return (
        <Routes>
            <Route path="/" element={<DashboardLayout />}>
                {/* Trang chủ mặc định là Shift Dashboard */}
                <Route index element={<ShiftDashboard />} />

                {/* Các route của Shift */}
                <Route path="shifts/create" element={<CreateShift />} />

                {/* Tạm thời index trỏ về Create Shift */}
                {/* <Route path="shifts" element={<ShiftList />} /> */}
                {/* <Route path="staff" element={<StaffList />} /> */}
            </Route>
        </Routes>
    );
}

export default App;