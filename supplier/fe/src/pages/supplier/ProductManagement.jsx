import { useEffect, useState, useCallback } from "react";
import { Eye, CheckCircle, Ban } from "lucide-react";
import { getProducts } from "../../api/productService";

export default function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const defaultFilters = {
        productId: "",
        // Keep only required filters
        minPrice: "",
        maxPrice: "",
        deliveryDateTimes: "",
        isActive: "",
        sort: "createAt,desc",
    };

    const [filters, setFilters] = useState(defaultFilters);

    // Small helper to format price
    const formatPrice = (value) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value || 0);

    const loadProducts = useCallback(async (pageNumber = 0) => {
        try {
            setLoading(true);
            const params = {
                // Only send allowed filter params
                productId: filters.productId,
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
                deliveryDateTimes: filters.deliveryDateTimes,
                isActive: filters.isActive,
                page: pageNumber,
                size: 5,
            };

            const result = await getProducts(params);
            setProducts(result?.content || []);
            setTotalPages(result?.totalPages || 0);
            setPage(pageNumber);
        } catch (err) {
            console.error(err);
            setProducts([]);
            setTotalPages(0);
            setPage(0);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        loadProducts(0);
    }, [loadProducts]);

    const handleSearch = () => {
        loadProducts(0);
    };

    const handleReset = () => {
        // Reset only the filter fields requested
        setFilters({ ...filters, minPrice: "", maxPrice: "", deliveryDateTimes: "", isActive: "" });
        loadProducts(0);
    };

    return (
        <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold">Product Management</h1>
            </div>

            {/* Search */}
            <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl shadow-sm border border-blue-200 mt-4">
                <input
                    type="text"
                    value={filters.productId || ""}
                    onChange={(e) => setFilters({ ...filters, productId: e.target.value })}
                    placeholder="Search by productId or supplierId..."
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500"
                />
                <button onClick={handleSearch} className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white">Search</button>
            </div>

            {/* Filters (refactored) */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-center">
                    <input
                        type="number"
                        placeholder="Min Price"
                        value={filters.minPrice}
                        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                        className="h-10 px-3 rounded-lg border border-gray-300 text-sm outline-none"
                    />

                    <input
                        type="number"
                        placeholder="Max Price"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                        className="h-10 px-3 rounded-lg border border-gray-300 text-sm outline-none"
                    />

                    <input
                        type="number"
                        placeholder="Delivery Days"
                        value={filters.deliveryDateTimes}
                        onChange={(e) => setFilters({ ...filters, deliveryDateTimes: e.target.value })}
                        className="h-10 px-3 rounded-lg border border-gray-300 text-sm outline-none"
                    />

                    <select
                        value={filters.isActive}
                        onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
                        className="h-10 px-3 rounded-lg border border-gray-300 text-sm outline-none bg-white"
                    >
                        <option value="">All</option>
                        <option value={true}>Active</option>
                        <option value={false}>Inactive</option>
                    </select>

                    {/* Buttons: on md+ screens occupy the 5th column to stay on the same row */}
                    <div className="md:col-span-1 sm:col-span-1 col-span-1 flex justify-end gap-2">
                        <button onClick={handleSearch} className="rounded-lg bg-blue-600 px-5 py-2 text-sm text-white">Search</button>
                        <button onClick={handleReset} className="rounded-lg border border-gray-300 px-5 py-2 text-sm text-gray-700">Reset</button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm mt-4">
                <div className="overflow-x-auto">
                    <table className="min-w-full whitespace-nowrap">
                        <thead className="bg-gray-50 text-sm font-semibold text-gray-600 border-b border-gray-200">
                        <tr>
                            <th className="px-5 py-3 text-left">ProductId</th>
                            <th className="px-5 py-3 text-left">SupplierId</th>
                            <th className="px-5 py-3 text-left">Price</th>
                            <th className="px-5 py-3 text-left">Delivery Date Times</th>
                            <th className="px-5 py-3 text-left">Status</th>
                            <th className="px-5 py-3 text-right">Actions</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-gray-500">Loading...</td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-gray-500">No products found</td>
                                </tr>
                            ) : (
                                products.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-3 font-medium text-gray-900">{p.productId}</td>
                                        <td className="px-5 py-3 text-gray-600">{p.supplierId}</td>
                                        <td className="px-5 py-3 text-gray-600">{formatPrice(p.price)}</td>
                                        <td className="px-5 py-3 text-gray-600">{p.deliveryDateTimes ?? "-"}</td>
                                        <td className="px-5 py-3">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                p.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>{p.isActive ? 'Active' : 'Inactive'}</span>
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1 text-sm text-gray-700">
                                                    <Eye className="w-4 h-4" /> Detail
                                                </button>
                                                <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1 text-sm text-gray-700">
                                                    <Eye className="w-4 h-4" /> Edit
                                                </button>
                                                <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1 text-sm text-gray-700">
                                                    {p.isActive ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />} {p.isActive ? 'Disable' : 'Enable'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between gap-3 p-4">
                    <div></div>
                    <div className="flex items-center gap-3">
                        <button
                            disabled={page === 0}
                            onClick={() => { if (page > 0) { loadProducts(page - 1); } }}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700"
                        >
                            Previous
                        </button>

                        <span className="text-sm font-medium text-gray-600">Page {totalPages === 0 ? 0 : page + 1} / {totalPages}</span>

                        <button
                            disabled={page + 1 >= totalPages || totalPages === 0}
                            onClick={() => { if (page + 1 < totalPages) { loadProducts(page + 1); } }}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
