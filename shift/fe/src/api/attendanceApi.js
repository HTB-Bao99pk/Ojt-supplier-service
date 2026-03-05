const BASE_URL   = "http://localhost:8081";
const MANAGER_ID = "manager-001";

/* =========================
   FETCH WRAPPER
========================= */

async function http(path, options = {}) {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: {
            "Content-Type": "application/json",
            "X-User-Id": MANAGER_ID,
            "USER": MANAGER_ID,
            ...options.headers,
        },
        ...options,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
    return data.result ?? data;
}

/* =========================
   SHIFT
========================= */

// GET /shifts?date=YYYY-MM-DD
export async function fetchShiftsByDate(date) {
    return http(`/shifts?date=${date}`);
}

/* =========================
   STAFF
========================= */

// GET /shifts/{shiftId}/staff
export async function fetchStaffByShift(shiftId) {
    return http(`/shifts/${shiftId}/staff`);
}

/* =========================
   ATTENDANCE
   Tất cả dùng /shifts/... (khớp với AttendanceController đã sửa)
========================= */

// GET /shifts/{shiftId}/attendance
export async function fetchAttendanceByShift(shiftId) {
    return http(`/shifts/${shiftId}/attendance`);
}

// POST /shifts/{shiftId}/attendance/bulk
export async function bulkMarkAttendance(shiftId, attendances) {
    return http(`/shifts/${shiftId}/attendance/bulk`, {
        method: "POST",
        body: JSON.stringify({ attendances }),
    });
}

// PATCH /shifts/{shiftId}/attendance/{attendanceId}
export async function updateAttendance(shiftId, attendanceId, staffId, status, note) {
    return http(`/shifts/${shiftId}/attendance/${attendanceId}`, {
        method: "PATCH",
        body: JSON.stringify({ staffId, status, note }),
    });
}

/* =========================
   UTILS
========================= */

export function todayDate() {
    return new Date().toISOString().slice(0, 10);
}