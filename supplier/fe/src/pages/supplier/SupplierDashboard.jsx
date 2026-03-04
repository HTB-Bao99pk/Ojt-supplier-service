import { useEffect, useState } from 'react';
import {
    Users,
    CheckCircle,
    AlertCircle,
    Clock,
    TrendingUp,
    FileText,
    ArrowRight,
    PlusCircle
} from 'lucide-react';
import {
    LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Link } from 'react-router-dom';
import { getAllSuppliers } from '../../api/supplierApi'; // Thêm import API

export default function SupplierDashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        approved: 0,
        pending: 0,
        suspended: 0
    });
    const [recentSuppliers, setRecentSuppliers] = useState([]);
    const [growthData, setGrowthData] = useState([]);
    const [dynamicAlerts, setDynamicAlerts] = useState([]);

    // Gọi API và tính toán dữ liệu khi vừa vào trang
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Gọi API lấy tối đa 100 suppliers để làm thống kê
                const result = await getAllSuppliers(0, 100);
                const list = result?.content || result || [];

                // 1. Tính toán KPIs
                let approvedCount = 0;
                let pendingCount = 0;
                let suspendedCount = 0;

                list.forEach(s => {
                    if (s.status === 'APPROVED') approvedCount++;
                    if (s.status === 'PENDING') pendingCount++;
                    if (s.status === 'SUSPENDED') suspendedCount++;
                });

                setStats({
                    total: list.length,
                    approved: approvedCount,
                    pending: pendingCount,
                    suspended: suspendedCount
                });

                // 2. Lấy 4 Supplier mới cập nhật nhất cho bảng Recent
                const sortedList = [...list].sort((a, b) => new Date(b.updateAt) - new Date(a.updateAt));
                setRecentSuppliers(sortedList.slice(0, 4));

                // 3. Gom nhóm dữ liệu cho Biểu đồ Tăng trưởng (Line Chart) theo Tháng
                const monthCounts = {};
                [...list].reverse().forEach(s => {
                    const date = new Date(s.updateAt || Date.now());
                    const month = date.toLocaleString('en-US', { month: 'short' });
                    monthCounts[month] = (monthCounts[month] || 0) + 1;
                });

                const chartData = Object.keys(monthCounts).map(month => ({
                    month,
                    suppliers: monthCounts[month]
                }));

                // Nếu dữ liệu quá ít (chỉ có 1 tháng), ta nhét thêm dữ liệu ảo để biểu đồ vẽ được đường
                if (chartData.length === 1) {
                    chartData.unshift({ month: 'Prev', suppliers: 0 });
                }
                setGrowthData(chartData);

                // 4. Tạo thông báo (Alerts) thông minh dựa trên dữ liệu thật
                const alerts = [];
                if (pendingCount > 0) {
                    alerts.push({ type: 'warning', title: 'Pending Approvals', message: `You have ${pendingCount} suppliers waiting for review.`, time: 'Just now' });
                }
                if (suspendedCount > 0) {
                    alerts.push({ type: 'critical', title: 'Suspended Accounts', message: `There are ${suspendedCount} suspended suppliers requiring attention.`, time: 'Recently' });
                }
                if (sortedList.length > 0) {
                    alerts.push({ type: 'info', title: 'Recent Activity', message: `${sortedList[0].name} was recently updated.`, time: 'Today' });
                }
                setDynamicAlerts(alerts);

            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Cấu hình dữ liệu cho KPI Cards
    const kpis = [
        { title: 'Total Suppliers', value: stats.total, change: 'All time', icon: Users, color: 'bg-blue-500', trendColor: 'text-blue-600' },
        { title: 'Approved', value: stats.approved, change: 'Active partners', icon: CheckCircle, color: 'bg-green-500', trendColor: 'text-green-600' },
        { title: 'Pending Approval', value: stats.pending, change: 'Needs review', icon: Clock, color: 'bg-amber-500', trendColor: 'text-amber-600' },
        { title: 'Suspended', value: stats.suspended, change: 'Inactive', icon: AlertCircle, color: 'bg-red-500', trendColor: 'text-red-600' },
    ];

    // Cấu hình dữ liệu cho Pie Chart
    const statusDistribution = [
        { name: 'Approved', value: stats.approved, color: '#10b981' },
        { name: 'Pending', value: stats.pending, color: '#f59e0b' },
        { name: 'Suspended', value: stats.suspended, color: '#ef4444' },
    ].filter(item => item.value > 0);

    // Hàm format ngày giờ đẹp cho Recent List
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' });
    };

    if (loading) {
        return <div className="p-10 text-gray-500 flex justify-center">Loading dashboard data...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Supplier Overview</h1>
                <p className="mt-1 text-gray-600">Track and manage your supply chain partners</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {kpis.map((kpi) => {
                    const Icon = kpi.icon;
                    return (
                        <div key={kpi.title} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                            <div className="mb-4 flex items-center justify-between">
                                <div className={`${kpi.color} rounded-lg p-3 shadow-sm`}>
                                    <Icon className="h-6 w-6 text-white" />
                                </div>
                                <div className={`flex items-center gap-1 text-sm font-medium ${kpi.trendColor}`}>
                                    <TrendingUp className="h-4 w-4" />
                                    {kpi.change}
                                </div>
                            </div>
                            <h3 className="mb-1 text-sm font-medium text-gray-500">{kpi.title}</h3>
                            <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Growth Chart */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Monthly Supplier Growth</h3>
                    <div className="h-[300px] w-full">
                        {growthData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={growthData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />

                                    {/* THAY ĐỔI Ở ĐÂY: Thêm tick={{ angle: 0, dy: 10 }} để ép chữ tháng luôn nằm ngang */}
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ angle: 0, dy: 10 }}
                                    />

                                    <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                                    <Tooltip cursor={{stroke: '#d1d5db', strokeWidth: 1}} />
                                    <Line type="monotone" dataKey="suppliers" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} name="Suppliers Updated/Added" />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-gray-400">No data available</div>
                        )}
                    </div>
                </div>

                {/* Status Pie Chart */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Status Distribution</h3>
                    <div className="h-[300px] w-full">
                        {statusDistribution.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {statusDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-gray-400">No data available</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Alerts & Recent List */}
            <div className="grid gap-6 lg:grid-cols-2">

                {/* Recent Suppliers */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Recently Updated Suppliers</h3>
                        <Link to="/suppliers" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                            View All
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentSuppliers.length === 0 ? (
                            <p className="text-sm text-gray-500">No recent suppliers found.</p>
                        ) : (
                            recentSuppliers.map((sup) => (
                                <div key={sup.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4 transition-colors hover:bg-gray-100">
                                    <div>
                                        <p className="font-medium text-gray-900">{sup.name}</p>
                                        <p className="text-sm text-gray-500">{sup.contactEmail} • {sup.region || 'N/A'}</p>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-1">
                                        <span
                                            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                                                sup.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                    sup.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-red-100 text-red-700'
                                            }`}
                                        >
                                            {sup.status}
                                        </span>
                                        <p className="text-xs text-gray-400">{formatDate(sup.updateAt)}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* System Alerts */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
                    </div>
                    <div className="space-y-3">
                        {dynamicAlerts.length === 0 ? (
                            <p className="text-sm text-gray-500">No active alerts at the moment.</p>
                        ) : (
                            dynamicAlerts.map((alert, index) => (
                                <div
                                    key={index}
                                    className={`rounded-lg border-l-4 p-4 ${
                                        alert.type === 'critical' ? 'border-red-500 bg-red-50' :
                                            alert.type === 'warning' ? 'border-amber-500 bg-amber-50' :
                                                'border-blue-500 bg-blue-50'
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className={`mt-0.5 h-5 w-5 shrink-0 ${
                                            alert.type === 'critical' ? 'text-red-600' :
                                                alert.type === 'warning' ? 'text-amber-600' :
                                                    'text-blue-600'
                                        }`} />
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-gray-900">{alert.title}</p>
                                            <p className="mt-1 text-sm text-gray-600">{alert.message}</p>
                                            <p className="mt-2 text-xs font-medium text-gray-400">{alert.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Link to="/suppliers/create" className="group flex items-center justify-between rounded-xl bg-blue-600 p-6 text-white transition-colors hover:bg-blue-700 shadow-sm">
                    <div>
                        <PlusCircle className="mb-2 h-8 w-8 text-blue-200" />
                        <h4 className="font-semibold text-lg">Add New Supplier</h4>
                        <p className="text-sm text-blue-100">Register a new partner</p>
                    </div>
                    <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-2" />
                </Link>

                <Link to="/suppliers" className="group flex items-center justify-between rounded-xl border-2 border-gray-200 bg-white p-6 transition-all hover:border-amber-500 hover:shadow-sm">
                    <div>
                        <Clock className="mb-2 h-8 w-8 text-amber-500" />
                        <h4 className="font-semibold text-gray-900 text-lg">Review Pending</h4>
                        <p className="text-sm text-gray-500">{stats.pending} awaiting approval</p>
                    </div>
                    <ArrowRight className="h-6 w-6 text-amber-500 transition-transform group-hover:translate-x-2" />
                </Link>

                <Link to="/suppliers" className="group flex items-center justify-between rounded-xl border-2 border-gray-200 bg-white p-6 transition-all hover:border-green-500 hover:shadow-sm">
                    <div>
                        <FileText className="mb-2 h-8 w-8 text-green-500" />
                        <h4 className="font-semibold text-gray-900 text-lg">Supplier Reports</h4>
                        <p className="text-sm text-gray-500">View performance metrics</p>
                    </div>
                    <ArrowRight className="h-6 w-6 text-green-500 transition-transform group-hover:translate-x-2" />
                </Link>
            </div>
        </div>
    );
}