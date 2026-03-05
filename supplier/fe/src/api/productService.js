const BASE_URL = "http://localhost:8080";

export const getProducts = async (params = {}) => {
    const query = new URLSearchParams();
    Object.keys(params).forEach((key) => {
        if (params[key] !== "" && params[key] !== null && params[key] !== undefined) {
            query.append(key, params[key]);
        }
    });

    const res = await fetch(`${BASE_URL}/api/supplier-products?${query.toString()}`);
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Unable to fetch products.");
    }

    const data = await res.json();
    return data.result; // Page object
};

export const getProductById = async (id) => {
    const res = await fetch(`${BASE_URL}/api/supplier-products/${id}`);
    if (!res.ok) throw new Error("Unable to fetch product.");
    const data = await res.json();
    return data.result;
};

export const toggleProductStatus = async (id, body = {}) => {
    // Optional endpoint not yet implemented on backend; placeholder for PATCH /api/supplier-products/{id}/status
    const res = await fetch(`${BASE_URL}/api/supplier-products/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Unable to update status.");
    }
    const data = await res.json();
    return data.result;
};
