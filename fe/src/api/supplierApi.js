const BASE_URL = "http://localhost:8080";

/* =========================
   GET ALL (pagination)
========================= */
export const getAllSuppliers = async (page = 0, size = 10) => {
    const res = await fetch(
        `${BASE_URL}/suppliers?page=${page}&size=${size}`
    );

    if (!res.ok) throw new Error("Unable to fetch supplier list.");

    const data = await res.json();
    return data.result;
};

/* =========================
   FILTER (quan trọng nhất)
========================= */
export const filterSuppliers = async (params) => {
    const query = new URLSearchParams();

    Object.keys(params).forEach((key) => {
        if (
            params[key] !== "" &&
            params[key] !== null &&
            params[key] !== undefined
        ) {
            query.append(key, params[key]);
        }
    });

    const res = await fetch(
        `${BASE_URL}/suppliers/filter?${query.toString()}`
    );

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Filter failed.");
    }

    const data = await res.json();
    return data.result; // Page object
};

/* =========================
   GET BY ID
========================= */
export const getSupplierById = async (id) => {
    const res = await fetch(`${BASE_URL}/suppliers/${id}`);

    if (!res.ok) throw new Error("Unable to fetch supplier details.");

    const data = await res.json();
    return data.result;
};

/* =========================
   UPDATE
========================= */
export const updateSupplier = async (id, dataBody, user) => {
    const res = await fetch(`${BASE_URL}/suppliers/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            USER: user,
        },
        body: JSON.stringify(dataBody),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Update failed.");
    }

    const data = await res.json();
    return data.result;
};

/* =========================
   TOGGLE SUSPEND
========================= */
export const toggleSuspend = async (id, user) => {
    const res = await fetch(
        `${BASE_URL}/suppliers/${id}/toggle-suspend`,
        {
            method: "PATCH",
            headers: { USER: user },
        }
    );

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Operation failed.");
    }

    const data = await res.json();
    return data.result;
};

/* =========================
   CREATE
========================= */
export const createSupplier = async (dataBody, user) => {
    const res = await fetch(`${BASE_URL}/suppliers`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            USER: user,
        },
        body: JSON.stringify(dataBody),
    });

    const data = await res.json();

    if (!res.ok) {
        const error = new Error(data.message || "Create failed");
        error.errors = data.result; 
        throw error;
    }

    return data.result;
};

/* =========================
   APPROVE
========================= */
export const approveSupplier = async (id, user) => {
    const res = await fetch(
        `${BASE_URL}/suppliers/${id}/approve`,
        {
            method: "PUT",
            headers: { USER: user },
        }
    );

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Approval failed.");
    }

    const data = await res.json();
    return data.result;
};
export const getProductsBySupplierId = async (supplierId, params = { page: 0, size: 10 }) => {
    const query = new URLSearchParams();

    Object.keys(params).forEach((key) => {
        if (params[key] !== "" && params[key] !== null && params[key] !== undefined) {
            query.append(key, params[key]);
        }
    });

    const res = await fetch(`${BASE_URL}/suppliers/${supplierId}/products?${query.toString()}`);

    if (!res.ok) throw new Error("Unable to fetch supplier products.");

    const data = await res.json();
    return data.result; // Backend trả về đối tượng Page chứa content và metadata phân trang
};