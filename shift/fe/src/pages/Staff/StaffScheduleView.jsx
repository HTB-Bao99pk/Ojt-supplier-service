import { useState, useEffect } from "react";
import { CalendarDays, Clock, MapPin, Loader2, Calendar, RefreshCw } from "lucide-react";
import { getSchedulesByStaff } from "../../api/staffScheduleApi";

export default function StaffScheduleView() {
    const [myShifts, setMyShifts] = useState([]);
    const [loading, setLoading] = useState(true);

    // State quản lý bộ lọc
    const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));
    const [filterDate, setFilterDate] = useState(""); // Thêm state cho ngày cụ thể

    const realStaffId = "9aaa658f-df12-4a5d-a6d6-77989a2df312";

    useEffect(() => {
        fetchMySchedules();
    }, [filterMonth, filterDate]); // Theo dõi cả thay đổi của ngày và tháng

    const fetchMySchedules = async () => {
        try {
            setLoading(true);
            const response = await getSchedulesByStaff(realStaffId);
            const allShifts = response || [];

            const filteredShifts = allShifts.filter(shift => {
                const shiftDate = shift.shiftDate || shift.date;
                if (!shiftDate) return false;

                // Nếu có chọn ngày cụ thể, chỉ hiển thị đúng ngày đó
                if (filterDate) {
                    return shiftDate === filterDate;
                }

                // Nếu không chọn ngày, hiển thị theo tháng
                return shiftDate.startsWith(filterMonth);
            });

            filteredShifts.sort((a, b) => new Date(a.shiftDate || a.date) - new Date(b.shiftDate || b.date));
            setMyShifts(filteredShifts);
        } catch (error) {
            console.error("Lỗi khi tải lịch làm việc:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Staff Schedules</h1>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Nút Làm mới */}
                    <button
                        onClick={fetchMySchedules}
                        disabled={loading}
                        className="flex items-center gap-2 px-3 py-2 bg-white text-gray-600 hover:text-red-600 border border-gray-200 hover:border-red-200 rounded-xl shadow-sm transition-all"
                    >
                        <RefreshCw size={18} className={loading ? "animate-spin text-red-600" : ""} />
                        <span className="text-sm font-bold hidden sm:inline">Làm mới</span>
                    </button>

                    {/* Bộ lọc Tháng */}
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200 shadow-sm">
                        <Calendar className="text-gray-400" size={18} />
                        <input
                            type="month"
                            value={filterMonth}
                            onChange={(e) => {
                                setFilterMonth(e.target.value);
                                setFilterDate(""); // Tự động xóa lọc ngày khi người dùng đổi tháng khác
                            }}
                            className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer"
                        />
                    </div>

                    {/* Bộ lọc Ngày cụ thể (MỚI) */}
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200 shadow-sm relative">
                        <CalendarDays className="text-red-400" size={18} />
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => {
                                setFilterDate(e.target.value);
                                if (e.target.value) {
                                    // Tự động đồng bộ tháng theo ngày vừa chọn
                                    setFilterMonth(e.target.value.substring(0, 7));
                                }
                            }}
                            className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer"
                        />
                        {filterDate && (
                            <button
                                onClick={() => setFilterDate("")}
                                className="text-gray-400 hover:text-red-500 font-bold ml-1"
                                title="Bỏ lọc theo ngày, xem toàn bộ tháng"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-10"><Loader2 className="animate-spin text-red-600 h-8 w-8" /></div>
            ) : myShifts.length === 0 ? (
                <div className="text-center p-10 bg-white rounded-2xl border border-gray-100 text-gray-500 shadow-sm">
                    {/* Câu thông báo đổi linh hoạt tùy theo việc đang lọc ngày hay tháng */}
                    Bạn chưa có lịch làm việc nào trong {filterDate ? `ngày ${filterDate}` : `tháng ${filterMonth}`}.
                </div>
            ) : (
                <div className="grid gap-4">
                    {myShifts.map((shift) => (
                        <div key={shift.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-red-200 hover:shadow-md transition-all">
                            <div className="flex items-center gap-5">
                                <div className="h-14 w-14 bg-red-50 text-red-600 rounded-xl flex flex-col items-center justify-center shrink-0 border border-red-100">
                                    <span className="text-lg font-black leading-none">{new Date(shift.shiftDate || shift.date).getDate()}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider">{new Date(shift.shiftDate || shift.date).toLocaleString('default', { month: 'short' })}</span>
                                </div>
                                <div>
                                    <h3 className="font-black text-gray-900 text-lg">
                                        Shift {shift.startTime?.slice(0, 5)} - {shift.endTime?.slice(0, 5)}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mt-1">
                                        <Clock size={14} className="text-red-400"/> {shift.shiftDate || shift.date}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-bold text-gray-700 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                                <MapPin size={16} className="text-gray-400" />
                                {shift.branchId || "BR-001"}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}