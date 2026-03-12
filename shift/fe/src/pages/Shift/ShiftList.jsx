import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Calendar, MapPin, Clock, Lock, RefreshCw } from "lucide-react";
import { deleteShift, getShiftsByDate } from "../../api/shiftApi";

const getTodayDate = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const normalizeDate = (d) => {
    if (!d) return "";
    if (Array.isArray(d)) return `${d[0]}-${String(d[1]).padStart(2, '0')}-${String(d[2]).padStart(2, '0')}`;
    if (typeof d === "string") {
        if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
        if (/^\d{2}[/-]\d{2}[/-]\d{4}$/.test(d)) {
            const sep = d.includes('/') ? '/' : '-';
            const [day, month, year] = d.split(sep);
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
    }
    return String(d);
};

const displayDate = (d) => {
    const std = normalizeDate(d);
    if (/^\d{4}-\d{2}-\d{2}$/.test(std)) {
        const [year, month, day] = std.split('-');
        return `${day}/${month}/${year}`;
    }
    return std;
};

const formatTime = (time) => {
    if (!time) return "—";
    if (typeof time === "string") return time.substring(0, 5);
    if (Array.isArray(time)) return `${String(time[0]).padStart(2, '0')}:${String(time[1] || 0).padStart(2, '0')}`;
    return "—";
};

export default function ShiftList() {
    const navigate = useNavigate();
    const [shifts, setShifts] = useState([]);
    const [loading, setLoading] = useState(false);

    // Default is today's date
    const [filterDate, setFilterDate] = useState(getTodayDate());

    // Function to call API directly by Date
    const fetchShiftsByDateAPI = async (dateToFetch) => {
        setLoading(true);
        try {
            const data = await getShiftsByDate(dateToFetch);
            const list = data?.content || (Array.isArray(data) ? data : []);
            setShifts(list);
        } catch (error) {
            console.error("Error fetching shifts:", error);
            setShifts([]);
        } finally {
            setLoading(false);
        }
    };

    // AUTO SEARCH WHEN DATE CHANGES (No need for Search button)
    useEffect(() => {
        // CONSTRAINT: Must enter/select full 10 characters (YYYY-MM-DD) before calling API
        if (filterDate && filterDate.length === 10) {
            fetchShiftsByDateAPI(filterDate);
        } else {
            // If user clears the date (empty input) -> Clear the list
            setShifts([]);
        }
    }, [filterDate]);

    const handleDelete = async (id, status) => {
        if (status !== "PREPARING") return alert("Error: Only shifts in PREPARING status can be deleted!");
        if (window.confirm("Are you sure you want to delete this future shift?")) {
            try {
                await deleteShift(id);
                alert("Deleted successfully!");
                fetchShiftsByDateAPI(filterDate);
            } catch (error) {
                alert(error.message);
            }
        }
    };

    const shortenId = (id) => id.length > 8 ? `SH-${id.substring(0, 5).toUpperCase()}` : id;

    const renderStatusBadge = (status) => {
        const styles = {
            PREPARING: "bg-blue-100 text-blue-700 border-blue-200",
            OPEN: "bg-green-100 text-green-700 border-green-200",
            CLOSED: "bg-gray-100 text-gray-600 border-gray-200"
        };
        return <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status]}`}>{status}</span>;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Shift Management</h1>
                <button onClick={() => navigate("/shifts/create")} className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 flex items-center gap-2 shadow-sm transition-colors font-bold text-sm">
                    <Calendar className="h-4 w-4" /> Create New Shift
                </button>
            </div>

            {/* FILTER HAS BEEN SIMPLIFIED - AUTO FILTER */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap gap-4 items-end justify-between">
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Search by Date <span className="text-red-500">*</span></label>
                    <div className="flex items-center gap-2">
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500 font-medium cursor-pointer"
                        />
                        <button
                            onClick={() => setFilterDate(getTodayDate())}
                            className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 transition-colors shadow-sm"
                        >
                            Today
                        </button>
                    </div>
                </div>

                <button
                    onClick={() => {
                        if (filterDate && filterDate.length === 10) fetchShiftsByDateAPI(filterDate);
                    }}
                    className="px-4 py-2 flex items-center gap-2 rounded-lg text-sm font-bold border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 transition-colors"
                >
                    <RefreshCw size={16} className={loading ? "animate-spin text-amber-500" : ""} /> Refresh
                </button>
            </div>

            {/* DATA TABLE */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[300px] relative">

                {/* Beautiful loading overlay */}
                {loading && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                        <RefreshCw size={28} className="animate-spin text-amber-500 mb-3" />
                        <span className="text-sm font-bold text-gray-600">Searching data...</span>
                    </div>
                )}

                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b">
                    <tr>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">ID</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Schedule</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Branch</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {!loading && shifts.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="px-6 py-16 text-center text-gray-500">
                                <div className="flex flex-col items-center gap-2">
                                    <Calendar size={40} className="text-gray-300" />
                                    <p className="font-medium">No shifts on <b className="text-amber-600">{displayDate(filterDate) || "this day"}</b>.</p>
                                    <button onClick={() => navigate("/shifts/create")} className="text-amber-600 text-sm font-bold hover:underline mt-1">+ Click here to create new</button>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        shifts.map((shift) => (
                            <tr key={shift.id} className="hover:bg-amber-50/30 transition-colors">
                                <td className="px-6 py-4 text-sm font-bold text-amber-700">{shortenId(shift.id)}</td>
                                <td className="px-6 py-4">{renderStatusBadge(shift.status)}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    <div className="font-bold text-gray-900">{displayDate(shift.date)}</div>
                                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                        <Clock className="h-3 w-3 text-amber-500" /> {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-600">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="h-3.5 w-3.5 text-gray-400" /> {shift.branchId}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        {shift.status === "PREPARING" ? (
                                            <>
                                                <button onClick={() => navigate(`/shifts/update/${shift.id}`)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => handleDelete(shift.id, shift.status)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors" title="Delete shift">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <div className="flex items-center gap-1 text-gray-400 px-3 py-1.5 bg-gray-50 rounded-lg border border-dashed border-gray-200 cursor-not-allowed">
                                                <Lock className="h-3 w-3" />
                                                <span className="text-[10px] font-bold uppercase tracking-tighter">Locked</span>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}