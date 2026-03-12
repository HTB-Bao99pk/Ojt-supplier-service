import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, User, Settings, LogOut, CalendarDays, Users } from "lucide-react";

export default function AppHeader() {
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);


    const currentUser = {
        name: "Vĩ Đại",
        role: "Admin",
        email: "vidai@capitalcoffee.com",
        avatar: "VĐ"
    };

    // Xử lý sự kiện click ra ngoài để tự động đóng Dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="relative z-10 flex h-[72px] shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 transition-all duration-300">

            {/* BÊN TRÁI: Nút lớn mô tả Phân Hệ (Module) giống với bên Supplier */}
            <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-xl font-bold text-white shadow-md transition-all hover:from-amber-600 hover:to-amber-700 hover:shadow-lg"
            >
                <div className="flex items-center gap-1.5 mr-1">
                    <Users className="h-5 w-5 opacity-90" />
                    <CalendarDays className="h-6 w-6" />
                </div>
                Staff & Shift Management
            </button>

            {/* BÊN PHẢI: Thông báo & Menu Đăng nhập */}
            <div className="flex items-center gap-4">
                {/* Nút Chuông */}
                <button className="relative flex items-center justify-center rounded-lg p-2 transition-colors hover:bg-gray-100">
                    <Bell className="h-5 w-5 text-gray-600" />
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-white bg-red-500"></span>
                </button>

                {/* Khối Avatar Dropdown (Code chuẩn Supplier) */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className={`flex items-center gap-3 rounded-lg border p-1 pr-1.5 transition-all ${
                            userMenuOpen ? "border-gray-300 bg-gray-50 shadow-sm" : "border-transparent hover:border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                        <div className="hidden pl-2 text-right md:block">
                            <p className="text-sm font-medium leading-tight text-gray-900">{currentUser.name}</p>
                            <p className="text-xs leading-tight text-gray-500">{currentUser.role}</p>
                        </div>
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-600">
                            <span className="text-sm font-bold text-white">{currentUser.avatar}</span>
                        </div>
                    </button>

                    {/* Menu xổ xuống */}
                    {userMenuOpen && (
                        <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                            <div className="border-b border-gray-100 px-4 py-3">
                                <p className="font-medium text-gray-900">{currentUser.name}</p>
                                <p className="text-sm text-gray-500">{currentUser.email}</p>
                            </div>
                            <div className="py-1">
                                <Link to="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                                    <User className="h-4 w-4 text-gray-500" /> My Profile
                                </Link>
                                <Link to="/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                                    <Settings className="h-4 w-4 text-gray-500" /> Settings
                                </Link>
                            </div>
                            <div className="mt-1 border-t border-gray-100 py-1">
                                <button onClick={() => navigate("/login")} className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                    <LogOut className="h-4 w-4 text-gray-500" /> Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}