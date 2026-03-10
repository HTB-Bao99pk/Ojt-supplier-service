import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login"; // Đảm bảo file Login.jsx nằm đúng ở src/pages/Login.jsx

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import SupplierLayout from "./layouts/SupplierLayout";

// Import Pages
import SupplierDashboard from "./pages/supplier/SupplierDashboard";
import SupplierList from "./pages/supplier/SupplierList";
import SupplierDetail from "./pages/supplier/SupplierDetail";
import UpdateSupplier from "./pages/supplier/UpdateSupplier";
import CreateSupplier from './pages/supplier/CreateSupplier';
import ViewApprovedSupplier from './pages/supplier/ViewApprovedSupplier';
import CompareSuppliers from './pages/supplier/CompareSuppliers';
import SupplierAuditLogs from "./pages/supplier/SupplierAuditLogs";
import ProductManagement from "./pages/supplier/ProductManagement";
import ProductDetail from "./pages/supplier/ProductDetail"; 
import UpdateProduct from "./pages/supplier/UpdateProduct";

function App() {
    return (
        <Routes>
            {/* 1. PUBLIC ROUTES (Ai cũng vào được) */}
            <Route path="/login" element={<Login />} />
            
            {/* Chuyển hướng trang chủ về login nếu gõ localhost:5173/ */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* 2. ADMIN ROUTES (Chỉ Admin mới được vào) */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route element={<AdminLayout />}>
                    <Route path="/admin/dashboard" element={<SupplierDashboard />} />
                    <Route path="/admin/suppliers" element={<SupplierList />} />
                    <Route path="/admin/suppliers/approved" element={<ViewApprovedSupplier />} />
                    <Route path="/admin/suppliers/create" element={<CreateSupplier />} />
                    {/* ĐẢM BẢO CÓ 2 DÒNG NÀY ĐỂ KHÔNG BỊ TRANG TRẮNG */}
                    <Route path="/admin/suppliers/:id" element={<SupplierDetail />} />
                    <Route path="/admin/suppliers/update/:id" element={<UpdateSupplier />} />
                    <Route path="/admin/suppliers/:id/audit" element={<SupplierAuditLogs />} />
                    
                    <Route path="/admin/products" element={<ProductManagement />} />
                    <Route path="/admin/products/:id" element={<ProductDetail />} />
                    <Route path="/admin/products/update/:id" element={<UpdateProduct />} />
                    
    </Route>
            </Route>

            {/* 3. SUPPLIER ROUTES (Chỉ Supplier mới được vào) */}
            <Route element={<ProtectedRoute allowedRoles={['SUPPLIER']} />}>
                <Route element={<SupplierLayout />}>
                    <Route path="/supplier/products" element={<ProductManagement />} />
                    <Route path="/supplier/products/compare/:productId" element={<CompareSuppliers />} />
                    <Route path="/supplier/products/:id" element={<ProductDetail />} />
                    <Route path="/supplier/products/update/:id" element={<UpdateProduct />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;