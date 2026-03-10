import React, { useState, useRef, useEffect } from "react";
import { Coffee, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_COLLAPSED } from "../config/constants";

export default function AppHeader({ isSidebarCollapsed }) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Handle click outside to auto-close Dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header
            className="h-16 shrink-0 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-[100] transition-all duration-300"
            style={{ marginLeft: isSidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH }}
        >
            {/* Left side: Logo & BRAND NAME (Keep 100% original code) */}
            <div className="flex items-center gap-4">
                <div className="flex items-center">
                    <Coffee className="h-7 w-7 text-blue-500 mr-2.5" />
                    <span className="text-xl font-bold tracking-wider">SHIFT<span className="text-blue-400">SYNC</span></span>
                </div>
                <div className="text-gray-300 text-2xl font-extralight">|</div>
                <h2 className="text-sm font-medium text-gray-500">Shift Management</h2>
            </div>

            {/* Right side: Replace Search & Bell with Avatar Dropdown */}
            <div className="flex items-center gap-4 flex-1 justify-end relative" ref={dropdownRef}>

                {/* Avatar Button */}
                <div
                    className="flex items-center gap-3 cursor-pointer p-1.5 pr-2 hover:bg-slate-50 rounded-xl transition-all"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                    {/* Text info */}
                    <div className="hidden md:flex flex-col items-end justify-center mt-0.5">
                        <span className="text-sm font-bold text-gray-900 leading-none mb-1.5">
                            Vĩ Đại
                        </span>
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider leading-none">
                            Admin
                        </span>
                    </div>

                    {/* Avatar Image */}
                    <div className="flex items-center gap-2">
                        <img
                            src="https://ui-avatars.com/api/?name=Vĩ+Đại&background=0284c7&color=fff&rounded=true&bold=true&size=128"
                            alt="User Avatar"
                            className="w-9 h-9 rounded-full shadow-sm border-2 border-white ring-1 ring-gray-100 object-cover"
                        />
                        <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </div>
                </div>

                {/* MENU DROPDOWN (My Profile, Settings, Sign out) */}
                {isProfileOpen && (
                    <div className="absolute right-0 top-[calc(100%+4px)] w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                        <div className="px-4 py-3 border-b border-gray-50 md:hidden">
                            <p className="text-sm font-bold text-gray-900">Vĩ Đại</p>
                            <p className="text-xs text-gray-500 font-bold uppercase mt-1">Admin</p>
                        </div>

                        <div className="p-1.5">
                            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-colors">
                                <User size={16} className="text-gray-400" /> My Profile
                            </button>
                            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-colors">
                                <Settings size={16} className="text-gray-400" /> Settings
                            </button>
                        </div>

                        <div className="p-1.5 border-t border-gray-100 mt-1">
                            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                                <LogOut size={16} /> Sign out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}