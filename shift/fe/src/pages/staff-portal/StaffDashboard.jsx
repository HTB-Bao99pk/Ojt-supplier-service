import { useState, useEffect } from "react";
import { CalendarDays, Clock, CheckCircle, Loader2, Calendar, RefreshCw } from "lucide-react";
import { getSchedulesByStaff } from "../../api/staffScheduleApi";
import { getStaffAttendanceHistory } from "../../api/attendanceApi";

export default function StaffDashboard() {
    const [stats, setStats] = useState({ upcomingShifts: 0, presentCount: 0, lateCount: 0 });
    const [loading, setLoading] = useState(true);
    const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));

    const realStaffId = "9aaa658f-df12-4a5d-a6d6-77989a2df312";

    useEffect(() => {
        fetchAllData();
    }, [filterMonth]);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const [year, month] = filterMonth.split("-");

            const [scheduleRes, attendanceRes] = await Promise.all([
                getSchedulesByStaff(realStaffId),
                getStaffAttendanceHistory(realStaffId, month, year)
            ]);

            const allSchedules = scheduleRes || [];
            const attendances = attendanceRes || [];

            // Lọc lịch trình theo tháng
            const schedulesInMonth = allSchedules.filter(s => {
                const date = s.shiftDate || s.date;
                return date && date.startsWith(filterMonth);
            });

            // Tính số liệu
            const upcoming = schedulesInMonth.filter(s => s.status === 'PENDING').length || schedulesInMonth.length;
            const present = attendances.filter(a => a.status === 'PRESENT' || a.status === 'ON_TIME').length;
            const late = attendances.filter(a => a.status === 'LATE').length;

            setStats({ upcomingShifts: upcoming, presentCount: present, lateCount: late });
        } catch (error) {
            console.error("Lỗi khi tải Dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Welcome back!</h1>
                    <p className="text-sm font-medium text-gray-500 mt-1">Here is your summary for the selected month.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchAllData}
                        disabled={loading}
                        className="flex items-center gap-2 px-3 py-2 bg-white text-gray-600 hover:text-red-600 border border-gray-200 hover:border-red-200 rounded-xl shadow-sm transition-all"
                    >
                        <RefreshCw size={18} className={loading ? "animate-spin text-red-600" : ""} />
                        <span className="text-sm font-bold hidden sm:inline">Làm mới</span>
                    </button>

                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200 shadow-sm">
                        <Calendar className="text-gray-400" size={18} />
                        <input
                            type="month"
                            value={filterMonth}
                            onChange={(e) => setFilterMonth(e.target.value)}
                            className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-10"><Loader2 className="animate-spin text-red-600 h-8 w-8" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard icon={<CalendarDays className="text-red-500" />} title="Shifts (This Month)" value={stats.upcomingShifts} />
                    <StatCard icon={<CheckCircle className="text-green-500" />} title="On-time Attendance" value={stats.presentCount} trendColor="bg-green-50" />
                    <StatCard icon={<Clock className="text-orange-500" />} title="Late Check-ins" value={stats.lateCount} trendColor="bg-orange-50" />
                </div>
            )}
        </div>
    );
}

function StatCard({ icon, title, value, trendColor = "bg-red-50" }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className={`p-4 ${trendColor} rounded-2xl`}>{icon}</div>
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</p>
                <p className="text-3xl font-black text-gray-900 mt-1">{value}</p>
            </div>
        </div>
    );
}