import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSupplier } from "../../api/supplierApi";
import { useAuth } from "../../context/AuthContext";
import "./UpdateSupplier.css";

export default function CreateSupplier() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [form, setForm] = useState({
    name: "",
    contactEmail: "",
    phone: "",
    address: "",
    taxCode: "",
    materialType: "",
    region: "",
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState(null);

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Supplier name is required.";
    if (!form.materialType.trim()) newErrors.materialType = "Material type is required.";
    if (!form.phone.trim()) newErrors.phone = "Phone is required.";
    if (!form.address.trim()) newErrors.address = "Address is required.";
    if (!form.taxCode.trim()) newErrors.taxCode = "Tax Code is required.";
    if (!form.region.trim()) newErrors.region = "Region is required.";

    if (!form.contactEmail.trim()) {
      newErrors.contactEmail = "Email is required.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.contactEmail)) {
        newErrors.contactEmail = "Invalid email format.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) return;

    try {
      setSaving(true);
      await createSupplier(form, currentUser);
      navigate("/suppliers");
    } catch (err) {
      if (err.response?.data?.message?.includes("Tax Code")) {
        setErrors((prev) => ({
          ...prev,
          taxCode: "Tax Code already exists.",
        }));
      } else {
        setApiError(err.message || "Something went wrong.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="update-supplier">
      <div className="update-supplier__card">
        <h1 className="update-supplier__title">Create New Supplier</h1>

        {apiError && (
          <div className="update-supplier__error">{apiError}</div>
        )}

        <form className="update-supplier__form" onSubmit={handleSubmit}>
          
          {/* Supplier Name */}
          <div className="update-supplier__field">
            <label>Supplier Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          {/* Material Type */}
          <div className="update-supplier__field">
            <label>Material Type *</label>
            <input
              name="materialType"
              value={form.materialType}
              onChange={handleChange}
            />
            {errors.materialType && <p className="error-text">{errors.materialType}</p>}
          </div>

          {/* Tax Code */}
          <div className="update-supplier__field">
            <label>Tax Code *</label>
            <input
              name="taxCode"
              value={form.taxCode}
              onChange={handleChange}
            />
            {errors.taxCode && <p className="error-text">{errors.taxCode}</p>}
          </div>

          {/* Email */}
          <div className="update-supplier__field">
            <label>Contact Email *</label>
            <input
              name="contactEmail"
              type="email"
              value={form.contactEmail}
              onChange={handleChange}
            />
            {errors.contactEmail && <p className="error-text">{errors.contactEmail}</p>}
          </div>

          {/* Phone */}
          <div className="update-supplier__field">
            <label>Phone *</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
            {errors.phone && <p className="error-text">{errors.phone}</p>}
          </div>

          {/* Address */}
          <div className="update-supplier__field">
            <label>Address *</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
            />
            {errors.address && <p className="error-text">{errors.address}</p>}
          </div>

          {/* Region (optional) */}
          <div className="update-supplier__field">
            <label>Region *</label>
            <input
              name="region"
              value={form.region}
              onChange={handleChange}
            />
            {errors.region && <p className="error-text">{errors.region}</p>}
          </div>

          <div className="update-supplier__actions">
            <button
              type="button"
              className="update-supplier__btn-cancel"
              onClick={() => navigate("/suppliers")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="update-supplier__btn-save"
              disabled={saving}
            >
              {saving ? "Creating..." : "Create Supplier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}