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

export default function SupplierDashboard() {
    // 1. Dữ liệu Thống kê KPI chuẩn của Supplier
    const kpis = [
        { title: 'Total Suppliers', value: '128', change: '+12 this month', trend: 'up', icon: Users, color: 'bg-blue-500', trendColor: 'text-blue-600' },
        { title: 'Approved', value: '95', change: '+5 this month', trend: 'up', icon: CheckCircle, color: 'bg-green-500', trendColor: 'text-green-600' },
        { title: 'Pending Approval', value: '13', change: '-2 from last week', trend: 'down', icon: Clock, color: 'bg-amber-500', trendColor: 'text-amber-600' },
        { title: 'Suspended', value: '20', change: '+1 this week', trend: 'up', icon: AlertCircle, color: 'bg-red-500', trendColor: 'text-red-600' },
    ];

    // 2. Dữ liệu Biểu đồ Tăng trưởng (Line Chart)
    const growthData = [
        { month: 'Oct', suppliers: 98 },
        { month: 'Nov', suppliers: 105 },
        { month: 'Dec', suppliers: 112 },
        { month: 'Jan', suppliers: 116 },
        { month: 'Feb', suppliers: 125 },
        { month: 'Mar', suppliers: 128 },
    ];

    // 3. Dữ liệu Phân bổ Trạng thái (Pie Chart)
    const statusDistribution = [
        { name: 'Approved', value: 95, color: '#10b981' }, // Green
        { name: 'Pending', value: 13, color: '#f59e0b' },  // Amber
        { name: 'Suspended', value: 20, color: '#ef4444' }, // Red
    ];

    // 4. Cảnh báo hệ thống (Alerts)
    const alerts = [
        { type: 'critical', title: 'Contract Expiring', message: 'Global Trade Co. contract expires in 3 days.', time: '2 hours ago' },
        { type: 'warning', title: 'Pending Approvals', message: 'You have 13 suppliers waiting for review.', time: '5 hours ago' },
        { type: 'info', title: 'New Registration', message: 'EcoPackaging Ltd has submitted a registration form.', time: '1 day ago' },
    ];

    // 5. Danh sách Supplier mới nhất
    const recentSuppliers = [
        { id: 'SUP-0128', name: 'Fresh Farms Inc.', region: 'North', status: 'Pending', date: '2026-03-02' },
        { id: 'SUP-0127', name: 'TechEquip Supplies', region: 'Global', status: 'Approved', date: '2026-03-01' },
        { id: 'SUP-0126', name: 'Green Packaging', region: 'East', status: 'Approved', date: '2026-02-28' },
        { id: 'SUP-0125', name: 'Quality Beans LLC', region: 'South', status: 'Suspended', date: '2026-02-25' },
    ];

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
                    const TrendIcon = kpi.trend === 'up' ? TrendingUp : TrendingUp; // Dùng tạm chung icon trend
                    return (
                        <div key={kpi.title} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                            <div className="mb-4 flex items-center justify-between">
                                <div className={`${kpi.color} rounded-lg p-3 shadow-sm`}>
                                    <Icon className="h-6 w-6 text-white" />
                                </div>
                                <div className={`flex items-center gap-1 text-sm font-medium ${kpi.trendColor}`}>
                                    <TrendIcon className="h-4 w-4" />
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
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={growthData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip cursor={{stroke: '#d1d5db', strokeWidth: 1}} />
                            <Line type="monotone" dataKey="suppliers" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} name="Total Suppliers" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Status Pie Chart */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Status Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
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
                </div>
            </div>

            {/* Alerts & Recent List */}
            <div className="grid gap-6 lg:grid-cols-2">

                {/* Recent Suppliers */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Suppliers</h3>
                        <Link to="/suppliers" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                            View All
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentSuppliers.map((sup) => (
                            <div key={sup.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4 transition-colors hover:bg-gray-100">
                                <div>
                                    <p className="font-medium text-gray-900">{sup.name}</p>
                                    <p className="text-sm text-gray-500">{sup.id} • {sup.region}</p>
                                </div>
                                <div className="text-right">
                                    <span
                                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                                            sup.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                sup.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-red-100 text-red-700'
                                        }`}
                                    >
                                        {sup.status}
                                    </span>
                                    <p className="mt-1 text-xs text-gray-400">{sup.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Alerts */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Supplier Alerts</h3>
                    </div>
                    <div className="space-y-3">
                        {alerts.map((alert, index) => (
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
                        ))}
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
                        <p className="text-sm text-gray-500">13 awaiting approval</p>
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