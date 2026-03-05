// Route: /attendance
// Danh sách shifts theo ngày → click → /attendance/:shiftId
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchShiftsByDate, todayDate } from "../../api/attendanceApi";

const fmt = (t) => t?.slice(0, 5) ?? "—";

function getPeriod(startTime) {
    const h = parseInt(startTime ?? "0");
    if (h >= 5  && h < 12) return { label: "Morning",   color: "#f97316", bg: "#fff7ed", emoji: "🌅" };
    if (h >= 12 && h < 18) return { label: "Afternoon", color: "#3b82f6", bg: "#eff6ff", emoji: "☀️"  };
    return                        { label: "Night",      color: "#8b5cf6", bg: "#f5f3ff", emoji: "🌙" };
}

const STATUS_PILL = {
    OPEN:      { bg: "#dcfce7", color: "#15803d", dot: "#22c55e", label: "Open"      },
    PREPARING: { bg: "#fef9c3", color: "#a16207", dot: "#eab308", label: "Preparing" },
    CLOSED:    { bg: "#f3f4f6", color: "#6b7280", dot: "#9ca3af", label: "Closed"    },
};

function ShiftCard({ shift, onClick }) {
    const [hovered,  setHovered]  = useState(false);
    const [pressed,  setPressed]  = useState(false);
    const period   = getPeriod(shift.startTime);
    const canMark  = shift.status !== "CLOSED";
    const pillCfg  = STATUS_PILL[shift.status] ?? STATUS_PILL.CLOSED;

    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => { setHovered(false); setPressed(false); }}
            onMouseDown={() => setPressed(true)}
            onMouseUp={() => setPressed(false)}
            style={{
                background: "#fff",
                borderRadius: 16,
                border: `2px solid ${hovered ? period.color : "#e8eaed"}`,
                padding: "18px 20px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: 14,
                boxShadow: hovered
                    ? `0 8px 24px ${period.color}20`
                    : "0 1px 4px rgba(0,0,0,.05)",
                transform: pressed ? "scale(.98)" : hovered ? "translateY(-2px)" : "none",
                transition: "all .18s ease",
            }}
        >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: period.bg,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 20,
                        transition: "transform .18s",
                        transform: hovered ? "scale(1.1)" : "none",
                    }}>
                        {period.emoji}
                    </div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: 14, color: "#111827" }}>{shift.id}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: period.color }}>{period.label} Shift</div>
                    </div>
                </div>
                <span style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                    background: pillCfg.bg, color: pillCfg.color,
                }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: pillCfg.dot }}/>
                    {pillCfg.label}
                </span>
            </div>

            {/* Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {[
                    { icon: "⏰", text: `${fmt(shift.startTime)} – ${fmt(shift.endTime)}` },
                    { icon: "📍", text: shift.branchId ?? "—" },
                    { icon: "👥", text: `${shift.staffCount ?? "—"} staff assigned` },
                ].map(({ icon, text }) => (
                    <div key={text} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "#374151" }}>
                        <span style={{ fontSize: 14 }}>{icon}</span> {text}
                    </div>
                ))}
            </div>

            {/* CTA button */}
            <div style={{
                padding: "10px 0",
                borderRadius: 10,
                textAlign: "center",
                fontSize: 13, fontWeight: 700,
                background: hovered
                    ? (canMark ? period.color : "#e5e7eb")
                    : (canMark ? "#fff7ed"    : "#f9fafb"),
                color: hovered
                    ? (canMark ? "#fff"       : "#9ca3af")
                    : (canMark ? period.color : "#9ca3af"),
                border: `1.5px solid ${canMark ? (hovered ? period.color : `${period.color}40`) : "#e5e7eb"}`,
                transition: "all .18s ease",
                letterSpacing: .2,
            }}>
                {canMark ? (hovered ? "Mark Attendance →" : "Mark Attendance") : "View Attendance"}
            </div>
        </div>
    );
}

export default function Attendance() {
    const navigate = useNavigate();
    const [date,    setDate]    = useState(todayDate());
    const [shifts,  setShifts]  = useState([]);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(null);

    const load = (d) => {
        setLoading(true); setError(null);
        fetchShiftsByDate(d)
            .then((data) => setShifts(Array.isArray(data) ? data : []))
            .catch((e)   => setError(e.message))
            .finally(()  => setLoading(false));
    };

    useEffect(() => { load(date); }, [date]);

    return (
        <div style={{ fontFamily: "'Plus Jakarta Sans','DM Sans',sans-serif" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: 0 }}>Attendance</h1>
                    <p style={{ color: "#6b7280", fontSize: 14, margin: "4px 0 0" }}>Select a shift to mark or view staff attendance.</p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 600 }}>Date:</span>
                    <input
                        type="date" value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    <button
                        onClick={() => setDate(todayDate())}
                        className="px-3 py-2 rounded-lg text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 transition-colors"
                    >
                        Today
                    </button>
                    <button
                        onClick={() => load(date)}
                        className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 transition-colors"
                    >
                        ↺ Refresh
                    </button>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div style={{ padding: "12px 16px", borderRadius: 10, marginBottom: 16, background: "#fef2f2", border: "1px solid #fca5a5", color: "#b91c1c", fontSize: 13 }}>
                    ⚠ {error}
                </div>
            )}

            {/* Content */}
            {loading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 72, gap: 10, color: "#9ca3af", fontSize: 14 }}>
                    <svg style={{ animation: "spin 1s linear infinite", width: 20, height: 20 }} viewBox="0 0 24 24" fill="none">
                        <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
                        <circle cx="12" cy="12" r="10" stroke="#e5e7eb" strokeWidth="3"/>
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="#f97316" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    Loading shifts…
                </div>
            ) : shifts.length === 0 ? (
                <div style={{ textAlign: "center", padding: 72 }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#6b7280" }}>No shifts found for {date}</div>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                    {shifts.map((shift, i) => (
                        <div key={shift.id} style={{ animation: `fadeIn .25s ease ${i * 55}ms both` }}>
                            <style>{"@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}"}</style>
                            <ShiftCard shift={shift} onClick={() => navigate(`/attendance/${shift.id}`)}/>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}