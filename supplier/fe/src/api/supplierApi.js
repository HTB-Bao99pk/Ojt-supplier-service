const BASE_URL = "https://supplier-service-7qc3.onrender.com";

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
   SEARCH BY KEYWORD
========================= */
export const searchSuppliersByKeyword = async (keyword, page = 0, size = 10) => {
    const res = await fetch(
        `${BASE_URL}/suppliers/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`
    );

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Search failed.");
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
   APPROVE, REJECT
========================= */
export const reviewSupplier = async (id, status, user, reason = "") => {
    const res = await fetch(
        `${BASE_URL}/suppliers/${id}/review?status=${status}&reason=${encodeURIComponent(reason)}`,
        {
            method: "PATCH",
            headers: { USER: user },
        }
    );

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Review failed.");
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

/* =========================
   COMPARE SUPPLIERS BY PRODUCT
========================= */
export const compareSuppliers = async (productId) => {
    const res = await fetch(`${BASE_URL}/suppliers/products/${productId}/compare`);

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Unable to fetch comparison data.");
    }

    const data = await res.json();
    return data.result;
};

/* =========================
   UPDATE SUPPLIER PRODUCT
========================= */
export const updateSupplierProduct = async (supplierId, productId, dataBody) => {
    const res = await fetch(`${BASE_URL}/suppliers/${supplierId}/products/${productId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            // Giả sử bạn dùng header USER để ghi log như các hàm khác
            USER: "admin_user",
        },
        body: JSON.stringify(dataBody),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Update product failed.");
    }

    const data = await res.json();
    return data.result;
};

/* =========================
   GET APPROVED SUPPLIERS
========================= */
export const getApprovedSuppliers = async (page = 0, size = 10) => {
    const res = await fetch(`${BASE_URL}/suppliers/approved?page=${page}&size=${size}`);

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Unable to fetch approved suppliers.");
    }

    const data = await res.json();
    return data.result; // Page object
};

export const getSupplierAuditLogs = async (supplierId, page = 0, size = 10) => {
    const res = await fetch(`${BASE_URL}/suppliers/${supplierId}/audit-logs?page=${page}&size=${size}`);
    if (!res.ok) throw new Error("Unable to fetch audit logs.");
    const data = await res.json();
    return data.result;

};

export const deleteSupplier = async (id, userName = "admin_user") => {
  const res = await fetch(`${BASE_URL}/suppliers/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "USER": userName, // Gửi tên người thực hiện để lưu Audit Log bên Backend
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Không thể xóa nhà cung cấp");
  }
  return res.json();
};
