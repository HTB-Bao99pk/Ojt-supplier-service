import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Search, Mail, Phone, MapPin, RefreshCw, UserPlus } from "lucide-react";
import { getAllStaffs, deleteStaff } from "../../api/staffApi";

export default function StaffList() {
    const navigate = useNavigate();
    const [staffs, setStaffs] = useState([]);
    const [filteredStaffs, setFilteredStaffs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchStaffs = async () => {
        setLoading(true);
        try {
            const data = await getAllStaffs();
            const list = data?.content || (Array.isArray(data) ? data : []);
            setStaffs(list);
        } catch (error) {
            console.error("Error fetching staffs:", error);
            setStaffs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStaffs(); }, []);

    useEffect(() => {
        let result = staffs;
        if (searchTerm) {
            const term = searchTerm.toLowerCase().trim();
            result = result.filter(s => {
                const staffCode = (s.staffCode || "").toLowerCase();
                const staffName = (s.name || "").toLowerCase();
                return staffCode.includes(term) || staffName.includes(term);
            });
        }
        setFilteredStaffs(result);
    }, [searchTerm, staffs]);

    const handleDelete = async (id, name) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa nhân viên ${name} không?`)) {
            try {
                await deleteStaff(id);
                alert("Xóa nhân viên thành công!");
                fetchStaffs();
            } catch (error) {
                alert("Lỗi khi xóa nhân viên: " + (error.response?.data?.message || error.message));
            }
        }
    };

    const renderStatusBadge = (status) => {
        if (!status) return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold border bg-gray-100 text-gray-600 border-gray-200">UNKNOWN</span>;
        if (status === "ACTIVE") return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold border bg-green-100 text-green-700 border-green-200">Active</span>;
        if (status === "INACTIVE") return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold border bg-red-100 text-red-700 border-red-200">Inactive</span>;
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold border bg-blue-100 text-blue-700 border-blue-200">{status}</span>;
    };

    // Hàm render Giới tính bằng Icon cho đẹp
    const renderGender = (gender) => {
        if (gender === "MALE") return <span className="text-blue-600 font-medium text-xs bg-blue-50 px-2 py-0.5 rounded border border-blue-100">Nam</span>;
        if (gender === "FEMALE") return <span className="text-pink-600 font-medium text-xs bg-pink-50 px-2 py-0.5 rounded border border-pink-100">Nữ</span>;
        return <span className="text-gray-500 font-medium text-xs bg-gray-100 px-2 py-0.5 rounded border border-gray-200">Khác</span>;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Staff Management</h1>
                <button onClick={() => navigate("/staff/create")} className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 flex items-center gap-2 shadow-sm transition-colors font-bold text-sm">
                    <UserPlus className="h-4 w-4" /> Create New Staff
                </button>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap gap-4 items-end justify-between">
                <div className="flex-1 min-w-[250px] max-w-md">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Search Staff</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Nhập Tên hoặc Mã NV (VD: NVA-8A15B)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                        />
                    </div>
                </div>

                <button onClick={fetchStaffs} className="px-4 py-2 flex items-center gap-2 rounded-lg text-sm font-bold border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 transition-colors shadow-sm">
                    <RefreshCw size={16} className={loading ? "animate-spin text-amber-500" : ""} /> Refresh
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[300px] relative">
                {loading && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                        <RefreshCw size={28} className="animate-spin text-amber-500 mb-3" />
                        <span className="text-sm font-bold text-gray-600">Đang tải dữ liệu nhân viên...</span>
                    </div>
                )}

                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b">
                    <tr>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Staff ID</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Employee</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Branch</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {!loading && filteredStaffs.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="px-6 py-16 text-center text-gray-500">
                                <div className="flex flex-col items-center gap-2">
                                    <Search size={40} className="text-gray-300" />
                                    <p className="font-medium">Không tìm thấy nhân viên nào phù hợp.</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        filteredStaffs.map((staff) => (
                            <tr key={staff.id} className="hover:bg-amber-50/30 transition-colors">
                                <td className="px-6 py-4">
                                    <span className="text-sm font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                                        {staff.staffCode || "ĐANG TẠO..."}
                                    </span>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-900 text-sm flex items-center gap-2">
                                        {staff.name || "Chưa cập nhật tên"}
                                        {renderGender(staff.gender)}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                                        <Mail className="h-3 w-3" /> {staff.email || "—"}
                                    </div>
                                </td>

                                <td className="px-6 py-4 text-sm font-medium text-gray-600">
                                    <div className="flex items-center gap-1.5">
                                        <Phone className="h-3.5 w-3.5 text-gray-400" /> {staff.phone || "—"}
                                    </div>
                                </td>

                                <td className="px-6 py-4 text-sm font-medium text-gray-600">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="h-3.5 w-3.5 text-gray-400" /> {staff.branchId || "—"}
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    {renderStatusBadge(staff.status)}
                                </td>

                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => navigate(`/staff/update/${staff.id}`)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Chỉnh sửa">
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => handleDelete(staff.id, staff.name)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors" title="Xóa nhân viên">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}