import { useState } from "react";
import { Outlet } from "react-router-dom";
import StaffSidebar from "../components/StaffSidebar";
import StaffHeader from "../components/StaffHeader";
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_COLLAPSED } from "../config/constants";

export default function StaffLayout() {
    // Trạng thái thu phóng của Sidebar
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar (Truyền state xuống) */}
            <StaffSidebar
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            {/* VÙNG NỘI DUNG CHÍNH (Đẩy lề tự động theo Sidebar) */}
            <div
                className="flex-1 flex flex-col transition-all duration-300"
                style={{ paddingLeft: isSidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH }}
            >
                <StaffHeader />

                {/* Main Content */}
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}