import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarPlus, Clock, MapPin, Layers, PlusCircle, Trash2, CalendarDays } from "lucide-react";
import { createShift } from "../../api/shiftApi";

export default function CreateShift() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [mode, setMode] = useState("single");

    // ================== STATE FOR CREATING 1 SHIFT ==================
    const [singleData, setSingleData] = useState({
        date: "",
        startTime: "",
        endTime: "",
        branchId: "BR-001" // Fixed
    });

    // ================== STATE FOR BULK CREATION ==================
    const [bulkData, setBulkData] = useState({
        startDate: "",
        endDate: "",
        branchId: "BR-001", // Fixed
        shifts: [
            { startTime: "07:00", endTime: "12:00" },
        ]
    });

    // --- Handle form for Single Creation ---
    const handleSingleChange = (e) => {
        setSingleData({ ...singleData, [e.target.name]: e.target.value });
    };

    const handleSingleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError(null);
        try {
            await createShift({
                date: singleData.date,
                startTime: singleData.startTime + ":00",
                endTime: singleData.endTime + ":00",
                branchId: "BR-001" // Force fixed when sending API for safety
            });
            alert("Shift created successfully!");
            navigate("/shifts");
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    // --- Handle form for Bulk Creation ---
    const handleBulkChange = (e) => {
        setBulkData({ ...bulkData, [e.target.name]: e.target.value });
    };

    const handleShiftTimeChange = (index, field, value) => {
        const newShifts = [...bulkData.shifts];
        newShifts[index][field] = value;
        setBulkData({ ...bulkData, shifts: newShifts });
    };

    const addShiftTime = () => {
        setBulkData({ ...bulkData, shifts: [...bulkData.shifts, { startTime: "", endTime: "" }] });
    };

    const removeShiftTime = (index) => {
        const newShifts = bulkData.shifts.filter((_, i) => i !== index);
        setBulkData({ ...bulkData, shifts: newShifts });
    };

    const getDatesBetween = (start, end) => {
        const dates = [];
        let curr = new Date(start);
        const endDate = new Date(end);
        while (curr <= endDate) {
            dates.push(curr.toISOString().split('T')[0]);
            curr.setDate(curr.getDate() + 1);
        }
        return dates;
    };

    const handleBulkSubmit = async (e) => {
        e.preventDefault();

        if (bulkData.shifts.length === 0) {
            return setError("Please add at least 1 time slot for the shift!");
        }
        if (new Date(bulkData.startDate) > new Date(bulkData.endDate)) {
            return setError("Start date cannot be greater than end date!");
        }

        setLoading(true); setError(null);
        try {
            const dates = getDatesBetween(bulkData.startDate, bulkData.endDate);
            const promises = [];

            for (const date of dates) {
                for (const shift of bulkData.shifts) {
                    if (shift.startTime && shift.endTime) {
                        promises.push(createShift({
                            date: date,
                            startTime: shift.startTime + ":00",
                            endTime: shift.endTime + ":00",
                            branchId: "BR-001" // Force fixed when sending bulk API
                        }));
                    }
                }
            }

            await Promise.all(promises);
            alert(`Successfully created ${promises.length} shifts!`);
            navigate("/shifts");
        } catch (err) {
            setError("Error occurred during bulk creation: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-10">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Create New Shift</h1>
                    <p className="text-sm text-gray-500">Create new work shifts for employees.</p>
                </div>
            </div>

            <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                    onClick={() => { setMode("single"); setError(null); }}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                        mode === "single" ? "bg-white text-amber-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    <CalendarPlus size={18} /> Create Single Shift
                </button>
                <button
                    onClick={() => { setMode("bulk"); setError(null); }}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                        mode === "bulk" ? "bg-white text-amber-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    <Layers size={18} /> Create Auto Schedule (Week/Month)
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {error && <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg font-medium">{error}</div>}

                {/* ======================= FORM CREATE SINGLE SHIFT ======================= */}
                {mode === "single" && (
                    <form onSubmit={handleSingleSubmit} className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Shift Date <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <CalendarPlus className="h-5 w-5 text-gray-400" />
                                </div>
                                <input type="date" name="date" required value={singleData.date} onChange={handleSingleChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Start Time <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Clock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input type="time" name="startTime" required value={singleData.startTime} onChange={handleSingleChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">End Time <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Clock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input type="time" name="endTime" required value={singleData.endTime} onChange={handleSingleChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Branch <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MapPin className="h-5 w-5 text-gray-400" />
                                </div>
                                {/* FIXED HARDCODED: Input field is read-only */}
                                <input
                                    type="text"
                                    value="BR-001 (Ho Chi Minh Central)"
                                    disabled
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed outline-none font-medium"
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                            <button type="submit" disabled={loading} className="px-6 py-2.5 text-sm font-bold text-white bg-amber-600 rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors w-full md:w-auto">
                                {loading ? "Creating..." : "Create Single Shift"}
                            </button>
                        </div>
                    </form>
                )}

                {/* ======================= FORM CREATE BULK ======================= */}
                {mode === "bulk" && (
                    <form onSubmit={handleBulkSubmit} className="space-y-6 animate-in fade-in zoom-in-95 duration-200">

                        <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-3">
                            <CalendarDays className="text-amber-600 mt-0.5 shrink-0" size={20} />
                            <p className="text-sm text-amber-800 leading-relaxed">
                                <b>Instructions:</b> Select time period (e.g., Monday to Sunday). Then set time slots for shifts each day (Morning, Afternoon...). The system will automatically duplicate the schedule for all days.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">From Date (Start Date) <span className="text-red-500">*</span></label>
                                <input type="date" name="startDate" required value={bulkData.startDate} onChange={handleBulkChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">To Date (End Date) <span className="text-red-500">*</span></label>
                                <input type="date" name="endDate" required value={bulkData.endDate} onChange={handleBulkChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Branch <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MapPin className="h-5 w-5 text-gray-400" />
                                </div>
                                {/* FIXED: Input is not editable */}
                                <input
                                    type="text"
                                    value="BR-001 (Ho Chi Minh Central)"
                                    disabled
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed outline-none font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-gray-700">Time Slots per Day (Shifts per day)</label>
                            {bulkData.shifts.map((shift, idx) => (
                                <div key={idx} className="flex flex-wrap md:flex-nowrap items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <div className="flex-1 min-w-[120px]">
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Start Time</label>
                                        <input type="time" required value={shift.startTime} onChange={(e) => handleShiftTimeChange(idx, "startTime", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-amber-500" />
                                    </div>
                                    <div className="flex-1 min-w-[120px]">
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">End Time</label>
                                        <input type="time" required value={shift.endTime} onChange={(e) => handleShiftTimeChange(idx, "endTime", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-amber-500" />
                                    </div>
                                    <div className="pt-5">
                                        <button type="button" onClick={() => removeShiftTime(idx)} disabled={bulkData.shifts.length === 1} className="p-2 text-red-500 hover:bg-red-100 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors" title="Remove this shift">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <button type="button" onClick={addShiftTime} className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-4 py-2 rounded-lg transition-colors">
                                <PlusCircle size={18} /> Add another shift in the day
                            </button>
                        </div>

                        <div className="pt-6 border-t border-gray-100 flex justify-end">
                            <button type="submit" disabled={loading} className="px-6 py-3 text-sm font-bold text-white bg-amber-600 rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors w-full md:w-auto shadow-md">
                                {loading ? "Creating bulk schedule..." : "Generate Bulk Shifts"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}