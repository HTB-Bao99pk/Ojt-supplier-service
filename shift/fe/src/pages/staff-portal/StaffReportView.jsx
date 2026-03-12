import { useState, useEffect } from "react";
import { FileBarChart, TrendingUp, Clock, AlertTriangle, Loader2, Calendar, RefreshCw } from "lucide-react";
import { getStaffAttendanceHistory } from "../../api/attendanceApi";

export default function StaffReportView() {
    const [reportData, setReportData] = useState({ total: 0, onTime: 0, lateOrEarly: 0, absent: 0, onTimeRate: 0 });
    const [loading, setLoading] = useState(true);
    const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));

    const realStaffId = "9aaa658f-df12-4a5d-a6d6-77989a2df312";

    useEffect(() => {
        fetchReportData();
    }, [filterMonth]);

    const fetchReportData = async () => {
        try {
            setLoading(true);
            const [year, month] = filterMonth.split("-");
            const response = await getStaffAttendanceHistory(realStaffId, month, year);
            const attendances = response?.data || response?.result || response || [];

            const total = attendances.length;
            let onTime = 0, lateOrEarly = 0, absent = 0;

            attendances.forEach(a => {
                const s = String(a.status || a.attendanceStatus || "").toUpperCase();

                if (s.includes('ON_TIME') || s.includes('PRESENT')) {
                    onTime++;
                } else if (s.includes('LATE') || s.includes('EARLY') || s.includes('LEFT')) {
                    // Gom chung ĐI TRỄ và VỀ SỚM vào một nhóm để không bị đếm sót
                    lateOrEarly++;
                } else if (s.includes('ABSENT') || s.includes('NO_SHOW')) {
                    absent++;
                }
            });

            const onTimeRate = total === 0 ? 0 : Math.round((onTime / total) * 100);

            setReportData({ total, onTime, lateOrEarly, absent, onTimeRate });
        } catch (error) {
            console.error("Lỗi khi tải báo cáo:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                        <FileBarChart size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Performance Report</h1>
                        <p className="text-sm font-medium text-gray-500">Thống kê hiệu suất đi làm tháng {filterMonth}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchReportData}
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
            ) : reportData.total === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-gray-500 shadow-sm font-medium">
                    Chưa có đủ dữ liệu để lập báo cáo trong tháng {filterMonth}.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center space-y-4">
                        <h3 className="font-bold text-gray-400 uppercase tracking-wider text-xs">Tỷ lệ đúng giờ</h3>
                        <div className="relative h-32 w-32 flex items-center justify-center rounded-full border-8 border-gray-50">
                            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 36 36">
                                <path
                                    className="text-green-500"
                                    strokeDasharray={`${reportData.onTimeRate}, 100`}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none" stroke="currentColor" strokeWidth="3"
                                />
                            </svg>
                            <span className="text-3xl font-black text-gray-900">{reportData.onTimeRate}%</span>
                        </div>
                        <p className="text-sm text-gray-500 font-medium">Bạn đang làm rất tốt!</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                        <h3 className="font-bold text-gray-400 uppercase tracking-wider text-xs border-b border-gray-100 pb-3">Chi tiết điểm danh</h3>

                        <div className="space-y-4">
                            <ProgressItem label="Đúng giờ" count={reportData.onTime} total={reportData.total} colorClass="bg-green-500" textColor="text-green-600" icon={<TrendingUp size={16}/>} />

                            {/* ĐỔI NHÃN THÀNH ĐI TRỄ / VỀ SỚM */}
                            <ProgressItem label="Đi trễ / Về sớm" count={reportData.lateOrEarly} total={reportData.total} colorClass="bg-orange-500" textColor="text-orange-500" icon={<Clock size={16}/>} />

                            <ProgressItem label="Vắng mặt" count={reportData.absent} total={reportData.total} colorClass="bg-red-500" textColor="text-red-600" icon={<AlertTriangle size={16}/>} />
                        </div>

                        <div className="pt-4 border-t border-gray-100 text-sm font-bold text-gray-800 flex justify-between">
                            <span>Tổng số ca đã đánh giá:</span>
                            <span>{reportData.total} ca</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function ProgressItem({ label, count, total, colorClass, textColor, icon }) {
    const percent = total === 0 ? 0 : (count / total) * 100;
    return (
        <div>
            <div className="flex justify-between text-[13px] font-bold mb-1.5">
                <span className={`flex items-center gap-2 ${textColor}`}>{icon} {label}</span>
                <span className="text-gray-900">{count} ca</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div className={`${colorClass} h-full rounded-full transition-all duration-500`} style={{ width: `${percent}%` }}></div>
            </div>
        </div>
    );
}