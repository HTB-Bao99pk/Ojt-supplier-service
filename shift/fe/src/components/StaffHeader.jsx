import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bell, User, Settings, LogOut, Coffee } from "lucide-react";
// Import hàm lấy thông tin Staff từ API của bạn
import { getStaffById } from "../api/staffApi.js";

export default function StaffHeader() {
    const location = useLocation();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    // State lưu thông tin nhân viên (Giá trị mặc định trong lúc chờ tải dữ liệu)
    const [currentStaff, setCurrentStaff] = useState({
        name: "Đang tải...",
        role: "Staff",
        email: "loading@capitalcoffee.com",
        avatar: "..."
    });

    const realStaffId = "9aaa658f-df12-4a5d-a6d6-77989a2df312";

    // Gọi API để lấy thông tin ngay khi Header load lên
    useEffect(() => {
        fetchStaffInfo();
    }, []);

    const fetchStaffInfo = async () => {
        try {
            const data = await getStaffById(realStaffId);

            // Tùy thuộc vào backend của bạn trả về field tên là gì (thường là fullName hoặc name)
            const fullName = data.fullName || data.name || "Nhân viên ẩn danh";
            const staffCode = data.staffCode || data.id || "STF-???";
            const email = data.email || `${staffCode.toLowerCase()}@capitalcoffee.com`;

            // Logic tạo Avatar từ chữ cái đầu và cuối của tên
            const nameParts = fullName.trim().split(" ");
            let avatarLetters = "ST"; // Mặc định nếu lỗi
            if (nameParts.length >= 2) {
                avatarLetters = nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0);
            } else if (nameParts.length === 1 && nameParts[0] !== "") {
                avatarLetters = nameParts[0].charAt(0);
            }

            setCurrentStaff({
                name: fullName,
                role: `Staff (${staffCode})`,
                email: email,
                avatar: avatarLetters.toUpperCase()
            });
        } catch (error) {
            console.error("Lỗi khi tải thông tin nhân viên trên Header:", error);
            // Nếu lỗi (ví dụ API sập), giữ một tên mặc định để UI không bị vỡ
            setCurrentStaff({
                name: "Nguyễn Văn A",
                role: "Staff (STF-001)",
                email: "error@capitalcoffee.com",
                avatar: "NA"
            });
        }
    };

    // Tự động đóng Dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Đổi tiêu đề động dựa trên URL
    let pageTitle = "Dashboard";
    if (location.pathname.includes("schedule")) pageTitle = "Staff Schedules";
    else if (location.pathname.includes("attendance")) pageTitle = "My Attendance";
    else if (location.pathname.includes("report")) pageTitle = "Performance Report";

    return (
        <header className="relative z-10 flex h-[72px] shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 transition-all duration-300">

            {/* BÊN TRÁI: Badge Phân hệ */}
            <button
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-xl font-bold text-white shadow-md transition-all cursor-default"
            >
                <div className="flex items-center gap-1.5 mr-1">
                    <Coffee className="h-6 w-6" />
                </div>
                Staff Portal
            </button>

            {/* BÊN PHẢI: Thông báo & Menu Đăng nhập */}
            <div className="flex items-center gap-4">
                {/* Nút Chuông */}
                <button className="relative flex items-center justify-center rounded-lg p-2 transition-colors hover:bg-gray-100">
                    <Bell className="h-5 w-5 text-gray-600" />
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-white bg-red-500"></span>
                </button>

                {/* Khối Avatar Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className={`flex items-center gap-3 rounded-lg border p-1 pr-1.5 transition-all ${
                            userMenuOpen ? "border-gray-300 bg-gray-50 shadow-sm" : "border-transparent hover:border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                        <div className="hidden pl-2 text-right md:block">
                            <p className="text-sm font-medium leading-tight text-gray-900">{currentStaff.name}</p>
                            <p className="text-xs leading-tight text-gray-500">{currentStaff.role}</p>
                        </div>
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-600">
                            <span className="text-sm font-bold text-white">{currentStaff.avatar}</span>
                        </div>
                    </button>

                    {/* Menu xổ xuống */}
                    {userMenuOpen && (
                        <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                            <div className="border-b border-gray-100 px-4 py-3">
                                <p className="font-medium text-gray-900">{currentStaff.name}</p>
                                <p className="text-sm text-gray-500">{currentStaff.email}</p>
                            </div>
                            <div className="py-1">
                                <Link to="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                                    <User className="h-4 w-4 text-gray-500" /> My Profile
                                </Link>
                                <Link to="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
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