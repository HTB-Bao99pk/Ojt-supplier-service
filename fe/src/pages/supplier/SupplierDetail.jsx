import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Edit, Building2, Mail, Phone, MapPin,
  FileText, Activity, Calendar
} from 'lucide-react';
import { getSupplierById } from '../../api/supplierApi';

export default function SupplierDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [supplier, setSupplier] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSupplier = async () => {
            try {
                const data = await getSupplierById(id);
                setSupplier(data);
            } catch (err) {
                console.error('Fetch supplier detail failed:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSupplier();
    }, [id]);

    if (loading) {
        return <div className="p-10 text-gray-500">Loading supplier detail...</div>;
    }

    if (!supplier) {
        return <div className="p-10 text-red-500">Supplier not found</div>;
    }

    const renderStatus = (status) => {
        if (status === 'APPROVED') return 'bg-green-100 text-green-700';
        if (status === 'PENDING') return 'bg-amber-100 text-amber-700';
        if (status === 'SUSPENDED') return 'bg-red-100 text-red-700';
        return 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="max-w-5xl space-y-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        to="/suppliers"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition-colors hover:bg-gray-50"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>

                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900">{supplier.name}</h1>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${renderStatus(supplier.status)}`}>
                                {supplier.status}
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">Supplier ID: {supplier.id}</p>
                    </div>
                </div>

                <button
                    onClick={() => navigate(`/suppliers/update/${supplier.id}`)}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 shadow-sm"
                >
                    <Edit className="h-4 w-4" />
                    Edit Supplier
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                <div className="col-span-1 space-y-6 md:col-span-2">
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-medium text-gray-900">Contact Information</h3>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="flex items-start gap-3">
                                <Mail className="mt-0.5 h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Email</p>
                                    <p className="mt-1 text-sm text-gray-900">{supplier.contactEmail}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Phone className="mt-0.5 h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Phone</p>
                                    <p className="mt-1 text-sm text-gray-900">{supplier.phone || '-'}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 sm:col-span-2">
                                <MapPin className="mt-0.5 h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Address</p>
                                    <p className="mt-1 text-sm text-gray-900">{supplier.address || '-'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-1 space-y-6">
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-medium text-gray-900">Overview</h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Building2 className="h-4 w-4" /> Region
                                </div>
                                <span className="text-sm font-medium text-gray-900">{supplier.region || '-'}</span>
                            </div>

                            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <FileText className="h-4 w-4" /> Tax Code
                                </div>
                                <span className="text-sm font-medium text-gray-900">{supplier.taxCode || '-'}</span>
                            </div>

                            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Activity className="h-4 w-4" /> Material
                                </div>
                                <span className="text-sm font-medium text-gray-900">{supplier.materialType || '-'}</span>
                            </div>

                            <div className="flex items-center justify-between pb-1">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Calendar className="h-4 w-4" /> Joined
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                                    {supplier.createAt ? new Date(supplier.createAt).toLocaleDateString() : '-'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}