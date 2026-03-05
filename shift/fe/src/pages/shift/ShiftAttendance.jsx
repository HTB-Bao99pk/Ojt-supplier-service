// Route: /attendance/:shiftId
// Fix chính: load fetchStaffByShift + fetchAttendanceByShift song song
// rồi merge lại → rows luôn có đủ staff dù chưa mark lần nào
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    fetchStaffByShift,
    fetchAttendanceByShift,
    bulkMarkAttendance,
    updateAttendance,
} from "../../api/attendanceApi";

/* ── Status config ───────────────────────────────────────────────────────── */
const STATUS_CFG = {
    PRESENT:     { label: "Present",     bg: "bg-green-100",  text: "text-green-700",  border: "border-green-300", dot: "bg-green-500",  icon: "✓" },
    LATE:        { label: "Late",        bg: "bg-amber-100",  text: "text-amber-700",  border: "border-amber-300", dot: "bg-amber-500",  icon: "◔" },
    ABSENT:      { label: "Absent",      bg: "bg-red-100",    text: "text-red-700",    border: "border-red-300",   dot: "bg-red-500",    icon: "✗" },
    EARLY_LEAVE: { label: "Early Leave", bg: "bg-blue-100",   text: "text-blue-700",   border: "border-blue-300",  dot: "bg-blue-500",   icon: "↩" },
};

const STATUSES = Object.keys(STATUS_CFG);

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const ACLRS    = ["#f97316","#3b82f6","#22c55e","#8b5cf6","#ef4444","#eab308","#06b6d4"];
const avatarBg = (n) => ACLRS[(n?.charCodeAt(0) ?? 0) % ACLRS.length];

function Avatar({ name = "?", size = 36 }) {
    return (
        <div style={{
            width: size, height: size, borderRadius: Math.round(size * .3),
            background: avatarBg(name), flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: size * .4,
        }}>
            {name.charAt(0)}
        </div>
    );
}

function StatusBadge({ status }) {
    const c = STATUS_CFG[status];
    if (!c) return null;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`}/>
            {c.label}
        </span>
    );
}

/* ── EditModal ───────────────────────────────────────────────────────────── */
function EditModal({ record, staffMember, currentStatus, currentNote, onSave, onClose }) {
    const [status, setStatus] = useState(currentStatus);
    const [note,   setNote]   = useState(currentNote ?? "");
    const [saving, setSaving] = useState(false);

    async function handleSave() {
        if (!status) return;
        setSaving(true);
        await onSave(record, status, note);
        setSaving(false);
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-[460px] p-7">
                {/* Header */}
                <div className="flex justify-between items-center mb-5">
                    <div className="flex items-center gap-3">
                        <Avatar name={staffMember?.name ?? "?"} size={44}/>
                        <div>
                            <div className="font-bold text-gray-900">{staffMember?.name}</div>
                            <div className="text-xs text-gray-400">{staffMember?.email}</div>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 text-sm">✕</button>
                </div>

                {/* Originally marked */}
                <div className="bg-gray-50 rounded-xl px-4 py-3 mb-5 flex justify-between items-center">
                    <div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Originally Marked</div>
                        <div className="text-sm text-gray-700">🕐 {new Date(record.markedAt).toLocaleString("en-US")}</div>
                    </div>
                    <StatusBadge status={currentStatus}/>
                </div>

                {/* New status */}
                <div className="mb-4">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">New Status</div>
                    <div className="flex gap-2 flex-wrap">
                        {STATUSES.map((key) => {
                            const c = STATUS_CFG[key];
                            return (
                                <button key={key} onClick={() => setStatus(key)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${
                                        status === key
                                            ? `${c.bg} ${c.text} ${c.border}`
                                            : "bg-gray-50 text-gray-400 border-gray-200 hover:border-gray-300"
                                    }`}>
                                    {c.icon} {c.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Note */}
                <div className="mb-6">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Note</div>
                    <input
                        type="text" value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Add a note…"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 font-semibold text-sm hover:bg-gray-50">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || !status}
                        className="flex-[2] py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        {saving ? "Saving…" : "Update Record"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── ShiftAttendance ─────────────────────────────────────────────────────── */
export default function ShiftAttendance() {
    const { shiftId } = useParams();
    const navigate    = useNavigate();

    const [staff,     setStaff]     = useState([]);
    const [att,       setAtt]       = useState({});   // staffId → { status, note }
    const [records,   setRecords]   = useState([]);   // saved từ BE
    const [loading,   setLoading]   = useState(true);
    const [error,     setError]     = useState(null);
    const [saveState, setSaveState] = useState("idle");
    const [editRec,   setEditRec]   = useState(null);
    const [filter,    setFilter]    = useState("ALL");

    // ── KEY FIX: load staff + attendance cùng lúc, merge lại ──
    const loadData = useCallback(async () => {
        setLoading(true); setError(null);
        try {
            const [staffData, recData] = await Promise.all([
                fetchStaffByShift(shiftId),
                fetchAttendanceByShift(shiftId),
            ]);

            const staffList = Array.isArray(staffData) ? staffData : [];
            const recList   = Array.isArray(recData)   ? recData   : [];

            setStaff(staffList);
            setRecords(recList);

            // Pre-fill att map từ records đã lưu trên BE
            const map = {};
            recList.forEach((r) => {
                map[r.staffId] = { status: r.status, note: r.note ?? "" };
            });
            setAtt(map);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [shiftId]);

    useEffect(() => { loadData(); }, [loadData]);

    /* ── state handlers ── */
    function setStatus(staffId, val) {
        setAtt((p) => ({ ...p, [staffId]: { ...p[staffId], status: val, note: p[staffId]?.note ?? "" } }));
        setSaveState("idle");
    }
    function setNote(staffId, val) {
        setAtt((p) => ({ ...p, [staffId]: { ...p[staffId], note: val } }));
    }

    async function handleSave() {
        const payload = Object.entries(att)
            .filter(([, v]) => v?.status)
            .map(([staffId, v]) => ({ staffId, status: v.status, note: v.note || null }));
        if (!payload.length) return;

        setSaveState("saving");
        try {
            const recs = await bulkMarkAttendance(shiftId, payload);
            setRecords(Array.isArray(recs) ? recs : []);
            setSaveState("saved");
            setTimeout(() => setSaveState("idle"), 3000);
        } catch (e) {
            setError(e.message);
            setSaveState("error");
            setTimeout(() => setSaveState("idle"), 3000);
        }
    }

    async function handleUpdate(rec, newStatus, newNote) {
        await updateAttendance(shiftId, rec.id, rec.staffId, newStatus, newNote);
        setAtt((p) => ({ ...p, [rec.staffId]: { status: newStatus, note: newNote } }));
        const recs = await fetchAttendanceByShift(shiftId);
        setRecords(Array.isArray(recs) ? recs : []);
        setEditRec(null);
    }

    /* ── derived ── */
    const markedCount = Object.values(att).filter((v) => v?.status).length;
    const pct         = staff.length ? Math.round((markedCount / staff.length) * 100) : 0;
    const counts      = Object.values(att).reduce((a, v) => {
        if (v?.status) a[v.status] = (a[v.status] || 0) + 1;
        return a;
    }, {});

    const filteredStaff =
        filter === "ALL"      ? staff :
        filter === "UNMARKED" ? staff.filter((s) => !att[s.id]?.status) :
                                staff.filter((s) => att[s.id]?.status === filter);

    const SAVE_CFG = {
        idle:   { label: `Save Attendance${markedCount > 0 ? ` (${markedCount})` : ""}`, cls: "bg-amber-500 hover:bg-amber-600" },
        saving: { label: "Saving…",          cls: "bg-amber-400" },
        saved:  { label: "✓ Saved!",          cls: "bg-green-500" },
        error:  { label: "⚠ Failed — retry",  cls: "bg-red-500"   },
    };

    /* ── render ── */
    return (
        <div>
            {/* Breadcrumb */}
            <div className="text-xs text-gray-400 mb-2 flex items-center gap-1.5">
                <span className="text-amber-500 font-semibold cursor-pointer hover:underline" onClick={() => navigate("/attendance")}>
                    Attendance
                </span>
                <span>›</span>
                <span className="text-gray-700 font-semibold">{shiftId}</span>
            </div>

            {/* Page header */}
            <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/attendance")}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                        ← Back
                    </button>
                    <div>
                        <h1 className="text-xl font-extrabold text-gray-900">{shiftId}</h1>
                        <p className="text-sm text-gray-400">Mark or update staff attendance.</p>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={markedCount === 0 || saveState === "saving"}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${SAVE_CFG[saveState].cls}`}
                >
                    {SAVE_CFG[saveState].label}
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex justify-between items-center">
                    <span>⚠ {error}</span>
                    <button onClick={loadData} className="text-xs border border-red-300 rounded px-2 py-1 hover:bg-red-100">Retry</button>
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center py-20 text-gray-400 text-sm gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="#e5e7eb" strokeWidth="3"/>
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    Loading staff…
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                    {/* Progress */}
                    <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex gap-4 flex-wrap">
                                {STATUSES.map((k) => (
                                    <span key={k} className="text-xs text-gray-500 flex items-center gap-1">
                                        <span className={`w-2 h-2 rounded-full ${STATUS_CFG[k].dot}`}/>
                                        {STATUS_CFG[k].label}: <b className="text-gray-800 ml-0.5">{counts[k] || 0}</b>
                                    </span>
                                ))}
                                <span className="text-xs text-gray-500">
                                    Unmarked: <b className="text-amber-600">{staff.length - markedCount}</b>
                                </span>
                            </div>
                            <span className="text-sm font-extrabold text-amber-600">{markedCount}/{staff.length} · {pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-red-500 transition-all duration-500" style={{ width: `${pct}%` }}/>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="px-5 py-2.5 border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
                        {/* Filter tabs */}
                        <div className="flex gap-1.5 flex-wrap">
                            {[
                                { key: "ALL",      label: `All (${staff.length})` },
                                { key: "UNMARKED", label: `Unmarked (${staff.length - markedCount})` },
                                ...STATUSES.map((k) => ({ key: k, label: `${STATUS_CFG[k].label} (${counts[k] || 0})` })),
                            ].map((tab) => (
                                <button key={tab.key} onClick={() => setFilter(tab.key)}
                                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                                        filter === tab.key
                                            ? "bg-amber-500 text-white"
                                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                    }`}>
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Quick actions */}
                        <div className="flex gap-2">
                            <button onClick={() => staff.forEach((s) => setStatus(s.id, "PRESENT"))}
                                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-green-50 text-green-700 border border-green-200 hover:bg-green-100">
                                ✓ All Present
                            </button>
                            <button onClick={() => { setAtt({}); setSaveState("idle"); }}
                                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100">
                                ↺ Clear All
                            </button>
                            <button onClick={loadData}
                                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100">
                                ↺ Reload
                            </button>
                        </div>
                    </div>

                    {/* Table header */}
                    <div className="grid px-5 py-2 bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider"
                        style={{ gridTemplateColumns: "36px 180px 1fr 72px" }}>
                        <span>#</span><span>Staff</span><span>Status & Note</span><span></span>
                    </div>

                    {/* Rows */}
                    {staff.length === 0 ? (
                        <div className="py-16 text-center text-gray-400 text-sm">No staff assigned to this shift.</div>
                    ) : filteredStaff.length === 0 ? (
                        <div className="py-10 text-center text-gray-400 text-sm">No staff in this filter.</div>
                    ) : filteredStaff.map((s, i) => {
                        const cur       = att[s.id];
                        const rec       = records.find((r) => r.staffId === s.id);
                        const globalIdx = staff.findIndex((x) => x.id === s.id) + 1;
                        return (
                            <div key={s.id}
                                className={`grid px-5 py-3 border-b border-gray-50 transition-colors ${cur?.status ? "bg-white" : "bg-gray-50/50"}`}
                                style={{ gridTemplateColumns: "36px 180px 1fr 72px" }}>
                                {/* # */}
                                <div className="flex items-center text-xs text-gray-300 font-semibold">{globalIdx}</div>

                                {/* Staff */}
                                <div className="flex items-center gap-2.5">
                                    <Avatar name={s.name} size={34}/>
                                    <div>
                                        <div className="text-sm font-semibold text-gray-900">{s.name}</div>
                                        <div className="text-xs text-gray-400">{s.email}</div>
                                    </div>
                                </div>

                                {/* Status + note */}
                                <div className="flex flex-col gap-2 justify-center">
                                    <div className="flex gap-1.5 flex-wrap">
                                        {STATUSES.map((key) => {
                                            const c = STATUS_CFG[key];
                                            return (
                                                <button key={key}
                                                    onClick={() => setStatus(s.id, cur?.status === key ? null : key)}
                                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border-2 transition-all ${
                                                        cur?.status === key
                                                            ? `${c.bg} ${c.text} ${c.border}`
                                                            : "bg-gray-50 text-gray-400 border-gray-200 hover:border-gray-300"
                                                    }`}>
                                                    {c.icon} {c.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {cur?.status && cur.status !== "PRESENT" && (
                                        <input
                                            placeholder="Add a note (optional)…"
                                            value={cur.note || ""}
                                            onChange={(e) => setNote(s.id, e.target.value)}
                                            className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 w-4/5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                        />
                                    )}
                                </div>

                                {/* Edit */}
                                <div className="flex items-center justify-end">
                                    {rec ? (
                                        <button onClick={() => setEditRec(rec)}
                                            className="px-2.5 py-1 rounded-lg border border-gray-200 text-[11px] font-semibold text-gray-500 hover:bg-gray-50">
                                            ✏ Edit
                                        </button>
                                    ) : cur?.status ? (
                                        <div className={`w-2 h-2 rounded-full ${STATUS_CFG[cur.status]?.dot}`}/>
                                    ) : null}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Edit modal */}
            {editRec && (
                <EditModal
                    record={editRec}
                    staffMember={staff.find((s) => s.id === editRec.staffId)}
                    currentStatus={att[editRec.staffId]?.status}
                    currentNote={att[editRec.staffId]?.note ?? ""}
                    onSave={handleUpdate}
                    onClose={() => setEditRec(null)}
                />
            )}
        </div>
    );
}