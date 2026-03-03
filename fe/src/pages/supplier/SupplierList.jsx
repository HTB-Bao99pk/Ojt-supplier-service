import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, CheckCircle, Ban, Plus } from "lucide-react";
import {
  getAllSuppliers,
  filterSuppliers,
  toggleSuspend,
  approveSupplier,
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

      const result = await getAllSuppliers(
        pageNumber,
        5,
        filters.sort, // gửi sort khi load all
      );

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
        sort: filters.sort,
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

  /* ================= SORT CHANGE ================= */
  const handleSortChange = async (value) => {
    const updatedFilters = { ...filters, sort: value };
    setFilters(updatedFilters);
    setPage(0);

    if (isSearching) {
      await loadFilteredSuppliers(0);
    } else {
      await loadAllSuppliers(0);
    }
  };

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

  const handleApprove = async (id) => {
    try {
      await approveSupplier(id, currentUser);
      refreshList();
    } catch (error) {
      alert(error.message || "Approval failed");
    }
  };

  const handleSuspend = async (id) => {
    try {
      await toggleSuspend(id, currentUser);
      refreshList();
    } catch (error) {
      alert(error.message || "Operation failed");
    }
  };

  const refreshList = () => {
    if (isSearching) {
      loadFilteredSuppliers(page);
    } else {
      loadAllSuppliers(page);
    }
  };
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
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Supplier
        </button>
      </div>

      {/* ================= FILTER ================= */}
      <div className="grid grid-cols-6 gap-4 bg-white p-4 rounded-xl shadow border">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">All Status</option>
          <option value="PENDING">PENDING</option>
          <option value="APPROVED">APPROVED</option>
          <option value="SUSPENDED">SUSPENDED</option>
        </select>

        <select
          value={filters.region}
          onChange={(e) => setFilters({ ...filters, region: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">All Region</option>
          <option value="ASIA">Asia</option>
          <option value="EUROPE">Europe</option>
          <option value="NORTH_AMERICA">North America</option>
          <option value="SOUTH_AMERICA">South America</option>
          <option value="AFRICA">Africa</option>
          <option value="OCEANIA">Oceania</option>
        </select>

        <input
          type="number"
          placeholder="Min rating"
          value={filters.minRating}
          onChange={(e) =>
            setFilters({ ...filters, minRating: e.target.value })
          }
          className="border p-2 rounded"
        />

        <input
          type="datetime-local"
          value={filters.updatedAfter}
          onChange={(e) =>
            setFilters({ ...filters, updatedAfter: e.target.value })
          }
          className="border p-2 rounded"
        />

        {/* SORTING */}
        <select
          value={filters.sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="updateAt,desc">Updated ↓</option>
          <option value="updateAt,asc">Updated ↑</option>
          <option value="rating,desc">Rating ↓</option>
          <option value="rating,asc">Rating ↑</option>
        </select>

        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 rounded"
          >
            Search
          </button>

          <button onClick={handleReset} className="border px-4 rounded">
            Reset
          </button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="min-w-full">
          <thead className="bg-gray-50 text-sm font-semibold text-gray-600">
            <tr>
              <th className="px-5 py-3 text-left">Name</th>
              <th className="px-5 py-3 text-left">Email</th>
              <th className="px-5 py-3 text-left">Region</th>
              <th className="px-5 py-3 text-left">Rating</th>
              <th className="px-5 py-3 text-left">Updated</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">
                  No suppliers found
                </td>
              </tr>
            ) : (
              suppliers.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">{s.name}</td>
                  <td className="px-5 py-3">{s.contactEmail}</td>
                  <td className="px-5 py-3">{s.region || "-"}</td>
                  <td className="px-5 py-3">{s.rating}</td>
                  <td className="px-5 py-3">{formatDateTime(s.updateAt)}</td>
                  <td className="px-5 py-3">{s.status}</td>

                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => navigate(`/suppliers/${s.id}`)}
                        className="border px-3 py-1.5 text-xs rounded"
                      >
                        <Eye className="h-4 w-4 inline mr-1" />
                        Detail
                      </button>

                      {(s.status === "PENDING" || s.status === "SUSPENDED") && (
                        <button
                          onClick={() => handleApprove(s.id)}
                          className="bg-green-600 text-white px-3 py-1.5 text-xs rounded flex items-center gap-1"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Approve
                        </button>
                      )}

                      {s.status === "APPROVED" && (
                        <button
                          onClick={() => handleSuspend(s.id)}
                          className="bg-red-600 text-white px-3 py-1.5 text-xs rounded flex items-center gap-1"
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
