import { useState } from "react";
import { Outlet } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Sidebar from "../components/Sidebar";
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_COLLAPSED } from "../config/constants";

export default function DashboardLayout() {
    // Trạng thái thu phóng của Sidebar
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen">
            {/* Sidebar (Cố định góc trái) - Truyền hàm toggle xuống */}
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            <div className="flex-1 flex flex-col bg-gray-50 transition-all duration-300">
                {/* App Header (Thanh trên) - Cần biết trạng thái thu phóng để căn lề trái */}
                <AppHeader isSidebarCollapsed={isSidebarCollapsed} />

                {/* Main Content (Nội dung chính) - Tự động giãn margin theo Sidebar */}
                <main
                    className="flex-1 p-6 transition-all duration-300"
                    style={{ marginLeft: isSidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH }}
                >
                    {/* Nơi hiển thị các trang con */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
}