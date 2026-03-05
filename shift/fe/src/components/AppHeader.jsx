import { Bell, Search, Coffee } from "lucide-react";
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_COLLAPSED } from "../config/constants";

export default function AppHeader({ isSidebarCollapsed }) {
    return (
        <header
            className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10 transition-all duration-300"
            style={{ marginLeft: isSidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH }}
        >
            {/* Left side: Logo & BRAND NAME (Mới thêm) */}
            <div className="flex items-center gap-4">
                <div className="flex items-center">
                    <Coffee className="h-7 w-7 text-blue-500 mr-2.5" />
                    <span className="text-xl font-bold tracking-wider">SHIFT<span className="text-blue-400">SYNC</span></span>
                </div>
                <div className="text-gray-300 text-2xl font-extralight">|</div>
                <h2 className="text-sm font-medium text-gray-500">Shift Management</h2>
            </div>

            {/* Right side: Search & Bell actions */}
            <div className="flex items-center gap-4 flex-1 justify-end">
                <div className="relative w-80">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search shifts, staff, branches..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>

                <button className="relative p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
            </div>
        </header>
    );
}