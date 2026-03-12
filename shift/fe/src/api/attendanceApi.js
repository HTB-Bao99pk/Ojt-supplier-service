const BASE_URL   = "http://localhost:8081";
const MANAGER_ID = "admin_01"; // Synchronized with USER header on backend

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
   ATTENDANCE & ASSIGNMENT
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

// NEW FUNCTION: Assign staff to shift
export async function assignStaffToShift(shiftId, staffId) {
    return http(`/shifts/${shiftId}/assign`, {
        method: "POST",
        body: JSON.stringify({ staffId }),
    });
}

/* =========================
   UTILS
========================= */

export function todayDate() {
    return new Date().toISOString().slice(0, 10);
}

export const getAttendanceReport = async (month, year) => {
    const queryParams = new URLSearchParams();
    if (month) queryParams.append('month', parseInt(month, 10));
    if (year) queryParams.append('year', parseInt(year, 10));

    // Dùng http() thay vì fetch() để có Header
    return http(`/attendance-reports?${queryParams.toString()}`);
};

export const getDashboardOverview = async (date) => {
    return http(`/attendance-reports/dashboard?date=${date}`);
};

export const getStaffAttendanceHistory = async (staffId, month, year, date) => {
    const queryParams = new URLSearchParams();

    if (month) queryParams.append('month', parseInt(month, 10));
    if (year) queryParams.append('year', parseInt(year, 10));
    if (date) queryParams.append('exactDate', date);

    return http(`/attendance-reports/staff/${staffId}?${queryParams.toString()}`);
};