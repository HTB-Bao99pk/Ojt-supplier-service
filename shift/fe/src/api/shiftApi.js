const BASE_URL = "http://localhost:8081";

// BIẾN GIẢ LẬP: ID chi nhánh của người đang đăng nhập
const CURRENT_BRANCH_ID = "BR-001";

export const getAllShifts = async (page = 0, size = 10) => {
    // Ép thêm branchId vào query để Backend lọc (khi BE đã sẵn sàng)
    const res = await fetch(`${BASE_URL}/shifts?page=${page}&size=${size}&branchId=${CURRENT_BRANCH_ID}`);
    if (!res.ok) throw new Error("Failed to fetch shifts");
    const data = await res.json();
    return data.result;
};

export const getShiftById = async (id) => {
    const res = await fetch(`${BASE_URL}/shifts/${id}`);
    if (!res.ok) throw new Error("Failed to fetch shift details");
    const data = await res.json();
    return data.result;
};

export const createShift = async (dataBody, user = "admin_01") => {
    // Ép dữ liệu gửi xuống Backend phải là chi nhánh này
    const payload = { ...dataBody, branchId: CURRENT_BRANCH_ID };

    const res = await fetch(`${BASE_URL}/shifts`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "USER": user },
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to create shift");
    return data.result;
};

export const updateShift = async (id, dataBody, user = "admin_01") => {
    const payload = { ...dataBody, branchId: CURRENT_BRANCH_ID };

    const res = await fetch(`${BASE_URL}/shifts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "USER": user },
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update shift");
    return data.result;
};

export const deleteShift = async (id) => {
    const res = await fetch(`${BASE_URL}/shifts/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete shift");
    }
    return true;
};


export const getShiftsByDate = async (date) => {
    const res = await fetch(`${BASE_URL}/shifts?date=${date}`);
    if (!res.ok) {
        throw new Error("Failed to fetch shifts for date");
    }
    const data = await res.json();
    return data.result;
};