const BASE_URL = "http://localhost:8081";

// 1. CREATE
export const createShift = async (dataBody, user = "admin_01") => {
    const res = await fetch(`${BASE_URL}/shifts`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "USER": user },
        body: JSON.stringify(dataBody),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to create shift");
    return data.result;
};

// 2. GET ALL (Cập nhật để hỗ trợ phân trang từ BE)
export const getAllShifts = async (page = 0, size = 10) => {
    const res = await fetch(`${BASE_URL}/shifts?page=${page}&size=${size}`);
    if (!res.ok) throw new Error("Failed to fetch shifts");
    const data = await res.json();
    // Vì Backend trả về Page object, chúng ta lấy field 'result'
    return data.result;
};

// 3. GET BY ID
export const getShiftById = async (id) => {
    const res = await fetch(`${BASE_URL}/shifts/${id}`);
    if (!res.ok) throw new Error("Failed to fetch shift details");
    const data = await res.json();
    return data.result;
};

// 4. UPDATE
export const updateShift = async (id, dataBody, user = "admin_01") => {
    const res = await fetch(`${BASE_URL}/shifts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "USER": user },
        body: JSON.stringify(dataBody),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update shift");
    return data.result;
};

// 5. DELETE (Hàm bổ sung để sửa lỗi Uncaught SyntaxError)
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