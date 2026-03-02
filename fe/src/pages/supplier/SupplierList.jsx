import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, CheckCircle, Ban } from 'lucide-react';
import { getAllSuppliers, toggleSuspend } from '../../api/supplierApi';
import { useAuth } from '../../context/AuthContext';

export default function SupplierList() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return <div className="p-10 text-gray-500">Loading suppliers...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="min-w-full border-collapse">
                    <thead className="bg-gray-50 text-left text-sm font-semibold text-gray-600">
                        <tr>
                            <th className="px-5 py-3">Name</th>
                            <th className="px-5 py-3">Email</th>
                            <th className="px-5 py-3">Region</th>
                            <th className="px-5 py-3">Material</th>
                            <th className="px-5 py-3">Status</th>
                            <th className="px-5 py-3 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {suppliers.map((s) => (
                            <tr key={s.id} className="hover:bg-gray-50">
                                <td className="px-5 py-3 font-medium">{s.name}</td>
                                <td className="px-5 py-3 text-sm text-gray-600">{s.contactEmail}</td>
                                <td className="px-5 py-3 text-sm">{s.region || '-'}</td>
                                <td className="px-5 py-3 text-sm">{s.materialType || '-'}</td>
                                <td className="px-5 py-3">{renderStatusBadge(s.status)}</td>

                                <td className="px-5 py-3">
                                    <div className="flex justify-end gap-2">

                                        <button
                                            onClick={() => navigate(`/suppliers/${s.id}`)}
                                            className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-100"
                                        >
                                            <Eye className="h-4 w-4" />
                                            Detail
                                        </button>

                                        {(s.status === 'PENDING' || s.status === 'SUSPENDED') && (
                                            <button
                                                onClick={() => handleToggleStatus(s.id)}
                                                className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
                                            >
                                                <CheckCircle className="h-4 w-4" />
                                                Approve
                                            </button>
                                        )}

                                        {s.status === 'APPROVED' && (
                                            <button
                                                onClick={() => handleToggleStatus(s.id)}
                                                className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
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
        </div>
    );
}