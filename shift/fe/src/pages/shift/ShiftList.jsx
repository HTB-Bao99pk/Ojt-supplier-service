import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Calendar, MapPin, Clock, Lock } from "lucide-react";
import { getAllShifts, deleteShift } from "../../api/shiftApi";

export default function ShiftList() {
    const navigate = useNavigate();
    const [shifts, setShifts] = useState([]);
    const [filteredShifts, setFilteredShifts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filterDate, setFilterDate] = useState("");
    const [filterBranch, setFilterBranch] = useState("");

    const fetchShifts = async () => {
        try {
            const data = await getAllShifts();
            const list = data?.content || (Array.isArray(data) ? data : []);

            setShifts(list);
            setFilteredShifts(list);
        } catch (error) {
            console.error("Error fetching shifts", error);
            setShifts([]);
            setFilteredShifts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchShifts(); }, []);

    useEffect(() => {
        let result = shifts;
        if (filterDate) result = result.filter(s => s.date === filterDate);
        if (filterBranch) result = result.filter(s => s.branchId.toLowerCase().includes(filterBranch.toLowerCase()));
        setFilteredShifts(result);
    }, [filterDate, filterBranch, shifts]);

    const handleDelete = async (id, status) => {
        if (status !== "PREPARING") {
            alert("Error: Only shifts in PREPARING status can be deleted!");
            return;
        }

        if (window.confirm("Are you sure you want to delete this future shift?")) {
            try {
                await deleteShift(id);
                alert("Deleted successfully!");
                fetchShifts();
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
        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status]}`}>
                {status}
            </span>
        );
    };

    if (loading) return <div className="p-10 text-center text-gray-500">Loading schedules...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Shift Management</h1>
                <button onClick={() => navigate("/shifts/create")} className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 flex items-center gap-2 shadow-sm">
                    <Calendar className="h-4 w-4" /> Create New Shift
                </button>
            </div>

            {/* FILTERS */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Date</label>
                    <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Branch</label>
                    <input type="text" placeholder="Search branch..." value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <button onClick={() => {setFilterDate(""); setFilterBranch("");}} className="text-sm text-gray-500 hover:text-amber-600 px-2 py-2">Reset</button>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
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
                    <tbody className="divide-y">
                    {filteredShifts.map((shift) => (
                        <tr key={shift.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-bold text-amber-700">{shortenId(shift.id)}</td>
                            <td className="px-6 py-4">{renderStatusBadge(shift.status)}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                <div className="font-medium text-gray-900">{shift.date}</div>
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                    <Clock className="h-3 w-3" /> {shift.startTime.substring(0,5)} - {shift.endTime.substring(0,5)}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{shift.branchId}</td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    {shift.status === "PREPARING" ? (
                                        <>
                                            <button onClick={() => navigate(`/shifts/update/${shift.id}`)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => handleDelete(shift.id, shift.status)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-1 text-gray-400 px-3 py-1.5 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                            <Lock className="h-3 w-3" />
                                            <span className="text-[10px] font-bold uppercase tracking-tighter">Locked</span>
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}