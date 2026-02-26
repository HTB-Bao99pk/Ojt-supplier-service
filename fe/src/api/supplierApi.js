const BASE_URL = "http://localhost:8080";

export const getAllSuppliers = async () => {
  const res = await fetch(`${BASE_URL}/v1/suppliers`);
  if (!res.ok) throw new Error("Unable to fetch supplier list.");
  return res.json();
};

export const getSupplierById = async (id) => {
  const res = await fetch(`${BASE_URL}/v1/suppliers/${id}`);
  if (!res.ok) throw new Error("Unable to fetch supplier details.");
  return res.json();
};

export const updateSupplier = async (id, data, user) => {
  const res = await fetch(`${BASE_URL}/v1/suppliers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", USER: user },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Update failed.");
  return res.json();
};

export const toggleSuspend = async (id, user) => {
  const res = await fetch(`${BASE_URL}/v1/suppliers/${id}/toggle-suspend`, {
    method: "PATCH",
    headers: { USER: user },
  });
  if (!res.ok) throw new Error("Operation failed.");
  return res.json();
};