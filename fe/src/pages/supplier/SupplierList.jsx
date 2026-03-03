import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, CheckCircle, Ban } from "lucide-react";
import {
  getAllSuppliers,
  filterSuppliers,
  toggleSuspend,
} from "../../api/supplierApi";
import { useAuth } from "../../context/AuthContext";

export default function SupplierList() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const defaultFilters = {
    status: "",
    region: "",
    minRating: "",
    updatedAfter: "",
    sort: "updateAt,desc",
  };

  const [filters, setFilters] = useState(defaultFilters);

  /* ================= FORMAT DATE ================= */
  const formatDateTime = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* ================= LOAD ALL ================= */
  const loadAllSuppliers = async (pageNumber = page) => {
    try {
      setLoading(true);
      const result = await getAllSuppliers(pageNumber, 5);

      setSuppliers(result?.content || []);
      setTotalPages(result?.totalPages || 0);
    } catch (error) {
      console.error(error);
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD FILTER ================= */
  const loadFilteredSuppliers = async (pageNumber = page) => {
    try {
      setLoading(true);
      const result = await filterSuppliers({
        ...filters,
        page: pageNumber,
        size: 5,
      });

      setSuppliers(result?.content || []);
      setTotalPages(result?.totalPages || 0);
    } catch (error) {
      console.error(error);
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    loadAllSuppliers(0);
  }, []);

  /* ================= PAGE CHANGE ================= */
  useEffect(() => {
    if (page === 0) return;

    if (isSearching) {
      loadFilteredSuppliers(page);
    } else {
      loadAllSuppliers(page);
    }
  }, [page]);

  /* ================= SEARCH ================= */
  const handleSearch = async () => {
    setIsSearching(true);
    setPage(0);
    await loadFilteredSuppliers(0);
  };

  /* ================= RESET ================= */
  const handleReset = async () => {
    setFilters(defaultFilters);
    setIsSearching(false);
    setPage(0);
    await loadAllSuppliers(0);
  };

  /* ================= TOGGLE STATUS ================= */
  const handleToggleStatus = async (id) => {
    try {
      await toggleSuspend(id, currentUser);

      if (isSearching) {
        loadFilteredSuppliers(page);
      } else {
        loadAllSuppliers(page);
      }
    } catch (error) {
      alert(error.message || "Operation failed");
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return <div className="p-10 text-gray-500">Loading suppliers...</div>;
  }

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Suppliers</h1>

        <button
          onClick={() => navigate("/suppliers/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Create Supplier
        </button>
      </div>

      {/* ================= FILTER SECTION ================= */}
      <div className="grid grid-cols-6 gap-4 bg-white p-4 rounded-xl shadow border">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Status</label>
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value })
            }
            className="border p-2 rounded"
          >
            <option value="">All</option>
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="SUSPENDED">SUSPENDED</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Region</label>
          <select
            value={filters.region}
            onChange={(e) =>
              setFilters({ ...filters, region: e.target.value })
            }
            className="border p-2 rounded"
          >
            <option value="">All</option>
            <option value="South">South</option>
            <option value="North">North</option>
            <option value="East">East</option>
            <option value="West">West</option>
            <option value="Global">Global</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Minimum Rating</label>
          <input
            type="number"
            placeholder="e.g. 4"
            value={filters.minRating}
            onChange={(e) =>
              setFilters({ ...filters, minRating: e.target.value })
            }
            className="border p-2 rounded"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Updated After</label>
          <input
            type="datetime-local"
            value={filters.updatedAfter}
            onChange={(e) =>
              setFilters({ ...filters, updatedAfter: e.target.value })
            }
            className="border p-2 rounded"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Sort By</label>
          <select
            value={filters.sort}
            onChange={(e) =>
              setFilters({ ...filters, sort: e.target.value })
            }
            className="border p-2 rounded"
          >
            <option value="updateAt,desc">Updated ↓</option>
            <option value="updateAt,asc">Updated ↑</option>
            <option value="rating,desc">Rating ↓</option>
            <option value="rating,asc">Rating ↑</option>
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 h-10 rounded hover:bg-blue-700"
          >
            Search
          </button>

          <button
            onClick={handleReset}
            className="border px-4 h-10 rounded hover:bg-gray-100"
          >
            Reset
          </button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50 text-left text-sm font-semibold text-gray-600">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Region</th>
              <th className="px-5 py-3">Rating</th>
              <th className="px-5 py-3">Updated At</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-5 py-10 text-center text-gray-500">
                  No suppliers found
                </td>
              </tr>
            ) : (
              suppliers.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium">{s.name}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">
                    {s.contactEmail}
                  </td>
                  <td className="px-5 py-3 text-sm">{s.region || "-"}</td>
                  <td className="px-5 py-3 text-sm">{s.rating}</td>
                  <td className="px-5 py-3 text-sm">
                    {formatDateTime(s.updateAt)}
                  </td>
                  <td className="px-5 py-3 text-sm">{s.status}</td>

                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => navigate(`/suppliers/${s.id}`)}
                        className="border px-3 py-1.5 text-xs rounded hover:bg-gray-100"
                      >
                        <Eye className="h-4 w-4 inline mr-1" />
                        Detail
                      </button>

                      {(s.status === "PENDING" ||
                        s.status === "SUSPENDED") && (
                        <button
                          onClick={() => handleToggleStatus(s.id)}
                          className="bg-green-600 text-white px-3 py-1.5 text-xs rounded hover:bg-green-700 flex items-center gap-1"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Approve
                        </button>
                      )}

                      {s.status === "APPROVED" && (
                        <button
                          onClick={() => handleToggleStatus(s.id)}
                          className="bg-red-600 text-white px-3 py-1.5 text-xs rounded hover:bg-red-700 flex items-center gap-1"
                        >
                          <Ban className="h-4 w-4" />
                          Suspend
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="flex justify-center gap-3">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="px-4 py-2">
          Page {page + 1} / {totalPages}
        </span>

        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}