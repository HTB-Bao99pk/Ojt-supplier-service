const BASE_URL = "http://localhost:8081";

export const getAllStaffs = async (page = 0, size = 10) => {
    const res = await fetch(`${BASE_URL}/staffs?page=${page}&size=${size}`);
    const data = await res.json();
    return data.result;
};

export const createStaff = async (dataBody) => {
    const res = await fetch(`${BASE_URL}/staffs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataBody),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to create staff");
    return data.result;
};

export const updateStaff = async (id, dataBody) => {
    const res = await fetch(`${BASE_URL}/staffs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataBody),
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