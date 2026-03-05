import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarPlus, Clock, MapPin } from "lucide-react";
import { getShiftById, updateShift } from "../../api/shiftApi";

export default function UpdateShift() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        date: "",
        startTime: "",
        endTime: "",
        branchId: ""
    });

    // Tải dữ liệu cũ lên form
    useEffect(() => {
        const fetchShift = async () => {
            try {
                const data = await getShiftById(id);
                setFormData({
                    date: data.date,
                    startTime: data.startTime.substring(0, 5), // Bỏ phần giây (VD: 08:00:00 -> 08:00)
                    endTime: data.endTime.substring(0, 5),
                    branchId: data.branchId
                });
            } catch (err) {
                console.log("Dùng dữ liệu giả vì API GET chưa có");
                // Mock data dự phòng
                setFormData({
                    date: "2026-03-10",
                    startTime: "08:00",
                    endTime: "12:00",
                    branchId: "BR-001"
                });
            } finally {
                setInitialLoading(false);
            }
        };
        fetchShift();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await updateShift(id, {
                date: formData.date,
                startTime: formData.startTime + ":00",
                endTime: formData.endTime + ":00",
                branchId: formData.branchId
            });
            alert("Shift updated successfully!");
            navigate("/shifts");
        } catch (err) {
            alert("Đã gửi API PUT/Update. Sẽ chạy thật khi BE làm xong!");
            navigate("/shifts");
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return <div className="p-10 text-center">Loading shift data...</div>;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Update Shift {id}</h1>
                    <p className="text-sm text-gray-500">Modify the schedule for this shift.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {error && <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Shift Date <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <CalendarPlus className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="date"
                                name="date"
                                required
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Time Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Start Time <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Clock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="time"
                                    name="startTime"
                                    required
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">End Time <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Clock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="time"
                                    name="endTime"
                                    required
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Branch */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Branch <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MapPin className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                                name="branchId"
                                value={formData.branchId}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none bg-white"
                            >
                                <option value="BR-001">BR-001 (Ho Chi Minh Central)</option>
                                <option value="BR-002">BR-002 (Da Nang Branch)</option>
                                <option value="BR-003">BR-003 (Ha Noi Branch)</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                        <button type="button" onClick={() => navigate(-1)} className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="px-5 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors">
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}