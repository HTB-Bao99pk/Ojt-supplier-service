import "./SupplierDashboard.css";

export default function SupplierDashboard() {
    return (
        <>
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
        </>
    );
}