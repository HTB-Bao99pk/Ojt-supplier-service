import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Search, Mail, Phone, MapPin, RefreshCw, UserPlus } from "lucide-react";
import { getAllStaffs, updateStaffStatus } from "../../api/staffApi";

/* ── Status config ───────────────────────────────────────────────────────── */
const STATUS_CFG = {
    ACTIVE: {
        label:        "Working",
        badgeCls:     "bg-green-100 text-green-700 border-green-200",
        dot:          "bg-green-500",
        actionLabel:  "Set Inactive",
        actionCls:    "bg-red-50 text-red-600 border-red-200 hover:bg-red-100",
        next:         "INACTIVE",
    },
    INACTIVE: {
        label:        "Inactive",
        badgeCls:     "bg-gray-100 text-gray-500 border-gray-200",
        dot:          "bg-gray-400",
        actionLabel:  "Reactivate",
        actionCls:    "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
        next:         "ACTIVE",
    },
};

/* ── StatusCell ──────────────────────────────────────────────────────────── */
function StatusCell({ staffId, initialStatus, onChanged }) {
    const [status,  setStatus]  = useState(initialStatus ?? "ACTIVE");
    const [confirm, setConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const cfg = STATUS_CFG[status] ?? STATUS_CFG.ACTIVE;

    async function doToggle() {
        setLoading(true);
        try {
            await updateStaffStatus(staffId, cfg.next);
            setStatus(cfg.next);
            onChanged?.(cfg.next);
        } catch (e) {
            alert("Error: " + e.message);
        } finally {
            setLoading(false);
            setConfirm(false);
        }
    }

    return (
        <div className="flex flex-col gap-1.5">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border w-fit ${cfg.badgeCls}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}/>
                {cfg.label}
            </span>

            {confirm ? (
                <div className="flex items-center gap-1.5">
                    <button onClick={doToggle} disabled={loading}
                        className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border transition-colors disabled:opacity-50 ${cfg.actionCls}`}>
                        {loading ? "..." : "Confirm"}
                    </button>
                    <button onClick={() => setConfirm(false)}
                        className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold border border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100">
                        Cancel
                    </button>
                </div>
            ) : (
                <button onClick={() => setConfirm(true)}
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border transition-colors w-fit ${cfg.actionCls}`}>
                    {cfg.actionLabel}
                </button>
            )}
        </div>
    );
}

/* ── StaffList ───────────────────────────────────────────────────────────── */
export default function StaffList() {
    const navigate = useNavigate();
    const [staffs,       setStaffs]       = useState([]);
    const [loading,      setLoading]      = useState(true);
    const [searchTerm,   setSearchTerm]   = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const fetchStaffs = async () => {
        setLoading(true);
        try {
            const data = await getAllStaffs();
            const list = data?.content || (Array.isArray(data) ? data : []);
            setStaffs(list);
        } catch (e) {
            console.error(e);
            setStaffs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStaffs(); }, []);

    /* derived */
    const activeCount   = staffs.filter(s => s.status === "ACTIVE").length;
    const inactiveCount = staffs.filter(s => s.status === "INACTIVE").length;

    const filtered = staffs.filter(s => {
        const matchSearch = !searchTerm ||
            (s.staffCode || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.name      || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === "ALL" || s.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const renderGender = (g) => {
        if (g === "MALE")   return <span className="text-blue-600 font-medium text-xs bg-blue-50 px-2 py-0.5 rounded border border-blue-100">Male</span>;
        if (g === "FEMALE") return <span className="text-pink-600 font-medium text-xs bg-pink-50 px-2 py-0.5 rounded border border-pink-100">Female</span>;
        return <span className="text-gray-500 font-medium text-xs bg-gray-100 px-2 py-0.5 rounded border border-gray-200">Other</span>;
    };

    return (
        <div className="space-y-6">

            {/* ── Header ── */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Staff Management</h1>
                <button onClick={() => navigate("/staff/create")}
                    className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 flex items-center gap-2 shadow-sm transition-colors font-bold text-sm">
                    <UserPlus className="h-4 w-4"/> Create New Staff
                </button>
            </div>

            {/* ── Summary cards ── */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Total Staff", value: staffs.length, cls: "bg-white border-gray-200 text-gray-800" },
                    { label: "Working",  value: activeCount,   cls: "bg-green-50 border-green-200 text-green-700" },
                    { label: "Inactive",      value: inactiveCount, cls: "bg-gray-50 border-gray-200 text-gray-500" },
                ].map(c => (
                    <div key={c.label} className={`rounded-xl border px-5 py-4 shadow-sm ${c.cls}`}>
                        <div className="text-2xl font-extrabold">{c.value}</div>
                        <div className="text-xs font-semibold text-gray-400 mt-0.5">{c.label}</div>
                    </div>
                ))}
            </div>

            {/* ── Search + filter bar ── */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap gap-3 items-end justify-between">
                <div className="flex-1 min-w-[240px] max-w-md">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Search Staff</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
                        <input
                            type="text"
                            placeholder="Name or Staff ID..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-400 font-medium"
                        />
                    </div>
                </div>

                <div className="flex gap-1.5 flex-wrap">
                    {[
                        { key: "ALL",      label: `All (${staffs.length})`    },
                        { key: "ACTIVE",   label: `Working (${activeCount})`    },
                        { key: "INACTIVE", label: `Inactive (${inactiveCount})` },
                    ].map(tab => (
                        <button key={tab.key} onClick={() => setStatusFilter(tab.key)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                                statusFilter === tab.key
                                    ? "bg-amber-500 text-white border-amber-500"
                                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                            }`}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                <button onClick={fetchStaffs}
                    className="px-4 py-2 flex items-center gap-2 rounded-lg text-sm font-bold border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 transition-colors shadow-sm">
                    <RefreshCw size={15} className={loading ? "animate-spin text-amber-500" : ""}/>
                    Refresh
                </button>
            </div>

            {/* ── Table ── */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[300px] relative">
                {loading && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3">
                        <RefreshCw size={26} className="animate-spin text-amber-500"/>
                        <span className="text-sm font-bold text-gray-500">Loading staff data...</span>
                    </div>
                )}

                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b">
                        <tr>
                            {["Staff ID", "Employee", "Contact", "Branch", "Status", ""].map((h, i) => (
                                <th key={i} className={`px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider ${i === 5 ? "text-right" : ""}`}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {!loading && filtered.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-16 text-center text-gray-400">
                                    <div className="flex flex-col items-center gap-2">
                                        <Search size={36} className="text-gray-200"/>
                                        <p className="font-medium text-sm">No staff found.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : filtered.map(staff => (
                            <tr key={staff.id} className="hover:bg-amber-50/30 transition-colors">

                                {/* Staff Code */}
                                <td className="px-6 py-4">
                                    <span className="text-sm font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                                        {staff.staffCode || "—"}
                                    </span>
                                </td>

                                {/* Name + gender + email */}
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-900 text-sm flex items-center gap-2">
                                        {staff.name}
                                        {renderGender(staff.gender)}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                                        <Mail className="h-3 w-3"/> {staff.email || "—"}
                                    </div>
                                </td>

                                {/* Phone */}
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1.5">
                                        <Phone className="h-3.5 w-3.5 text-gray-300"/> {staff.phone || "—"}
                                    </div>
                                </td>

                                {/* Branch */}
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="h-3.5 w-3.5 text-gray-300"/> {staff.branchId || "—"}
                                    </div>
                                </td>

                                {/* Status toggle */}
                                <td className="px-6 py-4">
                                    <StatusCell
                                        staffId={staff.id}
                                        initialStatus={staff.status}
                                        onChanged={newStatus =>
                                            setStaffs(prev =>
                                                prev.map(s => s.id === staff.id ? { ...s, status: newStatus } : s)
                                            )
                                        }
                                    />
                                </td>

                                {/* Edit */}
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => navigate(`/staff/update/${staff.id}`)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit">
                                        <Edit className="h-4 w-4"/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}