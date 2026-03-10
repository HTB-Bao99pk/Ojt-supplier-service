const BASE_URL = "http://localhost:8081";

async function http(path, options = {}) {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: { "Content-Type": "application/json", ...options.headers },
        ...options,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
    return data.result ?? data;
}

export const getSchedulesByStaff = (staffId) => http(`/api/staff/${staffId}/schedules`);
