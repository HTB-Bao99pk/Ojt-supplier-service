import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";

import SupplierDashboard from "./pages/supplier/SupplierDashboard";
import SupplierList from "./pages/supplier/SupplierList";
import SupplierDetail from "./pages/supplier/SupplierDetail";
import UpdateSupplier from "./pages/supplier/UpdateSupplier";
import CreateSupplier from './pages/supplier/CreateSupplier'

function App() {
    return (
        <Routes>
            {/* Layout cha */}
            <Route path="/" element={<DashboardLayout />}>

                {/* Trang mặc định khi vào "/" */}
                <Route index element={<SupplierDashboard />} />

                {/* Supplier routes */}
                <Route path="suppliers" element={<SupplierList />} />
                <Route path="suppliers/:id" element={<SupplierDetail />} />
                <Route path="suppliers/update/:id" element={<UpdateSupplier />} />
                <Route path="/suppliers/create" element={<CreateSupplier />} />

            </Route>
        </Routes>
    );
}

export default App;