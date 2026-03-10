import { useState } from "react";
import { Outlet } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Sidebar from "../components/Sidebar";
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_COLLAPSED } from "../config/constants";

export default function DashboardLayout() {
    // Trạng thái thu phóng của Sidebar
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar (Cố định góc trái) - Truyền hàm toggle xuống */}
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            {/* VÙNG NỘI DUNG CHÍNH */}
            {/* ĐÃ SỬA: Áp dụng paddingLeft vào vùng này để đẩy nội dung sang thay vì dùng marginLeft lẻ tẻ */}
            <div
                className="flex-1 flex flex-col transition-all duration-300"
                style={{ paddingLeft: isSidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH }}
            >
                {/* App Header (Thanh trên) */}
                {/* Header sẽ tự động nằm trong vùng padding của div cha */}
                <AppHeader isSidebarCollapsed={isSidebarCollapsed} />

                {/* Main Content (Nội dung chính) */}
                <main className="flex-1 p-6">
                    {/* Nơi hiển thị các trang con */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
}