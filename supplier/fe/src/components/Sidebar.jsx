import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Menu, X, Coffee, CheckCircle } from "lucide-react";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
    const location = useLocation();

    // Menu chỉ giữ lại Dashboard, Supplier Management và Supplier (approved view)
    const navigationItems = [
        { path: "/", label: "Dashboard", icon: LayoutDashboard },
        { path: "/suppliers", label: "Supplier Management", icon: Users },
        { path: "/suppliers/approved", label: "Supplier", icon: CheckCircle },
    ];

    const isActive = (path) => {
        // root exact
        if (path === "/") return location.pathname === "/";

        // make approved page exact-match so it doesn't unintentionally activate the parent
        if (path === "/suppliers/approved") return location.pathname === "/suppliers/approved";

        // for the Supplier Management parent, match /suppliers and its subpaths except /suppliers/approved
        if (path === "/suppliers") {
            return (
                location.pathname === "/suppliers" ||
                (location.pathname.startsWith("/suppliers/") && !location.pathname.startsWith("/suppliers/approved"))
            );
        }

        // fallback: startsWith
        return location.pathname.startsWith(path);
    };

    return (
        <aside
            className={`${
                sidebarOpen ? 'w-64' : 'w-20'
            } bg-gradient-to-b from-amber-900 to-amber-950 text-white transition-all duration-300 flex flex-col z-20 shrink-0`}
        >
            {/* Logo */}
            <div className="p-4 flex items-center gap-3 border-b border-amber-800">
                <div className="bg-amber-600 p-2 rounded-lg flex-shrink-0">
                    <Coffee className="w-6 h-6" />
                </div>
                {sidebarOpen && (
                    <div className="overflow-hidden whitespace-nowrap">
                        <h1 className="font-bold text-lg leading-tight">Capital Coffee</h1>
                        <p className="text-xs text-amber-300">Supply Chain Hub</p>
                    </div>
                )}
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                                active
                                    ? 'bg-amber-600 text-white shadow-sm'
                                    : 'text-amber-100 hover:bg-amber-800'
                            }`}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            {sidebarOpen && (
                                <span className="text-sm font-medium whitespace-nowrap">
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Nút Thu gọn / Mở rộng Sidebar */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-4 border-t border-amber-800 hover:bg-amber-800 transition-colors flex justify-center items-center"
            >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
        </aside>
    );
}