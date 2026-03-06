// Route: /attendance/:shiftId
// - Đẹp hơn với design tinh tế, card layout
// - Nếu shift không phải OPEN → read-only, không cho chỉnh status
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    fetchStaffByShift,
    fetchAttendanceByShift,
    fetchShiftsByDate,
    bulkMarkAttendance,
    todayDate,
} from "../../api/attendanceApi";

/* ── Status config ───────────────────────────────────────────────────────── */
const STATUS_CFG = {
    PRESENT:     { label: "Present",     bg: "#dcfce7", text: "#15803d", border: "#86efac", dot: "#22c55e", icon: "✓", activeBg: "#f0fdf4" },
    LATE:        { label: "Late",        bg: "#fef9c3", text: "#a16207", border: "#fde047", dot: "#eab308", icon: "⏰", activeBg: "#fefce8" },
    ABSENT:      { label: "Absent",      bg: "#fee2e2", text: "#b91c1c", border: "#fca5a5", dot: "#ef4444", icon: "✗", activeBg: "#fef2f2" },
    EARLY_LEAVE: { label: "Early Leave", bg: "#dbeafe", text: "#1d4ed8", border: "#93c5fd", dot: "#3b82f6", icon: "↩", activeBg: "#eff6ff" },
};

const SHIFT_STATUS_CFG = {
    OPEN:      { label: "Open",      bg: "#dcfce7", text: "#15803d", dot: "#22c55e", glow: "rgba(34,197,94,.15)"  },
    PREPARING: { label: "Preparing", bg: "#fef9c3", text: "#a16207", dot: "#eab308", glow: "rgba(234,179,8,.15)"  },
    CLOSED:    { label: "Closed",    bg: "#f3f4f6", text: "#6b7280", dot: "#9ca3af", glow: "rgba(156,163,175,.1)" },
};

const STATUSES = Object.keys(STATUS_CFG);
const ACLRS    = ["#f97316","#3b82f6","#22c55e","#8b5cf6","#ef4444","#eab308","#06b6d4","#ec4899"];
const avatarBg = (n) => ACLRS[(n?.charCodeAt(0) ?? 0) % ACLRS.length];
const fmt      = (t) => t?.slice(0,5) ?? "—";

/* ── Avatar ──────────────────────────────────────────────────────────────── */
function Avatar({ name = "?", size = 38 }) {
    return (
        <div style={{
            width: size, height: size, borderRadius: Math.round(size * .32),
            background: avatarBg(name), flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 800, fontSize: size * .38,
            boxShadow: `0 2px 8px ${avatarBg(name)}50`,
        }}>
            {name.charAt(0)}
        </div>
    );
}

/* ── StatusBadge ─────────────────────────────────────────────────────────── */
function StatusBadge({ status }) {
    const c = STATUS_CFG[status];
    if (!c) return null;
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
            background: c.bg, color: c.text, border: `1.5px solid ${c.border}`,
        }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot }}/>
            {c.label}
        </span>
    );
}

/* ── ShiftAttendance ─────────────────────────────────────────────────────── */
export default function ShiftAttendance() {
    const { shiftId } = useParams();
    const navigate    = useNavigate();

    const [shift,     setShift]     = useState(null);   // full shift info incl. status
    const [staff,     setStaff]     = useState([]);
    const [att,       setAtt]       = useState({});
    const [records,   setRecords]   = useState([]);
    const [loading,   setLoading]   = useState(true);
    const [error,     setError]     = useState(null);
    const [saveState, setSaveState] = useState("idle");
    const [filter,    setFilter]    = useState("ALL");

    const loadData = useCallback(async () => {
        setLoading(true); setError(null);
        try {
            // load shift info (to get status), staff, attendance concurrently
            const [shifts, staffData, recData] = await Promise.all([
                fetchShiftsByDate(todayDate()),
                fetchStaffByShift(shiftId),
                fetchAttendanceByShift(shiftId),
            ]);

            const shiftInfo = Array.isArray(shifts)
                ? shifts.find(s => s.id === shiftId) ?? null
                : null;

            const staffList = Array.isArray(staffData) ? staffData : [];
            const recList   = Array.isArray(recData)   ? recData   : [];

            setShift(shiftInfo);
            setStaff(staffList);
            setRecords(recList);

            const map = {};
            recList.forEach(r => { map[r.staffId] = { status: r.status, note: r.note ?? "" }; });
            setAtt(map);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [shiftId]);

    useEffect(() => { loadData(); }, [loadData]);

    const isOpen = shift?.status === "OPEN";   // only OPEN → editable

    function setStatus(staffId, val) {
        if (!isOpen) return;
        setAtt(p => ({ ...p, [staffId]: { ...p[staffId], status: val, note: p[staffId]?.note ?? "" } }));
        setSaveState("idle");
    }
    function setNote(staffId, val) {
        if (!isOpen) return;
        setAtt(p => ({ ...p, [staffId]: { ...p[staffId], note: val } }));
    }

    async function handleSave() {
        if (!isOpen) return;
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

    /* derived */
    const markedCount = Object.values(att).filter(v => v?.status).length;
    const pct         = staff.length ? Math.round((markedCount / staff.length) * 100) : 0;
    const counts      = Object.values(att).reduce((a, v) => {
        if (v?.status) a[v.status] = (a[v.status] || 0) + 1;
        return a;
    }, {});

    const filteredStaff =
        filter === "ALL"      ? staff :
        filter === "UNMARKED" ? staff.filter(s => !att[s.id]?.status) :
                                staff.filter(s => att[s.id]?.status === filter);

    const shiftCfg = SHIFT_STATUS_CFG[shift?.status] ?? SHIFT_STATUS_CFG.CLOSED;

    const SAVE_CFG = {
        idle:   { label: `Save Attendance${markedCount > 0 ? ` (${markedCount})` : ""}`, bg: "#f97316" },
        saving: { label: "Saving…",         bg: "#fb923c" },
        saved:  { label: "✓ Saved!",         bg: "#22c55e" },
        error:  { label: "⚠ Retry",          bg: "#ef4444" },
    };

    return (
        <div style={{ fontFamily: "'Plus Jakarta Sans','DM Sans',sans-serif" }}>
            <style>{`
                @keyframes slideUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
                @keyframes spin    { to{transform:rotate(360deg)} }
                .att-row { transition: background .12s; }
                .att-row:hover { background: #fafbfc !important; }
                .status-btn { transition: all .13s ease; cursor: pointer; }
                .status-btn:hover { transform: translateY(-1px); }
                .status-btn:active { transform: scale(.97); }
            `}</style>

            {/* ── Breadcrumb ── */}
            <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <span onClick={() => navigate("/attendance")}
                    style={{ color: "#f97316", fontWeight: 600, cursor: "pointer" }}
                    onMouseEnter={e => e.target.style.textDecoration="underline"}
                    onMouseLeave={e => e.target.style.textDecoration="none"}>
                    Attendance
                </span>
                <span style={{ color: "#d1d5db" }}>›</span>
                <span style={{ color: "#374151", fontWeight: 600 }}>{shiftId}</span>
            </div>

            {/* ── Page header ── */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <button onClick={() => navigate("/attendance")} style={{
                        background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8,
                        padding: "7px 14px", fontSize: 13, fontWeight: 600, color: "#6b7280",
                        cursor: "pointer", transition: "all .13s",
                    }}
                        onMouseEnter={e => e.currentTarget.style.background="#f9fafb"}
                        onMouseLeave={e => e.currentTarget.style.background="#fff"}>
                        ← Back
                    </button>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3 }}>
                            <h1 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: 0 }}>{shiftId}</h1>
                            {shift && (
                                <span style={{
                                    display: "inline-flex", alignItems: "center", gap: 5,
                                    padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                                    background: shiftCfg.bg, color: shiftCfg.text,
                                }}>
                                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: shiftCfg.dot }}/>
                                    {shiftCfg.label}
                                </span>
                            )}
                        </div>
                        {shift && (
                            <div style={{ fontSize: 12, color: "#9ca3af" }}>
                                ⏰ {fmt(shift.startTime)} – {fmt(shift.endTime)} · 📍 {shift.branchId}
                            </div>
                        )}
                    </div>
                </div>

                {/* Save button — hidden when not OPEN */}
                {isOpen ? (
                    <button onClick={handleSave}
                        disabled={markedCount === 0 || saveState === "saving"}
                        style={{
                            background: SAVE_CFG[saveState].bg, color: "#fff", border: "none",
                            borderRadius: 10, padding: "10px 22px", fontSize: 13, fontWeight: 700,
                            cursor: markedCount === 0 ? "not-allowed" : "pointer",
                            opacity: markedCount === 0 ? .45 : 1,
                            transition: "background .2s, opacity .2s",
                            boxShadow: "0 2px 8px rgba(249,115,22,.25)",
                        }}>
                        {SAVE_CFG[saveState].label}
                    </button>
                ) : shift && (
                    <div style={{
                        padding: "10px 18px", borderRadius: 10, fontSize: 12, fontWeight: 600,
                        background: shiftCfg.bg, color: shiftCfg.text, border: `1px solid ${shiftCfg.dot}30`,
                    }}>
                        {shift.status === "CLOSED" ? "🔒 Shift closed — read only" : "⏳ Shift not started — read only"}
                    </div>
                )}
            </div>

            {/* Error */}
            {error && (
                <div style={{ padding: "11px 16px", borderRadius: 10, marginBottom: 14, background: "#fef2f2", border: "1px solid #fca5a5", color: "#b91c1c", fontSize: 13, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>⚠ {error}</span>
                    <button onClick={loadData} style={{ fontSize: 11, border: "1px solid #fca5a5", borderRadius: 6, padding: "3px 10px", background: "transparent", color: "#b91c1c", cursor: "pointer" }}>Retry</button>
                </div>
            )}

            {loading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 72, gap: 10, color: "#9ca3af", fontSize: 13 }}>
                    <svg style={{ animation: "spin 1s linear infinite", width: 18, height: 18 }} viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="#e5e7eb" strokeWidth="3"/>
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="#f97316" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    Loading…
                </div>
            ) : (
                <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", boxShadow: "0 1px 6px rgba(0,0,0,.06)", overflow: "hidden" }}>

                    {/* ── Stats bar ── */}
                    <div style={{ padding: "14px 20px", borderBottom: "1px solid #f0f2f5", background: "#fafafa", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                            {STATUSES.map(k => (
                                <div key={k} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: STATUS_CFG[k].dot, flexShrink: 0 }}/>
                                    <span style={{ fontSize: 12, color: "#6b7280" }}>
                                        {STATUS_CFG[k].label}: <b style={{ color: "#111827" }}>{counts[k] || 0}</b>
                                    </span>
                                </div>
                            ))}
                            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#d1d5db", flexShrink: 0 }}/>
                                <span style={{ fontSize: 12, color: "#6b7280" }}>
                                    Unmarked: <b style={{ color: "#f97316" }}>{staff.length - markedCount}</b>
                                </span>
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontSize: 13, fontWeight: 800, color: "#f97316" }}>
                                {markedCount}/{staff.length} · {pct}%
                            </span>
                        </div>
                    </div>

                    {/* ── Progress bar ── */}
                    <div style={{ height: 4, background: "#f3f4f6" }}>
                        <div style={{ height: "100%", width: `${pct}%`, transition: "width .5s ease", background: pct === 100 ? "#22c55e" : "linear-gradient(90deg,#f97316,#ef4444)" }}/>
                    </div>

                    {/* ── Toolbar ── */}
                    <div style={{ padding: "10px 20px", borderBottom: "1px solid #f0f2f5", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                        {/* Filters */}
                        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                            {[
                                { key: "ALL",      label: `All (${staff.length})` },
                                { key: "UNMARKED", label: `Unmarked (${staff.length - markedCount})` },
                                ...STATUSES.map(k => ({ key: k, label: `${STATUS_CFG[k].label} (${counts[k]||0})` })),
                            ].map(tab => (
                                <button key={tab.key} onClick={() => setFilter(tab.key)} style={{
                                    padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                                    cursor: "pointer", transition: "all .12s",
                                    background: filter === tab.key ? "#f97316" : "#f3f4f6",
                                    color:      filter === tab.key ? "#fff"    : "#6b7280",
                                    border:     filter === tab.key ? "1px solid #f97316" : "1px solid #e5e7eb",
                                }}>
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Quick actions — only when OPEN */}
                        <div style={{ display: "flex", gap: 6 }}>
                            {isOpen && (
                                <>
                                    <button onClick={() => staff.forEach(s => setStatus(s.id, "PRESENT"))} style={{
                                        padding: "4px 12px", borderRadius: 7, fontSize: 11, fontWeight: 700,
                                        background: "#f0fdf4", color: "#15803d", border: "1px solid #86efac", cursor: "pointer",
                                    }}>✓ All Present</button>
                                    <button onClick={() => { setAtt({}); setSaveState("idle"); }} style={{
                                        padding: "4px 12px", borderRadius: 7, fontSize: 11, fontWeight: 700,
                                        background: "#fef2f2", color: "#b91c1c", border: "1px solid #fca5a5", cursor: "pointer",
                                    }}>↺ Clear</button>
                                </>
                            )}
                            <button onClick={loadData} style={{
                                padding: "4px 12px", borderRadius: 7, fontSize: 11, fontWeight: 600,
                                background: "#f9fafb", color: "#6b7280", border: "1px solid #e5e7eb", cursor: "pointer",
                            }}>↺ Reload</button>
                        </div>
                    </div>

                    {/* ── Read-only banner ── */}
                    {!isOpen && shift && (
                        <div style={{ padding: "10px 20px", background: `${shiftCfg.glow}`, borderBottom: "1px solid #f0f2f5", display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: shiftCfg.text, fontWeight: 600 }}>
                            <span style={{ fontSize: 14 }}>{shift.status === "CLOSED" ? "🔒" : "⏳"}</span>
                            {shift.status === "CLOSED"
                                ? "This shift is closed. Attendance records are view-only."
                                : "This shift hasn't started yet. Attendance cannot be marked."}
                        </div>
                    )}

                    {/* ── Table header ── */}
                    <div style={{ display: "grid", gridTemplateColumns: "44px 1fr 1fr", padding: "9px 20px", background: "#f8f9fb", borderBottom: "1px solid #e5e7eb" }}>
                        {["#", "Staff Member", isOpen ? "Mark Status" : "Status"].map((h, i) => (
                            <div key={i} style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: .6 }}>{h}</div>
                        ))}
                    </div>

                    {/* ── Rows ── */}
                    {staff.length === 0 ? (
                        <div style={{ padding: 60, textAlign: "center", color: "#9ca3af", fontSize: 14 }}>
                            <div style={{ fontSize: 32, marginBottom: 8 }}>👥</div>
                            No staff assigned to this shift.
                        </div>
                    ) : filteredStaff.length === 0 ? (
                        <div style={{ padding: 40, textAlign: "center", color: "#9ca3af", fontSize: 13 }}>No staff in this filter.</div>
                    ) : filteredStaff.map((s, i) => {
                        const cur       = att[s.id];
                        const rec       = records.find(r => r.staffId === s.id);
                        const globalIdx = staff.findIndex(x => x.id === s.id) + 1;
                        const activeCfg = cur?.status ? STATUS_CFG[cur.status] : null;

                        return (
                            <div key={s.id} className="att-row" style={{
                                display: "grid", gridTemplateColumns: "44px 1fr 1fr",
                                padding: "13px 20px", borderBottom: "1px solid #f3f4f6",
                                background: activeCfg ? `${activeCfg.activeBg}` : "#fff",
                                animation: `slideUp .2s ease ${i * 25}ms both`,
                            }}>
                                {/* # */}
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: "#d1d5db" }}>{globalIdx}</span>
                                </div>

                                {/* Staff info */}
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <Avatar name={s.name} size={38}/>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 13, color: "#111827", marginBottom: 2 }}>{s.name}</div>
                                        <div style={{ fontSize: 11, color: "#9ca3af" }}>{s.email}</div>
                                        {rec && <div style={{ marginTop: 4 }}><StatusBadge status={rec.status}/></div>}
                                    </div>
                                </div>

                                {/* Status column */}
                                <div style={{ display: "flex", flexDirection: "column", gap: 7, justifyContent: "center" }}>
                                    {isOpen ? (
                                        /* ── Editable: status buttons ── */
                                        <>
                                            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                                                {STATUSES.map(key => {
                                                    const c   = STATUS_CFG[key];
                                                    const sel = cur?.status === key;
                                                    return (
                                                        <button key={key} className="status-btn"
                                                            onClick={() => setStatus(s.id, sel ? null : key)}
                                                            style={{
                                                                padding: "5px 11px", borderRadius: 8,
                                                                fontSize: 11, fontWeight: 700, border: "2px solid",
                                                                background: sel ? c.bg      : "#f9fafb",
                                                                color:      sel ? c.text    : "#9ca3af",
                                                                borderColor:sel ? c.border  : "#e5e7eb",
                                                                boxShadow:  sel ? `0 2px 8px ${c.dot}30` : "none",
                                                            }}>
                                                            {c.icon} {c.label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            {cur?.status && cur.status !== "PRESENT" && (
                                                <input
                                                    placeholder="Add a note (optional)…"
                                                    value={cur.note || ""}
                                                    onChange={e => setNote(s.id, e.target.value)}
                                                    style={{
                                                        border: "1px solid #e5e7eb", borderRadius: 8,
                                                        padding: "6px 10px", fontSize: 12, color: "#374151",
                                                        width: "75%", outline: "none", background: "#fff",
                                                        transition: "border .15s",
                                                    }}
                                                    onFocus={e => e.target.style.borderColor="#f97316"}
                                                    onBlur={e  => e.target.style.borderColor="#e5e7eb"}
                                                />
                                            )}
                                        </>
                                    ) : (
                                        /* ── Read-only: show badge or dash ── */
                                        cur?.status
                                            ? <StatusBadge status={cur.status}/>
                                            : <span style={{ fontSize: 12, color: "#d1d5db", fontStyle: "italic" }}>Not marked</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}