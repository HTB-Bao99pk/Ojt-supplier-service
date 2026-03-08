import React, { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, UserPlus, CheckCircle2, UserCheck, CalendarDays } from "lucide-react";
import { assignStaffToShift, fetchStaffByShift } from "../../api/attendanceApi";
import { getShiftsByDate } from "../../api/shiftApi";
import { getAllStaffs } from "../../api/staffApi";

// Lấy ngày hôm nay
const getTodayDate = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const formatTime = (time) => {
    if (!time) return "—";
    if (typeof time === "string") return time.substring(0, 5);
    if (Array.isArray(time)) return `${String(time[0]).padStart(2, '0')}:${String(time[1] || 0).padStart(2, '0')}`;
    return "—";
};

const formatDateUI = (d) => {
    if (!d) return "—";
    let year, month, day;
    if (Array.isArray(d)) { year = d[0]; month = String(d[1]).padStart(2, '0'); day = String(d[2]).padStart(2, '0'); }
    else if (typeof d === "string") {
        if (/^\d{4}-\d{2}-\d{2}$/.test(d)) { [year, month, day] = d.split('-'); } else return d.replace(/-/g, '/');
    } else return String(d);
    return `${day}/${month}/${year}`;
};

// Hàm render Giới tính dạng thẻ nhỏ cho danh sách
const renderGender = (gender) => {
    if (!gender) return null;
    if (gender === "MALE") return <span className="text-blue-600 font-bold text-[10px] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">Nam</span>;
    if (gender === "FEMALE") return <span className="text-pink-600 font-bold text-[10px] bg-pink-50 px-1.5 py-0.5 rounded border border-pink-100">Nữ</span>;
    return <span className="text-gray-500 font-bold text-[10px] bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">Khác</span>;
};

export default function AssignStaff() {
    const [filterDate, setFilterDate] = useState(getTodayDate());
    const [shifts, setShifts] = useState([]);
    const [selectedShift, setSelectedShift] = useState("");
    const [shiftDetails, setShiftDetails] = useState(null);
    const [allStaff, setAllStaff] = useState([]);
    const [assignedStaff, setAssignedStaff] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingShifts, setLoadingShifts] = useState(false);

    // Load danh sách nhân viên 1 lần lúc mở trang
    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const staffData = await getAllStaffs();
                setAllStaff(staffData?.content || staffData || []);
            } catch (err) { console.error("Error fetching staff:", err); }
        };
        fetchStaff();
    }, []);

    // Fetch ca làm việc BẤT CỨ KHI NÀO TÊN NGÀY THAY ĐỔI
    useEffect(() => {
        const fetchShifts = async () => {
            if (!filterDate || filterDate.length !== 10) return;
            setLoadingShifts(true);
            try {
                const shiftData = await getShiftsByDate(filterDate);
                const fetchedShifts = shiftData?.content || shiftData || [];
                // Chỉ lấy những ca PREPARING hoặc OPEN để gán
                const activeShifts = fetchedShifts.filter(s => s.status === "PREPARING" || s.status === "OPEN");
                setShifts(activeShifts);
                setSelectedShift(""); // Reset select khi đổi ngày
            } catch (err) {
                console.error("Error fetching shifts by date:", err);
                setShifts([]);
            } finally {
                setLoadingShifts(false);
            }
        };
        fetchShifts();
    }, [filterDate]);

    // Load nhân viên đã gán khi chọn 1 ca
    useEffect(() => {
        if (!selectedShift) { setShiftDetails(null); setAssignedStaff([]); return; }
        const details = shifts.find(s => s.id === selectedShift);
        setShiftDetails(details);

        const loadAssigned = async () => {
            setLoading(true);
            try {
                const assigned = await fetchStaffByShift(selectedShift);
                setAssignedStaff(assigned?.content || assigned || []);
            }
            catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        loadAssigned();
    }, [selectedShift, shifts]);

    const handleAssign = async (staffId) => {
        try {
            await assignStaffToShift(selectedShift, staffId);
            // Sau khi assign thành công, fetch lại danh sách assigned
            const assigned = await fetchStaffByShift(selectedShift);
            setAssignedStaff(assigned?.content || assigned || []);
        } catch (err) { alert("Lỗi khi thêm: " + err.message); }
    };

    const assignedIds = assignedStaff.map(s => s.id || s.staffId);
    const availableStaff = allStaff.filter(s => !assignedIds.includes(s.id));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><UserCheck className="text-amber-500" /> Assign Staff to Shift</h1>
                <p className="text-sm text-gray-500 mt-1">Phân công nhân viên vào các ca làm việc.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">

                {/* STEP 1: CHỌN NGÀY */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">1. Chọn Ngày Làm Việc</label>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <CalendarDays className="h-5 w-5 text-amber-500" />
                            </div>
                            <input
                                type="date"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none font-medium text-sm w-[200px]"
                            />
                        </div>
                        <button
                            onClick={() => setFilterDate(getTodayDate())}
                            className="text-sm font-bold text-amber-600 bg-amber-50 px-3 py-2 rounded-lg hover:bg-amber-100 transition-colors"
                        >
                            Hôm nay
                        </button>
                    </div>
                </div>

                {/* STEP 2: CHỌN CA */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">2. Chọn Ca (Hiển thị ca Đang Mở/Chuẩn Bị)</label>
                    <select
                        value={selectedShift}
                        onChange={(e) => setSelectedShift(e.target.value)}
                        disabled={loadingShifts || shifts.length === 0}
                        className="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500 font-medium disabled:bg-gray-50 disabled:text-gray-400"
                    >
                        <option value="">
                            {loadingShifts ? "Đang tải ca..." : shifts.length === 0 ? `-- Không có ca trống nào vào ngày ${formatDateUI(filterDate)} --` : "-- Bấm để chọn ca làm việc --"}
                        </option>
                        {shifts.map((s, idx) => (
                            <option key={s.id || `shift-${idx}`} value={s.id}>
                                {formatTime(s.startTime)} - {formatTime(s.endTime)} | Chi nhánh: {s.branchId} | ({s.status})
                            </option>
                        ))}
                    </select>

                    {shiftDetails && (
                        <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-lg flex flex-wrap gap-6 text-sm">
                            <div className="flex items-center gap-2 text-amber-800"><Calendar size={16}/> <b>Ngày:</b> {formatDateUI(shiftDetails.date)}</div>
                            <div className="flex items-center gap-2 text-amber-800"><Clock size={16}/> <b>Giờ:</b> {formatTime(shiftDetails.startTime)} - {formatTime(shiftDetails.endTime)}</div>
                            <div className="flex items-center gap-2 text-amber-800"><MapPin size={16}/> <b>Branch:</b> {shiftDetails.branchId}</div>
                        </div>
                    )}
                </div>
            </div>

            {selectedShift && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* KHUNG BÊN TRÁI: NHÂN VIÊN TRỐNG */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="bg-slate-50 px-5 py-4 border-b border-gray-200"><h2 className="font-bold text-gray-800">Nhân viên trống ({availableStaff.length})</h2></div>
                        <div className="p-2 max-h-[500px] overflow-y-auto">
                            {availableStaff.length === 0 ? <p className="text-center text-gray-500 py-10 text-sm">Không còn nhân viên nào.</p> : availableStaff.map((staff, idx) => (
                                <div key={staff.id || `avail-${idx}`} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg border-b border-gray-50 last:border-0">
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm flex items-center gap-2">
                                            {staff.name || staff.staffName}
                                            {renderGender(staff.gender)}
                                        </p>
                                        {/* ĐÃ SỬA: Hiển thị Email thay vì ID */}
                                        <p className="text-xs text-gray-500 mt-0.5">{staff.email || staff.staffCode || "Chưa có email"}</p>
                                    </div>
                                    <button onClick={() => handleAssign(staff.id)} className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-md text-xs font-bold transition-colors"><UserPlus size={14}/> Thêm vào ca</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* KHUNG BÊN PHẢI: ĐÃ PHÂN CÔNG */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="bg-emerald-50 px-5 py-4 border-b border-emerald-100 flex justify-between items-center"><h2 className="font-bold text-emerald-800">Đã phân công ({assignedStaff.length})</h2>{loading && <span className="text-xs text-emerald-600 animate-pulse">Đang tải...</span>}</div>
                        <div className="p-2 max-h-[500px] overflow-y-auto">
                            {assignedStaff.length === 0 ? <p className="text-center text-gray-500 py-10 text-sm">Ca này chưa có ai.</p> : assignedStaff.map((staff, idx) => (
                                <div key={staff.id || staff.staffId || `assign-${idx}`} className="flex justify-between items-center p-3 bg-white hover:bg-emerald-50/30 rounded-lg border-b border-gray-50 last:border-0">
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm flex items-center gap-2">
                                            {staff.name || staff.staffName || "Tên không xác định"}
                                            {renderGender(staff.gender)}
                                        </p>
                                        {/* ĐÃ SỬA: Hiển thị Email thay vì ID */}
                                        <p className="text-xs text-gray-500 mt-0.5">{staff.email || staff.staffCode || "Chưa có email"}</p>
                                    </div>
                                    <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold"><CheckCircle2 size={14}/> Đã gán</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}