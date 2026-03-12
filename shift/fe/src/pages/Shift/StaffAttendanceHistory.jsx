import React, { useEffect, useState } from "react";
import { Users, Clock, MapPin, Search, RefreshCw, ChevronDown } from "lucide-react";
import { getAllStaffs } from "../../api/staffApi";
import { getStaffAttendanceHistory } from "../../api/attendanceApi";

// Helper Functions
const getTodayDateLocal = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
const getCurrentMonthStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};
const formatTime = (time) => {
    if (!time) return "—";
    if (Array.isArray(time)) return `${String(time[0]).padStart(2, '0')}:${String(time[1] || 0).padStart(2, '0')}`;
    return time.substring(0, 5);
};
const formatDateUI = (d) => {
    if (!d) return "—";
    if (Array.isArray(d)) return `${String(d[2]).padStart(2, '0')}/${String(d[1]).padStart(2, '0')}/${d[0]}`;
    const [year, month, day] = d.split('-');
    return `${day}/${month}/${year}`;
};

export default function StaffAttendanceHistory() {
    const [staffList, setStaffList] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState("");

    // State for Search Dropdown
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Filter State
    const [filterType, setFilterType] = useState("MONTH");
    const [monthStr, setMonthStr] = useState(getCurrentMonthStr());
    const [exactDate, setExactDate] = useState(getTodayDateLocal());

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadStaffs = async () => {
            try {
                const res = await getAllStaffs(0, 1000);
                setStaffList(res?.content || res || []);
            } catch (err) { console.error(err); }
        };
        loadStaffs();
    }, []);

    const fetchHistory = async () => {
        if (!selectedStaff) return;
        setLoading(true);
        try {
            let data = [];
            if (filterType === "MONTH") {
                const [year, month] = monthStr.split('-');
                data = await getStaffAttendanceHistory(selectedStaff, parseInt(month, 10), parseInt(year, 10), null);
            } else {
                data = await getStaffAttendanceHistory(selectedStaff, null, null, exactDate);
            }
            setHistory(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [selectedStaff, filterType, monthStr, exactDate]);

    const renderStatus = (status, lateMins, earlyMins) => {
        if (status === "PRESENT") return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">✓ Present</span>;
        if (status === "LATE") return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-200">⏰ Late {lateMins}m</span>;
        if (status === "EARLY_LEAVE") return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-200">↩ Early leave {earlyMins}m</span>;
        if (status === "ABSENT") return <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs font-bold border border-rose-200">✗ Absent</span>;
        return <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold border border-gray-200">Not marked</span>;
    };

    const filteredStaffs = staffList.filter(s => {
        const term = searchTerm.toLowerCase();
        const name = (s.name || "").toLowerCase();
        const code = (s.staffCode || "").toLowerCase();
        return name.includes(term) || code.includes(term);
    });

    const selectedStaffInfo = staffList.find(s => s.id === selectedStaff);

    return (
        <div className="space-y-6 pb-10">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Search className="text-amber-500" /> Staff Attendance History Lookup
                </h1>
                <p className="text-sm text-gray-500 mt-1">View detailed shift history of each individual by Date or Month.</p>
            </div>

            {/* CONTROL PANEL */}
            {/* FIXED: Use 12-column grid (lg:grid-cols-12) to align proportions */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* EMPLOYEE SEARCH BAR (Takes 7 columns - Wider) */}
                <div className="lg:col-span-7 relative">
                    <label className="block text-sm font-bold text-gray-700 mb-2">1. Search Employee <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Users className="absolute left-3 top-2.5 text-amber-500" size={18} />

                        <input
                            type="text"
                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-medium text-sm transition-all"
                            placeholder="Type Name or Staff ID..."
                            value={isDropdownOpen ? searchTerm : (selectedStaffInfo ? `${selectedStaffInfo.name} (${selectedStaffInfo.staffCode})` : "")}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setIsDropdownOpen(true);
                            }}
                            onFocus={() => {
                                setIsDropdownOpen(true);
                                setSearchTerm("");
                            }}
                            onBlur={() => {
                                setTimeout(() => setIsDropdownOpen(false), 200);
                            }}
                        />
                        <ChevronDown className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={18} />
                    </div>

                    {isDropdownOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                            {filteredStaffs.length === 0 ? (
                                <div className="px-4 py-3 text-sm text-gray-500 text-center">No employees found.</div>
                            ) : (
                                filteredStaffs.map(s => (
                                    <div
                                        key={s.id}
                                        className="px-4 py-2.5 hover:bg-amber-50 cursor-pointer border-b border-gray-50 last:border-none transition-colors flex justify-between items-center"
                                        onClick={() => {
                                            setSelectedStaff(s.id);
                                            setSearchTerm("");
                                            setIsDropdownOpen(false);
                                        }}
                                    >
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">{s.name}</p>
                                            <p className="text-[11px] text-gray-500 mt-0.5">{s.email}</p>
                                        </div>
                                        <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded">{s.staffCode}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Filter Type Selector (Takes 5 columns - Shorter) */}
                <div className="lg:col-span-5 flex flex-col justify-end">
                    <label className="block text-sm font-bold text-gray-700 mb-2">2. Filter Data By</label>
                    <div className="flex items-center gap-3">
                        <div className="flex bg-gray-100 p-1 rounded-lg shrink-0">
                            <button onClick={() => setFilterType("MONTH")} className={`px-3 py-1.5 text-sm font-bold rounded-md transition-all ${filterType === "MONTH" ? "bg-white text-amber-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>Month</button>
                            <button onClick={() => setFilterType("DATE")} className={`px-3 py-1.5 text-sm font-bold rounded-md transition-all ${filterType === "DATE" ? "bg-white text-amber-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>Date</button>
                        </div>

                        <div className="flex-1 min-w-[120px]">
                            {filterType === "MONTH" ? (
                                <input type="month" value={monthStr} onChange={(e) => setMonthStr(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-amber-500 outline-none cursor-pointer" />
                            ) : (
                                <input type="date" value={exactDate} onChange={(e) => setExactDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-amber-500 outline-none cursor-pointer" />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* KẾT QUẢ HIỂN THỊ */}
            {!selectedStaff ? (
                <div className="bg-slate-50 border border-dashed border-gray-300 rounded-2xl p-16 text-center text-gray-400">
                    <Users size={48} className="mx-auto mb-3 opacity-20" />
                    <p className="font-medium text-sm">Please type a name and select an employee above to view history.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden relative min-h-[300px]">
                    {loading && (
                        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                            <RefreshCw size={28} className="animate-spin text-amber-500 mb-3" />
                        </div>
                    )}

                    <div className="bg-slate-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="font-bold text-gray-800 text-sm">Shift List ({history.length})</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead className="bg-white border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Work Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Time</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Branch</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Attendance Status</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                            {history.length === 0 && !loading ? (
                                <tr><td colSpan="4" className="text-center py-10 text-sm text-gray-500">No shift data available in this time period.</td></tr>
                            ) : (
                                history.map((shift, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900 text-sm">{formatDateUI(shift.date)}</div>
                                            <div className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">{shift.shiftStatus}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-600">
                                            <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2.5 py-1 rounded w-max">
                                                <Clock size={14}/> {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-600">
                                            <div className="flex items-center gap-1.5"><MapPin size={14} className="text-gray-400"/> {shift.branchId}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {renderStatus(shift.attendanceStatus, shift.lateMinutes, shift.earlyLeaveMinutes)}
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}