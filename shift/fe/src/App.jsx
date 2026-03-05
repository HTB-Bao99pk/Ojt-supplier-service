import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import CreateShift from "./pages/shift/CreateShift";

function App() {
    return (
        <Routes>
            {/* Layout cha giống hệt supplier */}
            <Route path="/" element={<DashboardLayout />}>

                {/* Tạm thời index trỏ về Create Shift */}
                <Route index element={<CreateShift />} />

                {/* Shift routes */}
                <Route path="shifts/create" element={<CreateShift />} />

                {/* Các route sau này sẽ làm tiếp */}
                {/* <Route path="shifts" element={<ShiftList />} /> */}
            </Route>
        </Routes>
    );
}

export default App;