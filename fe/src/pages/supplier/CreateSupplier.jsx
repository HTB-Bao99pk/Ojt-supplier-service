import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  Factory,
} from "lucide-react";
import { createSupplier } from "../../api/supplierApi";
import { useAuth } from "../../context/AuthContext";

export default function CreateSupplier() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [fieldErrors, setFieldErrors] = useState({
    contactEmail: "",
    name: "",
    taxCode: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    contactEmail: "",
    phone: "",
    region: "Asia",
    taxCode: "",
    address: "",
    materialType: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    try {
      await createSupplier(formData, currentUser);
      alert("Supplier created successfully!");
      navigate("/suppliers");
    } catch (err) {
      if (err.errors && typeof err.errors === "object") {
        setFieldErrors(err.errors);
      } else {
        alert("System error: " + err.message);
      }
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header: Nút Back và Tiêu đề */}
      <div className="flex items-center gap-4">
        <Link
          to="/suppliers"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Supplier</h1>
          <p className="mt-1 text-sm text-gray-600">
            Enter the details of the new supply chain partner.
          </p>
        </div>
      </div>

      {/* Khung Form Container */}
      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
      >
        <div className="space-y-8 p-6 sm:p-8">
          {/* Phần 1: Thông tin cơ bản */}
          <div>
            <h3 className="mb-4 border-b border-gray-100 pb-2 text-lg font-medium text-gray-900">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Company Name (Chiếm trọn 2 cột) */}
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Company Name *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Fresh Farms Inc."
                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                {fieldErrors.name && (
                  <p className="mt-1 text-xs text-red-500">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="contactEmail"
                    required
                    value={formData.contactEmail}
                    onChange={handleChange}
                    placeholder="contact@company.com"
                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                {fieldErrors.contactEmail && (
                  <p className="mt-1 text-xs text-red-500">
                    {fieldErrors.contactEmail}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+1 (555) 000-0000"
                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Supplier Type *
                </label>
                <div className="relative">
                  <Factory className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="materialType"
                    required
                    value={formData.materialType}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Phần 2: Khu vực và Pháp lý */}
          <div>
            <h3 className="mb-4 border-b border-gray-100 pb-2 text-lg font-medium text-gray-900">
              Location & Legal
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Region Select */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Operating Region
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-8 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="ASIA">Asia</option>
                    <option value="EUROPE">Europe</option>
                    <option value="NORTH_AMERICA">North America</option>
                    <option value="SOUTH_AMERICA">South America</option>
                    <option value="AFRICA">Africa</option>
                    <option value="OCEANIA">Oceania</option>
                  </select>
                </div>
              </div>

              {/* Tax ID */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Tax ID / Registration No.
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="taxCode"
                    value={formData.taxCode}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 12-3456789"
                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                {fieldErrors.taxCode && (
                  <p className="mt-1 text-xs text-red-500">
                    {fieldErrors.taxCode}
                  </p>
                )}
              </div>

              {/* Full Address (Textarea) */}
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Full Address
                </label>
                <textarea
                  name="address"
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Enter complete address..."
                  className="w-full rounded-lg border border-gray-300 p-4 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Footer: Nút Hành động */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50/80 px-6 py-4">
          <button
            type="button"
            onClick={() => navigate("/suppliers")}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Save className="h-4 w-4" />
            Save Supplier
          </button>
        </div>
      </form>
    </div>
  );
}
