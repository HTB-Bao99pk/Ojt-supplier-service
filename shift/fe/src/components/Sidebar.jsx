import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    CalendarDays,
    CalendarPlus,
    Users,
    Coffee,
    Menu,
    X,
    BarChart3,
    UserCheck,
    Search,
    FileText
} from "lucide-react";
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_COLLAPSED } from "../config/constants";

export default function Sidebar({ isCollapsed, onToggle }) {
    const location = useLocation();

    const menuItems = [
        { name: "Dashboard", path: "/", icon: LayoutDashboard, exact: true },
        { name: "All Shifts", path: "/shifts", icon: CalendarDays, exact: true },
        { name: "Create Shift", path: "/shifts/create", icon: CalendarPlus },
        { name: "Assign Staff", path: "/shifts/assign", icon: UserCheck },
        { name: "Attendance", path: "/attendance", icon: CalendarDays },
        { name: "Reports & KPI", path: "/attendance-report", icon: BarChart3 },
        { name: "Staff Directory", path: "/staff", icon: Users },
        { name: "Staff Schedules", path: "/staff/schedules", icon: FileText },
        { name: "Staff History", path: "/attendance-history", icon: Search },
    ];

    return (
        <aside
            className="bg-gradient-to-b from-amber-900 to-amber-950 text-white flex flex-col h-screen fixed left-0 top-0 z-20 transition-all duration-300 border-r border-amber-800"
            style={{ width: isCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH }}
        >
            <div className="h-16 flex items-center px-4 border-b border-amber-800 shrink-0 overflow-hidden">
                <div className={`bg-amber-600 p-2 rounded-lg flex-shrink-0 ${isCollapsed ? 'mx-auto' : 'mr-3'}`}>
                    <Coffee className="w-6 h-6" />
                </div>
                {!isCollapsed && (
                    <div className="flex flex-col whitespace-nowrap">
                        <span className="text-sm font-bold tracking-widest text-white leading-tight">
                            CAPITAL COFFEE
                        </span>
                        <span className="text-[10px] text-amber-300 uppercase tracking-wider mt-0.5">
                            Supply Chain Hub
                        </span>
                    </div>
                )}
            </div>

            <nav className={`flex-1 ${isCollapsed ? 'py-6 px-2' : 'py-6 px-3'} space-y-2 overflow-y-auto scrollbar-hide`}>
                {menuItems.map((item) => {
                    const Icon = item.icon;

                    const isActive =
                        location.pathname === item.path ||
                        (!item.exact &&
                            location.pathname.startsWith(item.path)
                            && item.path !== "/staff"
                            && !location.pathname.startsWith("/attendance"));

                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center rounded-lg transition-colors ${
                                isActive
                                    ? 'bg-amber-600 text-white shadow-sm'
                                    : 'text-amber-100 hover:bg-amber-800'
                            } ${isCollapsed ? 'justify-center py-3' : 'px-3 py-2.5 gap-3'}`}
                            title={isCollapsed ? item.name : ''}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            {!isCollapsed && (
                                <span className="text-sm font-medium whitespace-nowrap">{item.name}</span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <button
                onClick={onToggle}
                className="p-4 border-t border-amber-800 hover:bg-amber-800 transition-colors flex justify-center items-center h-16 shrink-0"
                title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
                {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </button>
        </aside>
    );
}