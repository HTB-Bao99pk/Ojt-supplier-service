import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarPlus, Clock, MapPin } from "lucide-react";
import { getShiftById, updateShift } from "../../api/shiftApi";


const CURRENT_BRANCH_ID = "BR-001";
const CURRENT_BRANCH_NAME = "Ho Chi Minh Central";

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
        branchId: CURRENT_BRANCH_ID
    });

    const shortenId = (uuid) => {
        if (!uuid) return "";
        return uuid.length > 8 ? `SH-${uuid.substring(0, 5).toUpperCase()}` : uuid;
    };

    const formatTimeForInput = (time) => {
        if (!time) return "";
        if (typeof time === "string") return time.substring(0, 5);
        if (Array.isArray(time)) return `${String(time[0]).padStart(2, '0')}:${String(time[1] || 0).padStart(2, '0')}`;
        return "";
    };

    useEffect(() => {
        const fetchShift = async () => {
            try {
                const data = await getShiftById(id);
                setFormData({
                    date: data.date,
                    startTime: formatTimeForInput(data.startTime),
                    endTime: formatTimeForInput(data.endTime),
                    branchId: CURRENT_BRANCH_ID // Always force to fixed branch
                });
            } catch (err) {
                console.error("Error loading shift data:", err);
                setError("Could not load shift data.");
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

        if (formData.startTime >= formData.endTime) {
            setError("End Time must be after Start Time!");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await updateShift(id, {
                date: formData.date,
                startTime: formData.startTime.length === 5 ? formData.startTime + ":00" : formData.startTime,
                endTime: formData.endTime.length === 5 ? formData.endTime + ":00" : formData.endTime,
                branchId: CURRENT_BRANCH_ID // Ensure payload sent is always the fixed branch
            });
            alert("Shift updated successfully!");
            navigate("/shifts");
        } catch (err) {
            alert("Error updating: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return <div className="p-10 text-center text-gray-500">Loading shift data...</div>;

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
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        Update Shift <span className="text-amber-600">{shortenId(id)}</span>
                    </h1>
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
                                {/* Thêm màu cho icon */}
                                <CalendarPlus className="h-5 w-5 text-blue-500" />
                            </div>
                            <input
                                type="date"
                                name="date"
                                required
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Time Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Start Time <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    {/* Thêm màu cho icon */}
                                    <Clock className="h-5 w-5 text-emerald-500" />
                                </div>
                                <input
                                    type="time"
                                    name="startTime"
                                    required
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">End Time <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    {/* Thêm màu cho icon */}
                                    <Clock className="h-5 w-5 text-rose-500" />
                                </div>
                                <input
                                    type="time"
                                    name="endTime"
                                    required
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Branch - Fix cứng và thay select bằng thẻ input readOnly */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                {/* Add color to icon */}
                                <MapPin className="h-5 w-5 text-amber-500" />
                            </div>
                            <input
                                type="text"
                                value={`${CURRENT_BRANCH_NAME} (${CURRENT_BRANCH_ID})`}
                                readOnly
                                disabled
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 cursor-not-allowed focus:outline-none"
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1.5 ml-1">* Branch is locked for Franchise Manager account</p>
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