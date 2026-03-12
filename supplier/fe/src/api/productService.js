const BASE_URL = "https://supplier-service-7qc3.onrender.com";

// 1. LẤY DANH SÁCH SẢN PHẨM (Map với @GetMapping("/products/search"))
export const getProducts = async (params = {}) => {
    const query = new URLSearchParams();
    Object.keys(params).forEach((key) => {
        if (params[key] !== "" && params[key] !== null && params[key] !== undefined) {
            query.append(key, params[key]);
        }
    });

    // Sửa đường dẫn khớp với Controller
    const res = await fetch(`${BASE_URL}/suppliers/products/search?${query.toString()}`);
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Unable to fetch products.");
    }

    const data = await res.json();
    return data.result; // Page object
};

// 2. LẤY CHI TIẾT SẢN PHẨM
export const getProductById = async (id) => {
    // LƯU Ý: Backend không có @GetMapping("/products/{id}"). 
    // Nên giải pháp tạm thời là gọi API search và lọc theo productId, sau đó lấy phần tử đầu tiên.
    const res = await fetch(`${BASE_URL}/suppliers/products/search?productId=${id}`);
    if (!res.ok) throw new Error("Unable to fetch product.");
    const data = await res.json();
    
    // API search trả về Page, nên ta lấy item đầu tiên trong mảng content
    return data.result?.content?.length > 0 ? data.result.content[0] : null;
};

// 3. CẬP NHẬT TRẠNG THÁI / THÔNG TIN SẢN PHẨM (Map với @PatchMapping("/{supplierId}/products/{productId}"))
// CẦN BỔ SUNG supplierId VÀO THAM SỐ VÌ BACKEND YÊU CẦU
export const toggleProductStatus = async (supplierId, productId, body = {}) => {
    const res = await fetch(`${BASE_URL}/suppliers/${supplierId}/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        // body truyền lên isActive: false/true tuỳ vào phía component gọi hàm
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Unable to update status.");
    }
    const data = await res.json();
    return data.result;
};

// 4. CẬP NHẬT THÔNG TIN SẢN PHẨM
export const updateProduct = async (supplierId, productId, updateData) => {
    const res = await fetch(`${BASE_URL}/suppliers/${supplierId}/products/${productId}`, {
        method: "PATCH", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Không thể cập nhật sản phẩm.");
    }
    const data = await res.json();
    return data.result;
};