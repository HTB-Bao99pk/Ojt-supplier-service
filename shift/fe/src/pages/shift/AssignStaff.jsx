import React, { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, UserPlus, CheckCircle2, UserCheck } from "lucide-react";
import { assignStaffToShift, fetchStaffByShift } from "../../api/attendanceApi";
import { getAllShifts } from "../../api/shiftApi";
import { getAllStaffs } from "../../api/staffApi";

// HÀM CHỐNG LỖI MÀN HÌNH TRẮNG KHI BACKEND TRẢ VỀ MẢNG THAY VÌ CHUỖI
const formatTime = (time) => {
    if (!time) return "—";
    if (typeof time === "string") return time.substring(0, 5);
    if (Array.isArray(time)) return `${String(time[0]).padStart(2, '0')}:${String(time[1] || 0).padStart(2, '0')}`;
    return "—";
};

export default function AssignStaff() {
    const [shifts, setShifts] = useState([]);
    const [selectedShift, setSelectedShift] = useState("");
    const [shiftDetails, setShiftDetails] = useState(null);

    const [allStaff, setAllStaff] = useState([]);
    const [assignedStaff, setAssignedStaff] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const initData = async () => {
            try {
                const shiftData = await getAllShifts(0, 100);
                const fetchedShifts = shiftData?.content || shiftData || [];
                const activeShifts = fetchedShifts.filter(s => s.status === "PREPARING" || s.status === "OPEN");
                setShifts(activeShifts);

                const staffData = await getAllStaffs();
                setAllStaff(staffData?.content || staffData || []);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        initData();
    }, []);

    useEffect(() => {
        if (!selectedShift) {
            setShiftDetails(null);
            setAssignedStaff([]);
            return;
        }

        const details = shifts.find(s => s.id === selectedShift);
        setShiftDetails(details);

        const loadAssigned = async () => {
            setLoading(true);
            try {
                const assigned = await fetchStaffByShift(selectedShift);
                setAssignedStaff(assigned || []);
            } catch (err) {
                console.error("Error fetching assigned staff:", err);
            } finally {
                setLoading(false);
            }
        };
        loadAssigned();
    }, [selectedShift, shifts]);

    const handleAssign = async (staffId) => {
        try {
            await assignStaffToShift(selectedShift, staffId);
            const assigned = await fetchStaffByShift(selectedShift);
            setAssignedStaff(assigned || []);
        } catch (err) {
            alert("Lỗi khi thêm: " + err.message);
        }
    };

    const assignedIds = assignedStaff.map(s => s.id);
    const availableStaff = allStaff.filter(s => !assignedIds.includes(s.id));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <UserCheck className="text-amber-500" /> Assign Staff to Shift
                </h1>
                <p className="text-sm text-gray-500 mt-1">Phân công nhân viên vào các ca làm việc đang hoặc chuẩn bị diễn ra.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <label className="block text-sm font-bold text-gray-700 mb-2">1. Chọn ca làm việc (Select Shift)</label>
                <select
                    value={selectedShift}
                    onChange={(e) => setSelectedShift(e.target.value)}
                    className="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                >
                    <option value="">-- Bấm để chọn ca làm việc (Chỉ hiện ca OPEN / PREPARING) --</option>
                    {shifts.map((s, idx) => (
                        <option key={s.id || `shift-${idx}`} value={s.id}>
                            {s.date} | {formatTime(s.startTime)} - {formatTime(s.endTime)} | {s.status}
                        </option>
                    ))}
                </select>

                {shiftDetails && (
                    <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-lg flex flex-wrap gap-6 text-sm">
                        <div className="flex items-center gap-2 text-amber-800"><Calendar size={16}/> <b>Date:</b> {shiftDetails.date}</div>
                        <div className="flex items-center gap-2 text-amber-800"><Clock size={16}/> <b>Time:</b> {formatTime(shiftDetails.startTime)} - {formatTime(shiftDetails.endTime)}</div>
                        <div className="flex items-center gap-2 text-amber-800"><MapPin size={16}/> <b>Branch:</b> {shiftDetails.branchId}</div>
                    </div>
                )}
            </div>

            {selectedShift && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="bg-slate-50 px-5 py-4 border-b border-gray-200">
                            <h2 className="font-bold text-gray-800">2. Nhân viên trống ({availableStaff.length})</h2>
                        </div>
                        <div className="p-2 max-h-[500px] overflow-y-auto">
                            {availableStaff.length === 0 ? (
                                <p className="text-center text-gray-500 py-10 text-sm">Không còn nhân viên nào.</p>
                            ) : (
                                availableStaff.map((staff, idx) => (
                                    <div key={staff.id || `avail-${idx}`} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg border-b border-gray-50 last:border-0 transition-colors">
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">{staff.name}</p>
                                            <p className="text-xs text-gray-500">{staff.id}</p>
                                        </div>
                                        <button
                                            onClick={() => handleAssign(staff.id)}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-md text-xs font-bold transition-colors"
                                        >
                                            <UserPlus size={14}/> Thêm vào ca
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="bg-emerald-50 px-5 py-4 border-b border-emerald-100 flex justify-between items-center">
                            <h2 className="font-bold text-emerald-800">3. Đã phân công ({assignedStaff.length})</h2>
                            {loading && <span className="text-xs text-emerald-600 animate-pulse">Đang tải...</span>}
                        </div>
                        <div className="p-2 max-h-[500px] overflow-y-auto">
                            {assignedStaff.length === 0 ? (
                                <p className="text-center text-gray-500 py-10 text-sm">Ca này chưa có ai.</p>
                            ) : (
                                assignedStaff.map((staff, idx) => (
                                    <div key={staff.id || `assign-${idx}`} className="flex justify-between items-center p-3 bg-white hover:bg-emerald-50/30 rounded-lg border-b border-gray-50 last:border-0 transition-colors">
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">{staff.name || "Nhân viên"}</p>
                                            <p className="text-xs text-gray-500">{staff.id}</p>
                                        </div>
                                        <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                                            <CheckCircle2 size={14}/> Đã gán
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}