import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
    const { user } = useAuth();
    const location = useLocation();

    // 1. Nếu chưa đăng nhập -> Đẩy về trang Login và lưu lại vị trí cũ
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. Nếu đã đăng nhập nhưng KHÔNG CÓ QUYỀN
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Tự động đẩy về trang Dashboard tương ứng với Role của họ
        const redirectPath = user.role === 'ADMIN' ? "/admin/dashboard" : "/supplier/products";
        return <Navigate to={redirectPath} replace />;
    }

    // 3. Hợp lệ -> Render qua Outlet
    return <Outlet />;
}