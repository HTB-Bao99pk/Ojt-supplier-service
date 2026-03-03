import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Edit, Building2, Mail, Phone, MapPin,
  FileText, Activity, Calendar, Package, Filter
} from 'lucide-react';
import { getSupplierById, getProductsBySupplierId } from '../../api/supplierApi'; // IMPORT THÊM HÀM MỚI

export default function SupplierDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    // State cho Supplier
    const [supplier, setSupplier] = useState(null);
    const [loading, setLoading] = useState(true);

    // State cho Products
    const [products, setProducts] = useState([]);
    const [productLoading, setProductLoading] = useState(false);
    
    // State cho Filter
    const [filterActive, setFilterActive] = useState(""); // "" là tất cả, "true" là đang bán, "false" là ngừng bán

    useEffect(() => {
        const fetchSupplierAndProducts = async () => {
            try {
                // Lấy thông tin chi tiết supplier
                const supplierData = await getSupplierById(id);
                setSupplier(supplierData);
                
                // Lấy danh sách sản phẩm của supplier đó
                fetchProducts({ page: 0, size: 10, isActive: filterActive });
            } catch (err) {
                console.error('Fetch data failed:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSupplierAndProducts();
    }, [id]);

    // Hàm gọi API lấy product (Tách riêng để dễ gọi lại khi đổi Filter)
    const fetchProducts = async (params) => {
        setProductLoading(true);
        try {
            const data = await getProductsBySupplierId(id, params);
            setProducts(data.content || []); // Spring Boot phân trang sẽ trả data trong mảng content
        } catch (error) {
            console.error('Fetch products failed:', error);
        } finally {
            setProductLoading(false);
        }
    };

    // Xử lý khi thay đổi bộ lọc trạng thái
    const handleFilterChange = (e) => {
        const val = e.target.value;
        setFilterActive(val);
        fetchProducts({ 
            page: 0, size: 10, 
            isActive: val === "" ? null : val === "true" 
        });
    };

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

            {/* PHẦN HEADER CŨ GIỮ NGUYÊN */}
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

            {/* PHẦN GRID THÔNG TIN CŨ GIỮ NGUYÊN */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
               {/* ... (Đoạn mã Contact Information và Overview của bạn) ... */}
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

            {/* PHẦN MỚI: DANH SÁCH SẢN PHẨM CỦA NHÀ CUNG CẤP */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-gray-500" />
                        <h3 className="text-lg font-medium text-gray-900">Product Quotations</h3>
                    </div>
                    
                    {/* BỘ LỌC STATUS */}
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-gray-400" />
                        <select 
                            value={filterActive}
                            onChange={handleFilterChange}
                            className="rounded-lg border-gray-300 bg-gray-50 p-2 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">All Status</option>
                            <option value="true">Active (Đang bán)</option>
                            <option value="false">Inactive (Ngừng bán)</option>
                        </select>
                    </div>
                </div>

                {productLoading ? (
                    <div className="py-8 text-center text-sm text-gray-500">Loading products...</div>
                ) : products.length === 0 ? (
                    <div className="py-8 text-center text-sm text-gray-500">No products assigned to this supplier yet.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Product ID</th>
                                    <th className="px-4 py-3 font-medium">Price (VND)</th>
                                    <th className="px-4 py-3 font-medium">Delivery Time</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-900">{
                                            <Link 
                                                to={`/suppliers/compare/${item.productId}`} 
                                                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                                                title="Click to compare all suppliers for this product"
                                            >
                                                {item.productId}
                                                <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] uppercase text-blue-600">Compare</span>
                                            </Link>
                                        }</td>
                                        <td className="px-4 py-3">
                                            {item.price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price) : 'Contact'}
                                        </td>
                                        <td className="px-4 py-3">{item.deliveryDateTimes} days</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {item.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>
    );
}