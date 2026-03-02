import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Building2, Mail, Phone, MapPin, FileText, Activity, Calendar } from 'lucide-react';

export default function SupplierDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Giả lập dữ liệu chi tiết
    const supplier = {
        id: id || 'SUP-0128',
        name: 'Fresh Farms Inc.',
        email: 'john@freshfarms.com',
        phone: '+1 (555) 123-4567',
        region: 'North Region',
        taxId: 'TX-98765432',
        address: '123 Agri Lane, Farmville, FL 33000',
        status: 'Pending',
        joinedDate: 'Mar 02, 2026',
        performance: 'N/A'
    };

    return (
        <div className="max-w-5xl space-y-6">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/suppliers" className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition-colors hover:bg-gray-50">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900">{supplier.name}</h1>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                supplier.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                    supplier.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                            }`}>
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

            {/* Thông tin chi tiết */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                {/* Cột trái: Thông tin liên hệ */}
                <div className="col-span-1 space-y-6 md:col-span-2">
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-medium text-gray-900">Contact Information</h3>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="flex items-start gap-3">
                                <Mail className="mt-0.5 h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Email</p>
                                    <p className="mt-1 text-sm text-gray-900">{supplier.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="mt-0.5 h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Phone</p>
                                    <p className="mt-1 text-sm text-gray-900">{supplier.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 sm:col-span-2">
                                <MapPin className="mt-0.5 h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Address</p>
                                    <p className="mt-1 text-sm text-gray-900">{supplier.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cột phải: Tổng quan */}
                <div className="col-span-1 space-y-6">
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-medium text-gray-900">Overview</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                <div className="flex items-center gap-2 text-sm text-gray-500"><Building2 className="h-4 w-4" /> Region</div>
                                <span className="text-sm font-medium text-gray-900">{supplier.region}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                <div className="flex items-center gap-2 text-sm text-gray-500"><FileText className="h-4 w-4" /> Tax ID</div>
                                <span className="text-sm font-medium text-gray-900">{supplier.taxId}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                <div className="flex items-center gap-2 text-sm text-gray-500"><Activity className="h-4 w-4" /> Performance</div>
                                <span className="text-sm font-medium text-gray-900">{supplier.performance}</span>
                            </div>
                            <div className="flex items-center justify-between pb-1">
                                <div className="flex items-center gap-2 text-sm text-gray-500"><Calendar className="h-4 w-4" /> Joined</div>
                                <span className="text-sm font-medium text-gray-900">{supplier.joinedDate}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}