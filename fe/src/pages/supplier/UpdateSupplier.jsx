import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSupplierById, updateSupplier } from "../../api/supplierApi";
import { useAuth } from "../../context/AuthContext";
import "./UpdateSupplier.css";

export default function UpdateSupplier() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [form, setForm]       = useState({
    name: "", materialType: "", taxCode: "", contactEmail: "", phone: "", address: "", region: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const data = await getSupplierById(id);
        setForm({
          name:         data.name         || "",
          materialType: data.materialType || "",
          taxCode:      data.taxCode      || "",
          contactEmail: data.contactEmail || "",
          phone:        data.phone        || "",
          address:      data.address      || "",
          region:       data.region       || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSupplier();
  }, [id]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await updateSupplier(id, form, currentUser);
      navigate("/suppliers");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { name: "name",         label: "Supplier Name", type: "text"  },
    { name: "materialType", label: "Material Type", type: "text"  },
    { name: "taxCode",      label: "Tax Code",      type: "text"  },
    { name: "contactEmail", label: "Email",          type: "email" },
    { name: "phone",        label: "Phone",          type: "text"  },
    { name: "address",      label: "Address",        type: "text"  },
    { name: "region",       label: "Region",         type: "text"  },
  ];

  if (loading) return (
    <div className="update-supplier__spinner">
      <div className="update-supplier__spinner-circle" />
    </div>
  );

  return (
    <div className="update-supplier">
      <div className="update-supplier__card">
        <div className="update-supplier__card-header">
          <button
            className="update-supplier__back"
            onClick={() => navigate("/suppliers")}
          >
            ← Back
          </button>
          <h1 className="update-supplier__title">Update Supplier</h1>
        </div>
        <p className="update-supplier__subtitle">Make changes and save</p>
        {error && <div className="update-supplier__error">{error}</div>}

        <form className="update-supplier__form" onSubmit={handleSubmit}>
          {fields.map(({ name, label, type }) => (
            <div key={name} className="update-supplier__field">
              <label>{label}</label>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={`Enter ${label.toLowerCase()}`}
              />
            </div>
          ))}

          <hr className="update-supplier__divider" />

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
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}