import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";

import SupplierDashboard from "./pages/supplier/SupplierDashboard";
import SupplierList from "./pages/supplier/SupplierList";
import SupplierDetail from "./pages/supplier/SupplierDetail";
import UpdateSupplier from "./pages/supplier/UpdateSupplier";
import CreateSupplier from './pages/supplier/CreateSupplier';
import ViewApprovedSupplier from './pages/supplier/ViewApprovedSupplier';
import CompareSuppliers from './pages/supplier/CompareSuppliers';
import SupplierAuditLogs from "./pages/supplier/SupplierAuditLogs";
import ProductManagement from "./pages/supplier/ProductManagement";

function App() {
    return (
        <Routes>
            {/* Layout cha */}
            <Route path="/" element={<DashboardLayout />}>

                {/* Trang mặc định khi vào "/" */}
                <Route index element={<SupplierDashboard />} />

                {/* Supplier routes */}
                <Route path="suppliers" element={<SupplierList />} />
                <Route path="suppliers/approved" element={<ViewApprovedSupplier />} />
                <Route path="suppliers/:id" element={<SupplierDetail />} />
                <Route path="suppliers/update/:id" element={<UpdateSupplier />} />
                <Route path="/suppliers/create" element={<CreateSupplier />} />
                <Route path="suppliers/compare/:productId" element={<CompareSuppliers />} />
                <Route path="suppliers/:id/audit" element={<SupplierAuditLogs />} />
                <Route path="products" element={<ProductManagement />} />
            </Route>
        </Routes>
    );
}

export default App;