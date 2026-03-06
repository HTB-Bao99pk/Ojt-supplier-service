const BASE_URL = "http://localhost:8081";

// BIẾN GIẢ LẬP: ID chi nhánh của người đang đăng nhập
const CURRENT_BRANCH_ID = "BR-001";

export const getAllStaffs = async (page = 0, size = 10) => {
    // Ép thêm branchId vào query param để BE biết đường lọc
    const res = await fetch(`${BASE_URL}/staffs?page=${page}&size=${size}&branchId=${CURRENT_BRANCH_ID}`);
    const data = await res.json();
    return data.result;
};

export const createStaff = async (dataBody) => {
    // Ép luôn dữ liệu branchId gửi xuống là của chi nhánh hiện tại
    const payload = { ...dataBody, branchId: CURRENT_BRANCH_ID };

    const res = await fetch(`${BASE_URL}/staffs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to create staff");
    return data.result;
};

export const updateStaff = async (id, dataBody) => {
    const payload = { ...dataBody, branchId: CURRENT_BRANCH_ID };

    const res = await fetch(`${BASE_URL}/staffs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update staff");
    return data.result;
};

export const deleteStaff = async (id) => {
    const res = await fetch(`${BASE_URL}/staffs/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete staff");
    return true;
};