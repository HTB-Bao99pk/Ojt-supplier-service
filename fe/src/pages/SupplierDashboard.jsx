import { useNavigate } from "react-router-dom";
import "./SupplierDashboard.css";

export default function SupplierDashboard() {
    const navigate = useNavigate();

    return (
        <div className="dashboard-layout">

            {/* SIDEBAR */}
            <aside className="dashboard-sidebar">
                <div className="dashboard-brand">
                    <h2>Capital Coffee</h2>
                    <span>Supplier Hub</span>
                </div>

                <nav>
                    <button className="active" onClick={() => navigate("/")}>
                        Dashboard
                    </button>

                    <button onClick={() => navigate("/suppliers")}>
                        Supplier Management
                    </button>
                </nav>
            </aside>

            {/* MAIN */}
            <div className="dashboard-main">

                <header className="dashboard-topbar">
                    <input placeholder="Search suppliers..." />
                    <div className="dashboard-avatar">AD</div>
                </header>

                <div className="dashboard-content">

                    <h1>Supplier Overview</h1>

                    <div className="dashboard-stats">
                        <div className="stat-card total">
                            <h4>Total Suppliers</h4>
                            <p>128</p>
                        </div>

                        <div className="stat-card approved">
                            <h4>Approved</h4>
                            <p>95</p>
                        </div>

                        <div className="stat-card suspended">
                            <h4>Suspended</h4>
                            <p>20</p>
                        </div>

                        <div className="stat-card pending">
                            <h4>Pending</h4>
                            <p>13</p>
                        </div>
                    </div>

                    <div className="dashboard-charts">
                        <div className="chart-box">
                            Monthly Supplier Growth
                        </div>

                        <div className="chart-box">
                            Status Distribution
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}