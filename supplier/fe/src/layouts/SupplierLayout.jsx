import { useState } from "react";
import { Outlet } from "react-router-dom";
import SupplierSidebar from "../components/SupplierSidebar";
import AppHeader from "../components/AppHeader"; 

export default function SupplierLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
            <SupplierSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex flex-1 flex-col overflow-hidden">
                <AppHeader />
                <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}