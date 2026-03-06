// src/pages/staff/CreateStaff.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { createStaff } from "../../api/staffApi";

// BIẾN GIẢ LẬP: Mặc định là chi nhánh này
const CURRENT_BRANCH_ID = "BR-001";

export default function CreateStaff() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        branchId: CURRENT_BRANCH_ID, // Gán sẵn giá trị
        dateOfBirth: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await createStaff(formData);
            alert("Staff created successfully!");
            navigate("/staff"); // Nhớ cấu hình route cho đúng nhé (ở bản trước bạn để /staffs hay /staff?)
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <ArrowLeft size={20} className="text-gray-600"/>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Add New Staff</h1>
                    <p className="text-sm text-gray-500">Thêm nhân viên mới vào chi nhánh của bạn.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                {error && <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg text-sm font-medium">{error}</div>}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <UserPlus className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                        <input
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="Nguyen Van A"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                            <input
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="abc@gmail.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                            <input
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="09xxxxxxxx"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    {/* Ô BRANCH ĐÃ BỊ KHÓA */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                            <select
                                name="branchId"
                                value={CURRENT_BRANCH_ID} // Khóa giá trị ở đây
                                disabled                  // Chặn click
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none bg-gray-100 text-gray-500 cursor-not-allowed font-medium"
                            >
                                <option value="BR-001">Ho Chi Minh Branch (BR-001)</option>
                                <option value="BR-002">Da Nang Branch (BR-002)</option>
                                <option value="BR-003">Hanoi Branch (BR-003)</option>
                            </select>
                        </div>
                        <p className="text-[11px] text-amber-600 mt-1.5 font-medium flex items-center">
                            * Tự động nhận diện chi nhánh theo tài khoản quản lý.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                            <input
                                name="dateOfBirth"
                                type="date"
                                required
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
                    >
                        {loading ? "Processing..." : "Save Staff"}
                    </button>
                </div>
            </form>
        </div>
    );
}