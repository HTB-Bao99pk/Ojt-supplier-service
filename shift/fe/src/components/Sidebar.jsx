import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    CalendarDays,
    CalendarPlus,
    Users,
    Settings,
    Coffee,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_COLLAPSED } from "../config/constants";

export default function Sidebar({ isCollapsed, onToggle }) {
    const location = useLocation();

    const menuItems = [
        { name: "Dashboard", path: "/", icon: LayoutDashboard },
        { name: "All Shifts", path: "/shifts", icon: CalendarDays },
        { name: "Create Shift", path: "/shifts/create", icon: CalendarPlus },
        { name: "Staff Directory", path: "/staff", icon: Users },
        { name: "Settings", path: "/settings", icon: Settings },
    ];

    return (
        <aside
            className="bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 z-20 transition-all duration-300 border-r border-slate-800"
            style={{ width: isCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH }}
        >
            {/* ================= LOGO & BRANDING ================= */}
            <div className="h-16 flex items-center px-5 border-b border-slate-800 shrink-0 overflow-hidden">
                <Coffee className={`h-8 w-8 text-amber-500 shrink-0 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />

                {!isCollapsed && (
                    <div className="flex flex-col whitespace-nowrap">
                        <span className="text-sm font-bold tracking-widest text-white leading-tight">
                            CAPITAL COFFEE
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                            Supply Chain Hub
                        </span>
                    </div>
                )}
            </div>

            {/* ================= NAVIGATION MENU ================= */}
            <nav className={`flex-1 ${isCollapsed ? 'py-6 px-2' : 'py-6 px-3'} space-y-2 overflow-y-auto scrollbar-hide`}>
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== "/");

                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center rounded-lg transition-all group ${
                                isActive
                                    ? "bg-amber-600 text-white shadow-md"
                                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                            } ${isCollapsed ? 'justify-center py-3' : 'px-3 py-2.5'}`}
                            title={isCollapsed ? item.name : ''}
                        >
                            <Icon className={`h-5 w-5 shrink-0 ${isCollapsed ? '' : 'mr-3'} ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`} />
                            {!isCollapsed && (
                                <span className="font-medium text-sm whitespace-nowrap">{item.name}</span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* ================= BOTTOM TOGGLE BUTTON ================= */}
            <div className="h-14 border-t border-slate-800 flex items-center justify-center shrink-0">
                <button
                    onClick={onToggle}
                    className="p-2 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white transition-colors focus:outline-none"
                    title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                    {isCollapsed ? (
                        <ChevronRight className="h-5 w-5" />
                    ) : (
                        <ChevronLeft className="h-5 w-5" />
                    )}
                </button>
            </div>
        </aside>
    );
}