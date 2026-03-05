// src/pages/staff/UpdateStaff.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { updateStaff, getAllStaffs } from "../../api/staffApi"; // Temporarily using getAllStaffs to filter if getById is not available

export default function UpdateStaff() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    branchId: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    const loadDetail = async () => {
      try {
        // Assume staffApi has getStaffById, otherwise get from the list
        const res = await getAllStaffs();
        const current = res.content.find((s) => s.id === id);
        if (current)
          setFormData({
            name: current.name,
            email: current.email,
            phone: current.phone,
            branchId: current.branchId,
            dateOfBirth: current.dateOfBirth,
          });
      } catch (err) {
        console.error(err);
      }
    };
    loadDetail();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateStaff(id, formData);
      alert("Update successful!");
      navigate("/staff");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Edit Staff: {formData.name}</h1>
      </div>

      {/* Form similar to CreateStaff but mapped with formData */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl border space-y-4"
      >
        <input
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full border p-2 rounded"
          placeholder="Name"
        />

        <input
          name="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full border p-2 rounded"
          placeholder="Phone Number"
        />

        <input
          name="email"
          value={formData.email}
          className="w-full border p-2 rounded bg-gray-100 text-gray-500 cursor-not-allowed"
          placeholder="Email"
          disabled
        />

        <input
          name="branchId"
          value={formData.branchId}
          onChange={(e) =>
            setFormData({ ...formData, branchId: e.target.value })
          }
          className="w-full border p-2 rounded"
          placeholder="Branch ID"
        />

        <input
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) =>
            setFormData({ ...formData, dateOfBirth: e.target.value })
          }
          className="w-full border p-2 rounded"
          placeholder="Date of Birth"
        />

        <button
          type="submit"
          className="w-full bg-amber-600 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Staff"}
        </button>
      </form>
    </div>
  );
}
