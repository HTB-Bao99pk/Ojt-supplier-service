const BASE_URL = "http://localhost:8081";
const CURRENT_BRANCH_ID = "BR-001";

async function http(path, options = {}) {
    const res  = await fetch(`${BASE_URL}${path}`, {
        headers: { "Content-Type": "application/json", ...options.headers },
        ...options,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
    return data.result ?? data;
}

export const getAllStaffs = (page = 0, size = 10) =>
    http(`/staffs?page=${page}&size=${size}&branchId=${CURRENT_BRANCH_ID}`);

export const getStaffById = (id) => http(`/staffs/${id}`);

export const createStaff = (payload) =>
    http("/staffs", {
        method: "POST",
        body: JSON.stringify({ ...payload, branchId: CURRENT_BRANCH_ID }),
    });

export const updateStaff = (id, payload) =>
    http(`/staffs/${id}`, {
        method: "PUT",
        body: JSON.stringify({ ...payload, branchId: CURRENT_BRANCH_ID }),
    });

// PATCH /staffs/{id}/status  →  { status: "ACTIVE" | "INACTIVE" }
export const updateStaffStatus = (id, status) =>
    http(`/staffs/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    });