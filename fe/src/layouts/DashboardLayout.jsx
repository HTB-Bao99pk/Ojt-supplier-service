import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/AppHeader";

const DashboardLayout = () => {
    return (
        <div style={{ display: "flex" }}>
            <Sidebar />

            <div style={{ flex: 1 }}>
                <Header />

                <div style={{
                    padding: "30px",
                    minHeight: "100vh",
                    background: "linear-gradient(to bottom, #f6e6a6, #e6d27d)"
                }}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;