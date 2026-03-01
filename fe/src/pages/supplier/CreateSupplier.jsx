// src/pages/supplier/CreateSupplier.jsx
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
    region: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await createSupplier(form, currentUser);
      navigate("/suppliers");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="update-supplier">
      <div className="update-supplier__card">
        <h1 className="update-supplier__title">Create New Supplier</h1>
        {error && <div className="update-supplier__error">{error}</div>}
        <form className="update-supplier__form" onSubmit={handleSubmit}>
          <div className="update-supplier__field">
            <label>Supplier Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="update-supplier__field">
            <label>Email</label>
            <input
              name="contactEmail"
              type="email"
              value={form.contactEmail}
              onChange={handleChange}
            />
          </div>
          <div className="update-supplier__field">
            <label>Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} />
          </div>
          <div className="update-supplier__field">
            <label>Address</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
            />
          </div>

          <div className="update-supplier__field">
            <label>Region</label>
            <input name="region" value={form.region} onChange={handleChange} />
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
