import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    fetchStaffByShift,
    fetchAttendanceByShift,
    bulkMarkAttendance,
    assignStaffToShift,
} from "../../api/attendanceApi";
import { getAllStaffs } from "../../api/staffApi";
import { getShiftById } from "../../api/shiftApi";

const STATUS_CFG = {
    PRESENT:     { label: "Present",     bg: "#dcfce7", text: "#15803d", border: "#86efac", dot: "#22c55e", icon: "✓" },
    LATE:        { label: "Late",        bg: "#fef9c3", text: "#a16207", border: "#fde047", dot: "#eab308", icon: "⏰" },
    ABSENT:      { label: "Absent",      bg: "#fee2e2", text: "#b91c1c", border: "#fca5a5", dot: "#ef4444", icon: "✗" },
    EARLY_LEAVE: { label: "Early Leave", bg: "#dbeafe", text: "#1d4ed8", border: "#93c5fd", dot: "#3b82f6", icon: "↩" },
};

const SHIFT_STATUS_CFG = {
    OPEN:      { label: "Open",      bg: "#dcfce7", text: "#15803d", dot: "#22c55e" },
    PREPARING: { label: "Preparing", bg: "#fef9c3", text: "#a16207", dot: "#eab308" },
    CLOSED:    { label: "Closed",    bg: "#f3f4f6", text: "#6b7280", dot: "#9ca3af" },
};

const STATUSES = Object.keys(STATUS_CFG);
const ACLRS    = ["#f97316","#3b82f6","#22c55e","#8b5cf6","#ef4444","#eab308","#06b6d4","#ec4899"];
const avatarBg = (n) => ACLRS[(n?.charCodeAt(0) ?? 0) % ACLRS.length];

// HÀM CHỐNG LỖI MÀN HÌNH TRẮNG KHI XỬ LÝ THỜI GIAN
const formatTime = (time) => {
    if (!time) return "—";
    if (typeof time === "string") return time.substring(0, 5);
    if (Array.isArray(time)) return `${String(time[0]).padStart(2, '0')}:${String(time[1] || 0).padStart(2, '0')}`;
    return "—";
};

// Đã cập nhật hàm formatShiftId
const formatShiftId = (id) => {
    if (!id) return "—";
    return `SH-${id.substring(0, 5).toUpperCase()}`;
};

function Avatar({ name = "?", size = 38 }) {
    return (
        <div style={{
            width: size, height: size, borderRadius: Math.round(size * .32),
            background: avatarBg(name), flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 800, fontSize: size * .38,
            boxShadow: `0 2px 8px ${avatarBg(name)}50`,
        }}>{name.charAt(0)}</div>
    );
}

function StatusBadge({ status }) {
    const c = STATUS_CFG[status];
    if (!c) return null;
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
            background: c.bg, color: c.text, border: `1.5px solid ${c.border}`,
        }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot }}/>{c.label}</span>
    );
}

export default function ShiftAttendance() {
    const params = useParams();
    const shiftId = params.shiftId || params.id;
    const navigate = useNavigate();

    const [shift,     setShift]     = useState(null);
    const [staff,     setStaff]     = useState([]);
    const [att,       setAtt]       = useState({});
    const [records,   setRecords]   = useState([]);
    const [loading,   setLoading]   = useState(true);
    const [error,     setError]     = useState(null);
    const [saveState, setSaveState] = useState("idle");
    const [filter,    setFilter]    = useState("ALL");

    const [availableStaff, setAvailableStaff] = useState([]);
    const [selectedStaffToAdd, setSelectedStaffToAdd] = useState("");
    const [assigning, setAssigning] = useState(false);

    const loadData = useCallback(async () => {
        if (!shiftId) {
            setError("Không tìm thấy ID ca làm việc trên URL!");
            setLoading(false);
            return;
        }

        setLoading(true); setError(null);
        try {
            const [shiftInfo, staffData, recData] = await Promise.all([
                getShiftById(shiftId),
                fetchStaffByShift(shiftId),
                fetchAttendanceByShift(shiftId),
            ]);

            const staffList = Array.isArray(staffData?.content) ? staffData.content : (Array.isArray(staffData) ? staffData : []);
            const recList   = Array.isArray(recData?.content) ? recData.content : (Array.isArray(recData) ? recData : []);

            setShift(shiftInfo);
            setStaff(staffList);
            setRecords(recList);

            const map = {};
            recList.forEach(r => { map[r.staffId] = { status: r.status, note: r.note ?? "" }; });
            setAtt(map);

            const allBranchData = await getAllStaffs();

            // Lớp giáp bảo vệ đã được áp dụng
            const allBranchStaffArray = Array.isArray(allBranchData?.content)
                ? allBranchData.content
                : (Array.isArray(allBranchData) ? allBranchData : []);

            const assignedIds = staffList.map(s => s.id);
            setAvailableStaff(allBranchStaffArray.filter(s => !assignedIds.includes(s.id)));

        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [shiftId]);

    useEffect(() => { loadData(); }, [loadData]);

    const isOpen = shift?.status === "OPEN";

    const handleAssignStaff = async () => {
        if (!selectedStaffToAdd) return;
        setAssigning(true);
        try {
            await assignStaffToShift(shiftId, selectedStaffToAdd);
            alert("Đã thêm nhân viên vào ca thành công!");
            setSelectedStaffToAdd("");
            await loadData();
        } catch (e) {
            alert("Lỗi khi thêm nhân viên: " + e.message);
        } finally {
            setAssigning(false);
        }
    };

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
            await bulkMarkAttendance(shiftId, payload);
            setSaveState("saved");
            await loadData();
            setTimeout(() => setSaveState("idle"), 3000);
        } catch (e) {
            setError(e.message);
            setSaveState("error");
            setTimeout(() => setSaveState("idle"), 3000);
        }
    }

    const markedCount = Object.values(att).filter(v => v?.status).length;
    const pct         = staff.length ? Math.round((markedCount / staff.length) * 100) : 0;
    const counts      = Object.values(att).reduce((a, v) => {
        if (v?.status) a[v.status] = (a[v.status] || 0) + 1;
        return a;
    }, {});

    const filteredStaff = filter === "ALL" ? staff :
        filter === "UNMARKED" ? staff.filter(s => !att[s.id]?.status) :
            staff.filter(s => att[s.id]?.status === filter);

    const shiftCfg = SHIFT_STATUS_CFG[shift?.status] ?? SHIFT_STATUS_CFG.CLOSED;

    const SAVE_CFG = {
        idle:   { label: `Save Attendance${markedCount > 0 ? ` (${markedCount})` : ""}`, bg: "#f97316" },
        saving: { label: "Saving…",         bg: "#fb923c" },
        saved:  { label: "✓ Saved!",         bg: "#22c55e" },
        error:  { label: "⚠ Retry",          bg: "#ef4444" },
    };

    if (error) {
        return (
            <div className="p-10 text-center text-red-600 bg-red-50 rounded-xl border border-red-200">
                <h2 className="text-xl font-bold mb-2">Đã xảy ra lỗi tải dữ liệu</h2>
                <p>{error}</p>

                <button onClick={() => navigate("/shifts")} className="mt-4 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg">Quay lại danh sách</button>
            </div>
        );
    }

    return (
        <div style={{ fontFamily: "'Plus Jakarta Sans','DM Sans',sans-serif" }}>
            <style>{`
                @keyframes slideUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
                .att-row { transition: background .12s; }
                .att-row:hover { background: #fafbfc !important; }
                .status-btn { transition: all .13s ease; cursor: pointer; }
                .status-btn:hover { transform: translateY(-1px); }
                .status-btn:active { transform: scale(.97); }
            `}</style>

            <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                {/* Đã cập nhật breadcrumb */}
                <span onClick={() => navigate("/shifts")} style={{ color: "#f97316", fontWeight: 600, cursor: "pointer" }}>All Shifts</span>
                <span style={{ color: "#d1d5db" }}>›</span>
                <span style={{ color: "#374151", fontWeight: 600 }}>Shift Details</span>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {/* Đã cập nhật nút back chuyển hướng về /shifts */}
                    <button onClick={() => navigate("/shifts")} style={{
                        background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8,
                        padding: "7px 14px", fontSize: 13, fontWeight: 600, color: "#6b7280", cursor: "pointer"
                    }}>← Back</button>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3 }}>
                            {/* Đã cập nhật sử dụng hàm formatShiftId */}
                            <h1 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: 0 }}>
                                {shift ? `Shift ID: ${formatShiftId(shift.id)}` : "Shift Attendance"}
                            </h1>
                            {shift && <StatusBadge status={shift.status} />}
                        </div>
                        {shift && (
                            <div style={{ fontSize: 12, color: "#9ca3af", display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <span>⏰ {formatTime(shift.startTime)} – {formatTime(shift.endTime)}</span>
                                <span>|</span>
                                <span>📍 Branch: {shift.branchId}</span>
                            </div>
                        )}
                    </div>
                </div>

                {isOpen ? (
                    <button onClick={handleSave} disabled={markedCount === 0 || saveState === "saving"} style={{
                        background: SAVE_CFG[saveState].bg, color: "#fff", border: "none",
                        borderRadius: 10, padding: "10px 22px", fontSize: 13, fontWeight: 700,
                        cursor: markedCount === 0 ? "not-allowed" : "pointer",
                        opacity: markedCount === 0 ? .45 : 1, transition: "background .2s, opacity .2s",
                    }}>{SAVE_CFG[saveState].label}</button>
                ) : shift && (
                    <div style={{ padding: "10px 18px", borderRadius: 10, fontSize: 12, fontWeight: 600, background: shiftCfg.bg, color: shiftCfg.text, border: `1px solid ${shiftCfg.dot}30` }}>
                        {shift.status === "CLOSED" ? "🔒 Shift closed — read only" : "⏳ Shift not started — read only"}
                    </div>
                )}
            </div>

            {isOpen && (
                <div style={{ padding: "16px 20px", background: "#f8f9fb", borderRadius: 12, border: "1px solid #e5e7eb", marginBottom: 20, display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                        <select
                            value={selectedStaffToAdd}
                            onChange={(e) => setSelectedStaffToAdd(e.target.value)}
                            style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #d1d5db", outline: "none", fontSize: 13 }}
                        >
                            <option value="">-- Chọn nhân viên để thêm vào ca --</option>
                            {availableStaff.map((s, idx) => (
                                <option key={s.id || `avail-${idx}`} value={s.id}>{s.name} ({s.id})</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={handleAssignStaff}
                        disabled={!selectedStaffToAdd || assigning}
                        style={{
                            background: "#3b82f6", color: "#fff", padding: "10px 20px", borderRadius: 8, border: "none",
                            fontWeight: 700, fontSize: 13, cursor: (!selectedStaffToAdd || assigning) ? "not-allowed" : "pointer",
                            opacity: (!selectedStaffToAdd || assigning) ? 0.6 : 1, transition: "all 0.2s"
                        }}
                    >
                        {assigning ? "Đang thêm..." : "+ Thêm vào ca"}
                    </button>
                </div>
            )}

            {loading ? (
                <div style={{ padding: 72, textAlign: "center", color: "#9ca3af" }}>Loading Data...</div>
            ) : (
                <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", overflow: "hidden" }}>
                    <div style={{ padding: "14px 20px", background: "#fafafa", borderBottom: "1px solid #f0f2f5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", gap: 16 }}>
                            {STATUSES.map(k => (
                                <div key={k} style={{ fontSize: 12, color: "#6b7280" }}>{STATUS_CFG[k].label}: <b style={{ color: "#111827" }}>{counts[k] || 0}</b></div>
                            ))}
                            <div style={{ fontSize: 12, color: "#6b7280" }}>Unmarked: <b style={{ color: "#f97316" }}>{staff.length - markedCount}</b></div>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 800, color: "#f97316" }}>{pct}% Complete</span>
                    </div>

                    <div style={{ height: 4, background: "#f3f4f6" }}><div style={{ height: "100%", width: `${pct}%`, background: "#f97316", transition: "width .5s" }}/></div>

                    <div style={{ padding: "10px 20px", borderBottom: "1px solid #f0f2f5", display: "flex", gap: 8 }}>
                        {[{ key: "ALL", label: `All (${staff.length})` }, ...STATUSES.map(k => ({ key: k, label: `${STATUS_CFG[k].label} (${counts[k]||0})` }))].map(tab => (
                            <button key={tab.key} onClick={() => setFilter(tab.key)} style={{
                                padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "pointer",
                                background: filter === tab.key ? "#f97316" : "#f3f4f6", color: filter === tab.key ? "#fff" : "#6b7280", border: "none"
                            }}>{tab.label}</button>
                        ))}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "44px 1fr 1fr", padding: "9px 20px", background: "#f8f9fb", borderBottom: "1px solid #e5e7eb" }}>
                        {["#", "Staff Member", isOpen ? "Mark Status" : "Status & Notes"].map((h, i) => (
                            <div key={i} style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase" }}>{h}</div>
                        ))}
                    </div>

                    {filteredStaff.map((s, i) => {
                        const cur = att[s.id];
                        const rec = records.find(r => r.staffId === s.id);

                        return (
                            <div key={s.id || `staff-${i}`} className="att-row" style={{ display: "grid", gridTemplateColumns: "44px 1fr 1fr", padding: "13px 20px", borderBottom: "1px solid #f3f4f6" }}>
                                <div style={{ display: "flex", alignItems: "center" }}><span style={{ fontSize: 12, fontWeight: 700, color: "#d1d5db" }}>{i+1}</span></div>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <Avatar name={s.name || s.staffName} size={38}/>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 13 }}>{s.name || s.staffName || "Nhân viên"}</div>
                                        <div style={{ fontSize: 11, color: "#9ca3af" }}>{s.email || "No Email"}</div>
                                        {rec?.note && <div style={{ fontSize: 11, color: "#f97316", marginTop: 2 }}>📝 {rec.note}</div>}
                                    </div>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: 7, justifyContent: "center" }}>
                                    {isOpen ? (
                                        <>
                                            <div style={{ display: "flex", gap: 5 }}>
                                                {STATUSES.map(key => {
                                                    const c = STATUS_CFG[key];
                                                    const sel = cur?.status === key;
                                                    return (
                                                        <button key={key} className="status-btn" onClick={() => setStatus(s.id, sel ? null : key)}
                                                                style={{
                                                                    padding: "5px 11px", borderRadius: 8, fontSize: 11, fontWeight: 700, border: "2px solid",
                                                                    background: sel ? c.bg : "#f9fafb", color: sel ? c.text : "#9ca3af", borderColor: sel ? c.border : "#e5e7eb",
                                                                }}>{c.icon} {c.label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            {cur?.status && cur.status !== "PRESENT" && (
                                                <input placeholder="Add note..." value={cur.note || ""} onChange={e => setNote(s.id, e.target.value)}
                                                       style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "6px 10px", fontSize: 12, width: "75%", outline: "none" }}/>
                                            )}
                                        </>
                                    ) : (
                                        cur?.status ? <StatusBadge status={cur.status}/> : <span style={{ fontSize: 12, color: "#d1d5db", fontStyle: "italic" }}>Not marked</span>
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