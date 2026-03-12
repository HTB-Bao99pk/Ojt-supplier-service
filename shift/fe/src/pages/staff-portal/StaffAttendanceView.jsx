import { useState, useEffect } from "react";
import { Loader2, Calendar, RefreshCw } from "lucide-react";
import { getStaffAttendanceHistory } from "../../api/attendanceApi";

export default function StaffAttendanceView() {
    const [attendances, setAttendances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));

    const realStaffId = "9aaa658f-df12-4a5d-a6d6-77989a2df312";

    useEffect(() => {
        fetchMyAttendance();
    }, [filterMonth]);

    const fetchMyAttendance = async () => {
        try {
            setLoading(true);
            const [year, month] = filterMonth.split("-");
            const response = await getStaffAttendanceHistory(realStaffId, month, year);
            setAttendances(response || []);
        } catch (error) {
            console.error("Lỗi khi tải điểm danh:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">My Attendance History</h1>

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchMyAttendance}
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
                            className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-10"><Loader2 className="animate-spin text-red-600 h-8 w-8" /></div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-[11px] font-bold">
                        <tr>
                            <th className="p-4">Date</th>
                            <th className="p-4">Shift</th>
                            <th className="p-4">Check-in</th>
                            <th className="p-4">Check-out</th>
                            <th className="p-4">Status</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                        {attendances.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-500">Không có dữ liệu điểm danh trong tháng này.</td>
                            </tr>
                        ) : (
                            attendances.map((record, index) => {
                                // 1. Ngày tháng
                                const dateDisplay = record.date || "N/A";

                                // 2. Giờ Ca làm việc (Shift Time)
                                const startStr = record.startTime ? record.startTime.slice(0, 5) : "--:--";
                                const endStr = record.endTime ? record.endTime.slice(0, 5) : "--:--";
                                const shiftDisplay = `Shift ${startStr} - ${endStr}`;

                                // Hàm phụ trợ: Cộng trừ phút vào một chuỗi giờ "HH:mm"
                                const addMinutesToTime = (timeStr, minutesToAdd) => {
                                    if (!timeStr || timeStr === "--:--") return "--:--";
                                    const [h, m] = timeStr.split(':').map(Number);
                                    const dateObj = new Date();
                                    dateObj.setHours(h, m + minutesToAdd, 0);
                                    return dateObj.toTimeString().slice(0, 5); // Trả về "HH:mm"
                                };

                                // 3. Xử lý Trạng thái & TÍNH NGƯỢC THỜI GIAN CHECK-IN/OUT
                                const rawStatus = String(record.attendanceStatus || "PENDING").toUpperCase();
                                let statusDisplay = rawStatus;
                                let badgeClass = "bg-gray-100 text-gray-700";

                                // Mặc định ban đầu: Giờ thực tế = Giờ ca làm
                                let checkInDisplay = startStr;
                                let checkOutDisplay = endStr;

                                if (rawStatus.includes('ON_TIME') || rawStatus.includes('PRESENT')) {
                                    badgeClass = "bg-green-100 text-green-700";
                                    statusDisplay = "ĐÚNG GIỜ";
                                }
                                else if (rawStatus.includes('EARLY') || rawStatus.includes('LEFT')) {
                                    badgeClass = "bg-yellow-100 text-yellow-700";
                                    const mins = record.earlyLeaveMinutes || 0;
                                    statusDisplay = mins ? `VỀ SỚM (${mins}p)` : "VỀ SỚM";

                                    // Nếu về sớm, giờ check-out thực tế = giờ kết thúc ca TRỪ đi số phút về sớm
                                    checkOutDisplay = addMinutesToTime(endStr, -mins);
                                }
                                else if (rawStatus.includes('LATE')) {
                                    badgeClass = "bg-orange-100 text-orange-700";
                                    const mins = record.lateMinutes || 0;
                                    statusDisplay = mins ? `ĐI TRỄ (${mins}p)` : "ĐI TRỄ";

                                    // Nếu đi trễ, giờ check-in thực tế = giờ bắt đầu ca CỘNG thêm số phút đi trễ
                                    checkInDisplay = addMinutesToTime(startStr, mins);
                                }
                                else if (rawStatus.includes('ABSENT')) {
                                    badgeClass = "bg-red-100 text-red-700";
                                    statusDisplay = "VẮNG MẶT";
                                    checkInDisplay = "--:--";
                                    checkOutDisplay = "--:--";
                                }

                                // Trường hợp PENDING hoặc chưa rõ
                                if (rawStatus === "PENDING" || rawStatus === "UNDEFINED") {
                                    checkInDisplay = "--:--";
                                    checkOutDisplay = "--:--";
                                    statusDisplay = "CHƯA ĐIỂM DANH";
                                }

                                return (
                                    <tr key={record.shiftId || index} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-bold text-gray-900 whitespace-nowrap">{dateDisplay}</td>
                                        <td className="p-4 text-gray-600 font-bold text-xs whitespace-nowrap">{shiftDisplay}</td>
                                        <td className="p-4 text-gray-700 font-medium">{checkInDisplay}</td>
                                        <td className="p-4 text-gray-700 font-medium">{checkOutDisplay}</td>
                                        <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider ${badgeClass} whitespace-nowrap`}>
                        {statusDisplay}
                    </span>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}