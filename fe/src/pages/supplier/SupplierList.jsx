import { useState } from 'react';
import { Link } from 'react-router-dom';
// Đã xóa Trash2 khỏi thư viện import
import { Search, Plus, Filter, MoreHorizontal, Edit } from 'lucide-react';

export default function SupplierList() {
    const [suppliers] = useState([
        { id: 'SUP-0128', name: 'Fresh Farms Inc.', contact: 'john@freshfarms.com', region: 'North', status: 'Pending', performance: 'N/A' },
        { id: 'SUP-0127', name: 'TechEquip Supplies', contact: 'sales@techequip.com', region: 'Global', status: 'Approved', performance: '98%' },
        { id: 'SUP-0126', name: 'Green Packaging', contact: 'hello@greenpack.co', region: 'East', status: 'Approved', performance: '95%' },
        { id: 'SUP-0125', name: 'Quality Beans LLC', contact: 'orders@qualitybeans.com', region: 'South', status: 'Suspended', performance: '60%' },
        { id: 'SUP-0124', name: 'City Roasters', contact: 'supply@cityroasters.net', region: 'West', status: 'Approved', performance: '92%' },
    ]);

    return (
        <div className="space-y-6">

            {/* Header Khu vực */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Suppliers</h1>
                    <p className="mt-1 text-gray-600">Manage your supplier directory and statuses.</p>
                </div>
                <Link
                    to="/suppliers/create"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                    <Plus className="h-4 w-4" />
                    Add Supplier
                </Link>
            </div>

            {/* Khung chứa Bảng (Table Container) */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                {/* Thanh công cụ (Toolbar) */}
                <div className="flex flex-col items-center justify-between gap-4 border-b border-gray-200 p-4 sm:flex-row">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search suppliers by name, ID, or region..."
                            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto">
                        <Filter className="h-4 w-4" />
                        Filters
                    </button>
                </div>

                {/* Phần Bảng Dữ Liệu (Table) */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="border-b border-gray-200 bg-gray-50/50 text-gray-500">
                        <tr>
                            <th className="px-6 py-4 font-medium">Supplier</th>
                            <th className="px-6 py-4 font-medium">Contact</th>
                            <th className="px-6 py-4 font-medium">Region</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Performance</th>
                            <th className="px-6 py-4 text-right font-medium">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {suppliers.map((supplier) => (
                            <tr key={supplier.id} className="transition-colors hover:bg-gray-50/50">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{supplier.name}</div>
                                    <div className="text-xs text-gray-500">{supplier.id}</div>
                                </td>
                                <td className="px-6 py-4">{supplier.contact}</td>
                                <td className="px-6 py-4">{supplier.region}</td>
                                <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                supplier.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                    supplier.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-red-100 text-red-700'
                                            }`}
                                        >
                                            {supplier.status}
                                        </span>
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">{supplier.performance}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {/* Đổi thành thẻ Link và gắn route Update */}
                                        <Link
                                            to={`/suppliers/update/${supplier.id}`}
                                            className="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                                            title="Edit Supplier"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Link>

                                        {/* Đổi thành thẻ Link và gắn route Detail */}
                                        <Link
                                            to={`/suppliers/${supplier.id}`}
                                            className="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                                            title="View Details"
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang (Pagination) */}
                <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
                    <span className="text-sm text-gray-500">
                        Showing <span className="font-medium text-gray-900">1</span> to <span className="font-medium text-gray-900">5</span> of <span className="font-medium text-gray-900">128</span> results
                    </span>
                    <div className="flex gap-2">
                        <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50">
                            Previous
                        </button>
                        <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}