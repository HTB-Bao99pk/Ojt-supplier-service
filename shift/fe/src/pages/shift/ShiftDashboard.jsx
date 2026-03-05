import {
    Users,
    MapPin,
    CalendarClock,
    Activity,
    ArrowRight,
    PlusCircle,
    Clock
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Link, useNavigate } from 'react-router-dom';

export default function ShiftDashboard() {
    const navigate = useNavigate();

    // Dữ liệu giả lập (Mock Data) chờ API thực tế
    const kpis = [
        { title: 'Total Shifts Today', value: '24', change: '+3 from yesterday', icon: CalendarClock, color: 'bg-blue-500', trendColor: 'text-blue-600' },
        { title: 'Staff on Duty', value: '45', change: '8 pending check-ins', icon: Users, color: 'bg-green-500', trendColor: 'text-amber-600' },
        { title: 'Active Branches', value: '6', change: 'All branches running', icon: MapPin, color: 'bg-indigo-500', trendColor: 'text-green-600' },
        { title: 'Coverage Rate', value: '92%', change: 'Needs attention', icon: Activity, color: 'bg-amber-500', trendColor: 'text-red-500' },
    ];

    // Biểu đồ số lượng ca làm việc trong tuần (Sáng tạo từ Recharts)
    const weeklyData = [
        { day: 'Mon', shifts: 35 },
        { day: 'Tue', shifts: 38 },
        { day: 'Wed', shifts: 42 },
        { day: 'Thu', shifts: 40 },
        { day: 'Fri', shifts: 55 },
        { day: 'Sat', shifts: 65 },
        { day: 'Sun', shifts: 60 },
    ];

    // Danh sách các ca làm việc gần nhất theo dòng thời gian (Timeline style)
    const upcomingShifts = [
        { id: 'SH-1021', branch: 'Ho Chi Minh Central', time: '14:00 - 18:00', staffCount: 5, status: 'Upcoming' },
        { id: 'SH-1022', branch: 'Da Nang Branch', time: '15:00 - 22:00', staffCount: 3, status: 'In Progress' },
        { id: 'SH-1023', branch: 'Ha Noi Branch', time: '18:00 - 23:00', staffCount: 4, status: 'Upcoming' },
        { id: 'SH-1024', branch: 'Can Tho Branch', time: '06:00 - 12:00', staffCount: 2, status: 'Completed' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Shift Overview</h1>
                    <p className="mt-1 text-gray-600">Monitor daily schedules, staff coverage, and branch activities.</p>
                </div>
                <button
                    onClick={() => navigate('/shifts/create')}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 transition-colors"
                >
                    <PlusCircle className="h-4 w-4" />
                    Schedule New Shift
                </button>
            </div>

            {/* KPI Cards (Giống hệt figma gốc) */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {kpis.map((kpi) => {
                    const Icon = kpi.icon;
                    return (
                        <div key={kpi.title} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="mb-4 flex items-center justify-between">
                                <div className={`${kpi.color} rounded-lg p-3 shadow-sm`}>
                                    <Icon className="h-6 w-6 text-white" />
                                </div>
                                <div className={`text-xs font-medium ${kpi.trendColor} bg-gray-50 px-2 py-1 rounded-full border border-gray-100`}>
                                    {kpi.change}
                                </div>
                            </div>
                            <h3 className="mb-1 text-sm font-medium text-gray-500">{kpi.title}</h3>
                            <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Charts & Lists Row (Sáng tạo từ Recharts Bar Chart) */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Weekly Distribution Chart (Chiếm 2 cột) */}
                <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col">
                    <h3 className="mb-1 text-lg font-semibold text-gray-900">Weekly Shift Distribution</h3>
                    <p className="text-sm text-gray-500 mb-4">Number of shifts assigned per day.</p>
                    <div className="h-[300px] w-full flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{fill: '#f3f4f6'}}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="shifts" radius={[6, 6, 0, 0]}>
                                    {weeklyData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['Sat', 'Sun'].includes(entry.day) ? '#818cf8' : '#3b82f6'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Today's Timeline (Upcoming Shifts List - Chiếm 1 cột) */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Today's Timeline</h3>
                        <Link to="/shifts" className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</Link>
                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto pr-2 scrollbar-thin">
                        {upcomingShifts.map((shift, idx) => (
                            <div key={idx} className="relative pl-6 pb-4 border-l-2 border-gray-100 last:border-transparent last:pb-0">
                                {/* Timeline Dot */}
                                <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-white ${
                                    shift.status === 'In Progress' ? 'bg-green-500' :
                                        shift.status === 'Completed' ? 'bg-gray-400' : 'bg-blue-500'
                                }`}></div>

                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 hover:border-blue-200 hover:bg-gray-100 transition-colors cursor-pointer">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-semibold text-gray-900 text-sm">{shift.branch}</span>
                                        <span className="text-xs font-medium text-gray-500 bg-white px-2 py-0.5 rounded border shadow-sm">
                                            {shift.id}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5 text-blue-500" />
                                            {shift.time}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Users className="w-3.5 h-3.5 text-amber-500" />
                                            {shift.staffCount} Staff
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}