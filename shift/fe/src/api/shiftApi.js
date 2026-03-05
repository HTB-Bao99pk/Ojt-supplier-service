const BASE_URL = "http://localhost:8081"; // Trỏ đúng vào Backend Shift

export const createShift = async (dataBody, user = "admin_01") => {
    const res = await fetch(`${BASE_URL}/shifts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "USER": user,
        },
        body: JSON.stringify(dataBody),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Failed to create shift");
    }

    return data.result;
};