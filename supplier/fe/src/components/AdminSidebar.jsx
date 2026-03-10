import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Menu, X, Coffee, CheckCircle, LogOut, Package } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const navigationItems = [
        { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { path: "/admin/suppliers", label: "Supplier Management", icon: Users },
        { path: "/admin/suppliers/approved", label: "Approved Suppliers", icon: CheckCircle },
        { path: "/admin/products", label: "Product Management", icon: Package },
    ];

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const isActive = (path) => {
        if (path === "/admin/dashboard") return location.pathname === "/admin/dashboard";
        if (path === "/admin/suppliers/approved") return location.pathname === "/admin/suppliers/approved";
        if (path === "/admin/suppliers") {
            return (
                location.pathname === "/admin/suppliers" ||
                (location.pathname.startsWith("/admin/suppliers/") && !location.pathname.startsWith("/admin/suppliers/approved"))
            );
        }
        return location.pathname.startsWith(path);
    };

    return (
        <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-amber-900 to-amber-950 text-white transition-all duration-300 flex flex-col z-20 shrink-0`}>
            {/* Logo Section */}
            <div className="p-4 flex items-center gap-3 border-b border-amber-800">
                <div className="bg-amber-600 p-2 rounded-lg flex-shrink-0">
                    <Coffee className="w-6 h-6" />
                </div>
                {sidebarOpen && (
                    <div className="overflow-hidden whitespace-nowrap">
                        <h1 className="font-bold text-lg leading-tight">Capital Coffee</h1>
                        <p className="text-xs text-amber-300">ADMIN PORTAL</p>
                    </div>
                )}
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive(item.path) ? 'bg-amber-600 text-white shadow-sm' : 'text-amber-100 hover:bg-amber-800'}`}>
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            {sidebarOpen && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout Button */}
            <button 
                onClick={handleLogout}
                className="mx-4 mb-2 flex items-center gap-3 px-3 py-2.5 text-red-300 hover:bg-red-900/30 rounded-lg transition-colors"
            >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
            </button>

            {/* Toggle Sidebar Button */}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-4 border-t border-amber-800 hover:bg-amber-800 transition-colors flex justify-center items-center">
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
        </aside>
    );
}