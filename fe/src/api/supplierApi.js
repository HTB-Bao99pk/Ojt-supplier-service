const BASE_URL = "http://localhost:8080";

export const getAllSuppliers = async (page = 0, size = 10) => {
    const res = await fetch(`${BASE_URL}/suppliers?page=${page}&size=${size}`);
    if (!res.ok) throw new Error("Unable to fetch supplier list.");

    const data = await res.json();
    return data.result; // because BE wraps with ApiResponse
};

export const getSupplierById = async (id) => {
    const res = await fetch(`${BASE_URL}/suppliers/${id}`);
    if (!res.ok) throw new Error("Unable to fetch supplier details.");

    const data = await res.json();
    return data.result;
};

export const updateSupplier = async (id, dataBody, user) => {
    const res = await fetch(`${BASE_URL}/suppliers/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            USER: user,
        },
        body: JSON.stringify(dataBody),
    });

    if (!res.ok) throw new Error("Update failed.");

    const data = await res.json();
    return data.result;
};

export const toggleSuspend = async (id, user) => {
    const res = await fetch(`${BASE_URL}/suppliers/${id}/toggle-suspend`, {
        method: "PATCH",
        headers: { USER: user },
    });

    if (!res.ok) throw new Error("Operation failed.");

    const data = await res.json();
    return data.result;
};

export const createSupplier = async (dataBody, user) => {
    const res = await fetch(`${BASE_URL}/suppliers`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            USER: user,
        },
        body: JSON.stringify(dataBody),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Create failed.");
    }

    const data = await res.json();
    return data.result;
};
