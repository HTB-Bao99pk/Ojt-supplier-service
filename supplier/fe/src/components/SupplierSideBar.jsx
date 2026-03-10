import { Link, useLocation } from "react-router-dom";
import { Package, Menu, X, Coffee } from "lucide-react";

export default function SupplierSidebar({ sidebarOpen, setSidebarOpen }) {
    const location = useLocation();

    // Menu chỉ chứa tính năng của SUPPLIER
    const navigationItems = [
        { path: "/supplier/products", label: "Product Management", icon: Package },
    ];

    const isActive = (path) => location.pathname.startsWith(path);

    return (
        <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-blue-900 to-blue-950 text-white transition-all duration-300 flex flex-col z-20 shrink-0`}>
            <div className="p-4 flex items-center gap-3 border-b border-blue-800">
                <div className="bg-blue-600 p-2 rounded-lg flex-shrink-0">
                    <Coffee className="w-6 h-6" />
                </div>
                {sidebarOpen && (
                    <div className="overflow-hidden whitespace-nowrap">
                        <h1 className="font-bold text-lg leading-tight">Capital Coffee</h1>
                        <p className="text-xs text-blue-300">SUPPLIER PORTAL</p>
                    </div>
                )}
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive(item.path) ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-100 hover:bg-blue-800'}`}>
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            {sidebarOpen && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-4 border-t border-blue-800 hover:bg-blue-800 transition-colors flex justify-center items-center">
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
        </aside>
    );
}