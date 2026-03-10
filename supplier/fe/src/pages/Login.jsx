import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleMockLogin = (role) => {
        login(role); // Gọi hàm giả lập đăng nhập
        
        // Chuyển hướng tùy theo quyền
        if (role === 'ADMIN') {
            navigate('/admin/dashboard');
        } else {
            navigate('/supplier/products');
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-96 text-center">
                <h2 className="text-2xl font-bold mb-6">MOCK LOGIN</h2>
                <p className="text-sm text-gray-500 mb-6">Chọn quyền để vào hệ thống</p>
                
                <button 
                    onClick={() => handleMockLogin('ADMIN')}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg mb-3 hover:bg-blue-700"
                >
                    Đăng nhập làm ADMIN
                </button>
                
                <button 
                    onClick={() => handleMockLogin('SUPPLIER')}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                >
                    Đăng nhập làm SUPPLIER
                </button>
            </div>
        </div>
    );
}