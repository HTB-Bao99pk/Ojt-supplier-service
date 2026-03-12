import { useEffect, useState } from "react";
import { getAllStaffs } from "../../api/staffApi.js";
import { getSchedulesByStaff } from "../../api/staffScheduleApi.js";
import { useNavigate } from "react-router-dom";
import { Search, Calendar, CheckCircle, XCircle } from "lucide-react";

function StatCard({ icon, label, value, bg }) {
    return (
        <div className="w-full p-3 sm:p-4 rounded-lg flex items-center gap-2 sm:gap-3" style={{ background: bg }}>
            <div className="p-2 rounded-md bg-white/30 shrink-0">
                {icon}
            </div>
            <div className="min-w-0 overflow-hidden">
                <div className="text-xs sm:text-sm text-gray-500 truncate">{label}</div>
                <div className="text-xl sm:text-2xl font-bold truncate">{value}</div>
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const s = (status || "").toString();
    if (s === "COMPLETED" || s === "PRESENT") {
        return (<span className="inline-block px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold rounded-full bg-green-100 text-green-700">COMPLETED</span>);
    }
    if (s === "IN_PROGRESS") {
        return (<span className="inline-block px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold rounded-full bg-blue-100 text-blue-700">IN_PROGRESS</span>);
    }
    if (s === "ABSENT" || s === "CANCELED") {
        return (<span className="inline-block px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold rounded-full bg-red-100 text-red-700">ABSENT</span>);
    }
    return (<span className="inline-block px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold rounded-full bg-gray-100 text-gray-700">SCHEDULED</span>);
}

const formatShiftId = (id) => {
    if (!id) return "—";
    try {
        return `SH-${String(id).substring(0,5).toUpperCase()}`;
    } catch (e) { return id; }
};

export default function StaffSchedules() {
    const [staffs, setStaffs] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [loadingStaffs, setLoadingStaffs] = useState(true);
    const [loadingSchedules, setLoadingSchedules] = useState(false);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            setLoadingStaffs(true);
            try {
                const data = await getAllStaffs(0, 100);
                const list = data?.content || (Array.isArray(data) ? data : []);
                setStaffs(list);
            } catch (e) {
                console.error(e);
                setStaffs([]);
            } finally {
                setLoadingStaffs(false);
            }
        })();
    }, []);

    useEffect(() => {
        if (!selectedStaff) return;
        (async () => {
            setLoadingSchedules(true);
            try {
                const data = await getSchedulesByStaff(selectedStaff.id);
                setSchedules(Array.isArray(data) ? data : []);
            } catch (e) {
                console.error(e);
                setSchedules([]);
            } finally {
                setLoadingSchedules(false);
            }
        })();
    }, [selectedStaff]);

    const total = schedules.length;
    const completed = schedules.filter(s => (s.status === "COMPLETED" || s.status === "PRESENT")).length;
    const absent = schedules.filter(s => (s.status === "ABSENT" || s.status === "CANCELED")).length;
    const scheduled = schedules.filter(s => s.status === "SCHEDULED").length;

    const filteredStaffs = staffs.filter(s => s.name?.toLowerCase().includes(query.toLowerCase()) || s.staffCode?.toLowerCase().includes(query.toLowerCase()));

    const formatTime = (t) => {
        if (!t) return "-";
        return t?.substring?.(0,5) || t;
    };

    return (
        <div className="p-4 sm:p-6 w-full max-w-full overflow-hidden">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold">Staff Schedules</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* Left Column: Staff Selection */}
                <div className="lg:col-span-1">
                    <div className="rounded-xl shadow-sm bg-white p-4 h-full flex flex-col">
                        <label className="block text-sm font-semibold text-gray-500 mb-3">Select Staff Member</label>
                        <div className="flex items-center gap-2 border rounded-lg p-2 bg-gray-50/50">
                            <Search className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                            <input
                                className="flex-1 outline-none text-sm bg-transparent w-full min-w-0"
                                placeholder="Search by name or code"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>

                        <div className="mt-3 overflow-y-auto max-h-[35vh] lg:max-h-[60vh] pr-1 scrollbar-thin scrollbar-thumb-gray-200">
                            {loadingStaffs && <div className="text-sm text-gray-500 py-2">Loading staff list…</div>}
                            {!loadingStaffs && filteredStaffs.map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => setSelectedStaff(s)}
                                    className={`w-full text-left px-3 py-2 sm:py-3 rounded-lg my-1 transition-colors ${
                                        selectedStaff?.id === s.id
                                            ? 'bg-sky-50 border border-sky-200 shadow-sm'
                                            : 'hover:bg-gray-50 border border-transparent'
                                    }`}
                                >
                                    <div className="text-sm font-semibold text-gray-800 truncate">{s.name}</div>
                                    <div className="text-xs text-gray-500 truncate mt-0.5">{s.staffCode || s.id}</div>
                                </button>
                            ))}
                            {!loadingStaffs && filteredStaffs.length === 0 && (
                                <div className="text-sm text-gray-500 py-4 text-center">No staff found</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Details & Table */}
                <div className="lg:col-span-3">
                    <div className="rounded-xl shadow-sm bg-white p-4 sm:p-6">

                        {/* Header info & Stats Grid */}
                        <div className="flex flex-col gap-4 sm:gap-6">
                            <div className="border-b pb-4 sm:pb-0 sm:border-0">
                                <div className="text-sm text-gray-500">{selectedStaff ? `Showing schedules for` : 'Status'}</div>
                                <div className="text-lg sm:text-xl font-bold text-gray-900">
                                    {selectedStaff ? selectedStaff.name : 'Please select a staff'}
                                </div>
                            </div>

                            {/* Grid 2 cột trên Mobile, 4 cột trên màn to */}
                            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 w-full">
                                <StatCard icon={<Calendar className="text-sky-600 w-5 h-5"/>} label="Total Shifts" value={total} bg="#f0f9ff" />
                                <StatCard icon={<CheckCircle className="text-green-600 w-5 h-5"/>} label="Completed" value={completed} bg="#ecfdf5" />
                                <StatCard icon={<Calendar className="text-gray-600 w-5 h-5"/>} label="Scheduled" value={scheduled} bg="#f8fafc" />
                                <StatCard icon={<XCircle className="text-red-600 w-5 h-5"/>} label="Absent" value={absent} bg="#fff1f2" />
                            </div>
                        </div>

                        {/* Table Container - Thêm overflow-x-auto */}
                        <div className="mt-6 w-full overflow-hidden rounded-lg border border-gray-200">
                            <div className="w-full overflow-x-auto">
                                {loadingSchedules && <div className="p-6 text-center text-gray-500">Loading schedules…</div>}

                                {!loadingSchedules && !selectedStaff && (
                                    <div className="p-8 text-center text-gray-400 bg-gray-50/30">Please select a staff from the list to view schedules.</div>
                                )}

                                {!loadingSchedules && selectedStaff && schedules.length === 0 && (
                                    <div className="p-8 text-center text-gray-400 bg-gray-50/30">No schedules assigned to this staff.</div>
                                )}

                                {!loadingSchedules && schedules.length > 0 && (
                                    <table className="w-full min-w-[750px] table-auto text-left">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 sm:py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                            <th className="px-4 py-3 sm:py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Shift ID</th>
                                            <th className="px-4 py-3 sm:py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Start</th>
                                            <th className="px-4 py-3 sm:py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">End</th>
                                            <th className="px-4 py-3 sm:py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Branch</th>
                                            <th className="px-4 py-3 sm:py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                            <th className="px-4 py-3 sm:py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                        {schedules.map((s) => (
                                            <tr key={s.id} className="bg-white hover:bg-gray-50/80 transition-colors">
                                                <td className="px-4 py-3 sm:py-4 text-sm text-gray-800 whitespace-nowrap">{s.date}</td>
                                                <td className="px-4 py-3 sm:py-4 text-sm text-gray-600 whitespace-nowrap">{formatShiftId(s.shiftId)}</td>
                                                <td className="px-4 py-3 sm:py-4 text-sm text-gray-800 whitespace-nowrap font-medium">{formatTime(s.startTime)}</td>
                                                <td className="px-4 py-3 sm:py-4 text-sm text-gray-800 whitespace-nowrap font-medium">{formatTime(s.endTime)}</td>
                                                <td className="px-4 py-3 sm:py-4 text-sm text-gray-600 truncate max-w-[150px]">{s.branchId || s.branch}</td>
                                                <td className="px-4 py-3 sm:py-4 text-sm whitespace-nowrap"> <StatusBadge status={s.status} /> </td>
                                                <td className="px-4 py-3 sm:py-4 text-sm text-right whitespace-nowrap">
                                                    <button
                                                        onClick={() => navigate('/attendance?shiftId=' + encodeURIComponent(s.shiftId) + '&date=' + encodeURIComponent(s.date))}
                                                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-gray-200 hover:bg-gray-50 hover:text-sky-600 text-sm font-medium transition-colors shadow-sm"
                                                        aria-label={`Open attendance for ${s.shiftId}`}
                                                    >
                                                        <Calendar size={14} />
                                                        <span className="hidden sm:inline">Attendance</span>
                                                        <span className="sm:hidden">View</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}