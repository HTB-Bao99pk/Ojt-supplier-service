import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllStaffs, deleteStaff } from "../../api/staffApi";
import { Edit, Trash2, UserPlus } from "lucide-react";

export default function StaffList() {
    const [staffs, setStaffs] = useState([]);
    const navigate = useNavigate(); // Initialize navigation hook

    const loadStaff = async () => {
        try {
            const data = await getAllStaffs();
            // Backend returns a Page object, the list is inside 'content'
            setStaffs(data?.content || (Array.isArray(data) ? data : []));
        } catch (error) {
            console.error("Error loading staff list:", error);
        }
    };

    useEffect(() => { loadStaff(); }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Delete this staff member?")) {
            try {
                await deleteStaff(id);
                loadStaff();
            } catch (error) {
                alert("Delete failed: " + error.message);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Staff Management</h1>

                {/* Navigate to create page */}
                <button
                    onClick={() => navigate("/staff/create")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
                >
                    <UserPlus size={18}/> Add Staff
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Branch</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {staffs.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                                    No staff data available.
                                </td>
                            </tr>
                        ) : (
                            staffs.map(s => (
                                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{s.name}</td>
                                    <td className="px-6 py-4 text-gray-500">{s.email}</td>
                                    <td className="px-6 py-4 text-gray-600">{s.branchId}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {/* Navigate to update page with staff ID */}
                                            <button
                                                onClick={() => navigate(`/staff/update/${s.id}`)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit size={16}/>
                                            </button>

                                            <button
                                                onClick={() => handleDelete(s.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16}/>
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