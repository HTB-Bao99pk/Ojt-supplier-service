import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, CheckCircle, Ban, Plus } from 'lucide-react';
import { getAllSuppliers, toggleSuspend } from '../../api/supplierApi';
import { useAuth } from '../../context/AuthContext';

export default function SupplierList() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- State quản lý phân trang ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Bạn có thể đổi số này nếu muốn hiện nhiều dòng hơn

    const fetchSuppliers = async () => {
        try {
            const data = await getAllSuppliers();

            if (data?.content) {
                setSuppliers(data.content);
            }
            else if (Array.isArray(data)) {
                setSuppliers(data);
            }
            else {
                setSuppliers([]);
            }

        } catch (err) {
            console.error('Fetch suppliers failed:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handleToggleStatus = async (supplierId) => {
        try {
            await toggleSuspend(supplierId, currentUser);
            await fetchSuppliers();
        } catch (err) {
            alert(err?.response?.data?.message || 'Change status failed');
        }
    };

    const renderStatusBadge = (status) => {
        const base = 'px-3 py-1 rounded-full text-xs font-semibold';

        if (status === 'APPROVED') return <span className={`${base} bg-green-100 text-green-700`}>APPROVED</span>;
        if (status === 'PENDING') return <span className={`${base} bg-amber-100 text-amber-700`}>PENDING</span>;
        if (status === 'SUSPENDED') return <span className={`${base} bg-red-100 text-red-700`}>SUSPENDED</span>;

        return <span className={`${base} bg-gray-100 text-gray-600`}>{status}</span>;
    };

    // --- Xử lý cắt mảng dữ liệu cho trang hiện tại ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = suppliers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(suppliers.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    if (loading) {
        return <div className="p-10 text-gray-500">Loading suppliers...</div>;
    }

    return (
        <div className="space-y-6">

            {/* --- ĐÃ KHÔI PHỤC HEADER CÓ NÚT ADD SUPPLIER TẠI ĐÂY --- */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
                    <p className="mt-1 text-sm text-gray-600">Manage your supplier directory and statuses.</p>
                </div>
                <button
                    onClick={() => navigate('/suppliers/create')}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                    <Plus className="h-4 w-4" />
                    Add Supplier
                </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                        <thead className="bg-gray-50 text-left text-sm font-semibold text-gray-600">
                        <tr>
                            <th className="border-b border-gray-200 px-5 py-3">Name</th>
                            <th className="border-b border-gray-200 px-5 py-3">Email</th>
                            <th className="border-b border-gray-200 px-5 py-3">Region</th>
                            <th className="border-b border-gray-200 px-5 py-3">Material</th>
                            <th className="border-b border-gray-200 px-5 py-3">Status</th>
                            <th className="border-b border-gray-200 px-5 py-3 text-right">Actions</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                        {/* Hiển thị currentItems thay vì toàn bộ suppliers */}
                        {currentItems.map((s) => (
                            <tr key={s.id} className="transition-colors hover:bg-gray-50">
                                <td className="px-5 py-3 font-medium text-gray-900">{s.name}</td>
                                <td className="px-5 py-3 text-sm text-gray-600">{s.contactEmail}</td>
                                <td className="px-5 py-3 text-sm text-gray-600">{s.region || '-'}</td>
                                <td className="px-5 py-3 text-sm text-gray-600">{s.materialType || '-'}</td>
                                <td className="px-5 py-3">{renderStatusBadge(s.status)}</td>

                                <td className="px-5 py-3">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => navigate(`/suppliers/${s.id}`)}
                                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                        >
                                            <Eye className="h-4 w-4 text-gray-500" />
                                            Detail
                                        </button>

                                        {(s.status === 'PENDING' || s.status === 'SUSPENDED') && (
                                            <button
                                                onClick={() => handleToggleStatus(s.id)}
                                                className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-green-700"
                                            >
                                                <CheckCircle className="h-4 w-4" />
                                                Approve
                                            </button>
                                        )}

                                        {s.status === 'APPROVED' && (
                                            <button
                                                onClick={() => handleToggleStatus(s.id)}
                                                className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-red-700"
                                            >
                                                <Ban className="h-4 w-4" />
                                                Suspend
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {suppliers.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-5 py-10 text-center text-gray-500">
                                    No suppliers found
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* --- Thanh UI Phân trang chuẩn Figma --- */}
                {suppliers.length > 0 && (
                    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4">
                        <span className="text-sm text-gray-500">
                            Showing <span className="font-medium text-gray-900">{indexOfFirstItem + 1}</span> to{' '}
                            <span className="font-medium text-gray-900">
                                {Math.min(indexOfLastItem, suppliers.length)}
                            </span>{' '}
                            of <span className="font-medium text-gray-900">{suppliers.length}</span> results
                        </span>

                        <div className="flex gap-2">
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}