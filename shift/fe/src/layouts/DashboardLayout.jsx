import { useState } from "react";
import { Outlet } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Sidebar from "../components/Sidebar";
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_COLLAPSED } from "../config/constants";

export default function DashboardLayout() {
    // Sidebar collapse state
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen">
            {/* Sidebar (Fixed on left) - Pass toggle function down */}
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            <div className="flex-1 flex flex-col bg-gray-50 transition-all duration-300">
                {/* App Header (Top bar) - Needs to know collapse state to adjust left margin */}
                <AppHeader isSidebarCollapsed={isSidebarCollapsed} />

                {/* Main Content (Main content area) - Automatically adjusts margin according to Sidebar */}
                <main
                    className="flex-1 p-6 transition-all duration-300"
                    style={{ marginLeft: isSidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH }}
                >
                    {/* Display child pages */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
}