import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";
import { createShift } from "../../api/shiftApi";

const CURRENT_BRANCH_ID = "BR-001";

export default function CreateShift() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        date: "",
        startTime: "",
        endTime: "",
        branchId: CURRENT_BRANCH_ID, // Gán cứng
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Kiểm tra logic giờ
        if (formData.startTime >= formData.endTime) {
            setError("End time must be after start time!");
            setLoading(false);
            return;
        }

        try {
            await createShift(formData);
            alert("Shift created successfully!");
            navigate("/shifts");
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
                    <h1 className="text-2xl font-bold text-gray-900">Create New Shift</h1>
                    <p className="text-sm text-gray-500">Thêm ca làm việc cho chi nhánh của bạn.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                {error && <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg text-sm font-medium">{error}</div>}

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Work Date <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                            <input
                                name="date"
                                type="date"
                                required
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* KHÓA CỨNG BRANCH TẠI ĐÂY */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                            <select
                                name="branchId"
                                value={CURRENT_BRANCH_ID}
                                disabled
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none bg-gray-100 text-gray-500 cursor-not-allowed font-medium"
                            >
                                <option value="BR-001">Ho Chi Minh Central (BR-001)</option>
                                <option value="BR-002">Da Nang Branch (BR-002)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Time <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                            <input
                                name="startTime"
                                type="time"
                                required
                                value={formData.startTime}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Time <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                            <input
                                name="endTime"
                                type="time"
                                required
                                value={formData.endTime}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                    <button type="button" onClick={() => navigate(-1)} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} className="px-5 py-2.5 text-sm font-medium bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors">
                        {loading ? "Processing..." : "Save Shift"}
                    </button>
                </div>
            </form>
        </div>
    );
}