import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, CheckCircle, Ban, Plus, MoreVertical } from "lucide-react";
import {
  getAllSuppliers,
  filterSuppliers,
  toggleSuspend,
  reviewSupplier,
  searchSuppliersByKeyword,
} from "../../api/supplierApi";
import { useAuth } from "../../context/AuthContext";

export default function SupplierList() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [openDropdown, setOpenDropdown] = useState(null);

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [isKeywordSearching, setIsKeywordSearching] = useState(false);
  const [keyword, setKeyword] = useState("");

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

  /* ================= LOAD KEYWORD SEARCH ================= */
  const loadKeywordSearch = async (pageNumber = page) => {
    try {
      setLoading(true);

      const result = await searchSuppliersByKeyword(keyword, pageNumber, 5);

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

    if (isKeywordSearching) {
      loadKeywordSearch(page);
    } else if (isSearching) {
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
    setIsKeywordSearching(false);
    setPage(0);
    await loadFilteredSuppliers(0);
  };

  /* ================= KEYWORD SEARCH ================= */
  const handleKeywordSearch = async () => {
    if (!keyword.trim()) {
      alert("Please enter a keyword");
      return;
    }
    setIsKeywordSearching(true);
    setIsSearching(false);
    setPage(0);
    await loadKeywordSearch(0);
  };

  /* ================= RESET ================= */
  const handleReset = async () => {
    setFilters(defaultFilters);
    setIsSearching(false);
    setIsKeywordSearching(false);
    setKeyword("");
    setPage(0);
    await loadAllSuppliers(0);
  };

  const [confirmModal, setConfirmModal] = useState({
    open: false,
    action: null,
    message: "",
  });

  const [rejectModal, setRejectModal] = useState({
  open: false,
  supplierId: null,
  reason: "",
});

  const refreshList = () => {
    if (isKeywordSearching) {
      loadKeywordSearch(page);
    } else if (isSearching) {
      loadFilteredSuppliers(page);
    } else {
      loadAllSuppliers(page);
    }
  };

  if (loading && suppliers.length === 0) {
    return <div className="p-10 text-gray-500">Loading suppliers...</div>;
  }

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Suppliers</h1>

        <button
          onClick={() => navigate("/suppliers/create")}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 shrink-0"
        >
          <Plus className="h-4 w-4" />
          Add Supplier
        </button>
      </div>

      {/* ================= KEYWORD SEARCH ================= */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl shadow-sm border border-blue-200">
        <input
          type="text"
          placeholder="Search by keyword (name, email, etc.)..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleKeywordSearch()}
          className="flex-1 border border-blue-300 p-2.5 text-sm rounded-lg outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleKeywordSearch}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* ================= FILTER (Đã sửa layout bằng flex-wrap) ================= */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="flex-1 min-w-[140px] border border-gray-300 p-2 text-sm rounded-lg outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
        >
          <option value="">All Status</option>
          <option value="PENDING">PENDING</option>
          <option value="APPROVED">APPROVED</option>
          <option value="SUSPENDED">SUSPENDED</option>
        </select>

        {/* --- Dùng lại danh sách Region Hardcode như bản gốc --- */}
        <select
          value={filters.region}
          onChange={(e) => setFilters({ ...filters, region: e.target.value })}
          className="flex-1 min-w-[140px] border border-gray-300 p-2 text-sm rounded-lg outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
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
          className="flex-1 min-w-[120px] border border-gray-300 p-2 text-sm rounded-lg outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />

        <input
          type="datetime-local"
          value={filters.updatedAfter}
          onChange={(e) =>
            setFilters({ ...filters, updatedAfter: e.target.value })
          }
          className="flex-1 min-w-[180px] border border-gray-300 p-2 text-sm rounded-lg outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />

        {/* SORTING */}
        <select
          value={filters.sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="flex-1 min-w-[140px] border border-gray-300 p-2 text-sm rounded-lg outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
        >
          <option value="updateAt,desc">Updated ↓</option>
          <option value="updateAt,asc">Updated ↑</option>
          <option value="rating,desc">Rating ↓</option>
          <option value="rating,asc">Rating ↑</option>
        </select>

        <div className="flex w-full sm:w-auto gap-2 shrink-0">
          <button
            onClick={handleSearch}
            className="flex-1 sm:flex-none rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            Search
          </button>

          <button
            onClick={handleReset}
            className="flex-1 sm:flex-none rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Reset
          </button>
        </div>
      </div>

      {/* ================= TABLE (Có thanh cuộn ngang) ================= */}
      <div className="overflow-visible rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full whitespace-nowrap">
            <thead className="bg-gray-50 text-sm font-semibold text-gray-600 border-b border-gray-200">
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

            <tbody className="divide-y divide-gray-200">
              {suppliers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    No suppliers found
                  </td>
                </tr>
              ) : (
                suppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-900">
                      {s.name}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {s.contactEmail}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {s.region || "-"}
                    </td>
                    <td className="px-5 py-3 text-gray-600">{s.rating}</td>
                    <td className="px-5 py-3 text-gray-600">
                      {formatDateTime(s.updateAt)}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          s.status === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : s.status === "PENDING"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>

                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-2 relative">
                        <button
                          onClick={() => navigate(`/suppliers/${s.id}`)}
                          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          <Eye className="h-4 w-4" />
                          Detail
                        </button>

                        <div className="relative">
                          <button
                            onClick={() =>
                              setOpenDropdown(
                                openDropdown === s.id ? null : s.id,
                              )
                            }
                            className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
                          >
                            Action
                          </button>

                          {openDropdown === s.id && (
                            <div
                              className={`absolute right-0 w-auto min-w-[10rem] rounded-lg border border-gray-200 bg-white shadow-lg z-20
    ${suppliers.indexOf(s) >= suppliers.length - 2 ? "bottom-full mb-2" : "top-full mt-2"}
  `}
                            >
                              {s.status === "PENDING" && (
                                <div className="flex gap-2 p-2">
                                  <button
                                    onClick={() =>
                                      setConfirmModal({
                                        open: true,
                                        message:
                                          "Are you sure you want to approve this supplier?",
                                        action: async () => {
                                          await reviewSupplier(
                                            s.id,
                                            "APPROVED",
                                            currentUser,
                                          );
                                          refreshList();
                                        },
                                      })
                                    }
                                    className="inline-flex items-center justify-center gap-1 rounded-lg bg-green-600 px-2 py-1.5 text-xs font-medium text-white hover:bg-green-700"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                    Approve
                                  </button>

                                  <button
                                    onClick={() =>
                                      setRejectModal({
                                        open: true,
                                        supplierId: s.id,
                                        reason: "",
                                      })
                                    }
                                    className="inline-flex items-center justify-center gap-1 rounded-lg bg-red-600 px-2 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                                  >
                                    <Ban className="h-4 w-4" />
                                    Reject
                                  </button>
                                </div>
                              )}

                              {s.status === "APPROVED" && (
                                <button
                                  onClick={() =>
                                    setConfirmModal({
                                      open: true,
                                      message:
                                        "Are you sure you want to suspend this supplier?",
                                      action: async () => {
                                        await toggleSuspend(s.id, currentUser);
                                        refreshList();
                                      },
                                    })
                                  }
                                  className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50"
                                >
                                  <Ban className="h-4 w-4 text-red-600" />
                                  Suspend
                                </button>
                              )}

                              {s.status === "SUSPENDED" && (
                                <button
                                  onClick={() =>
                                    setConfirmModal({
                                      open: true,
                                      message: "Reactivate this supplier?",
                                      action: async () => {
                                        await reviewSupplier(
                                          s.id,
                                          "APPROVED",
                                          currentUser,
                                        );
                                        refreshList();
                                      },
                                    })
                                  }
                                  className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50"
                                >
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  Reactivate
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="flex items-center justify-between">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm font-medium text-gray-600">
          Page {totalPages === 0 ? 0 : page + 1} / {totalPages}
        </span>

        <button
          disabled={page + 1 >= totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
      {confirmModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-96 rounded-xl bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800">
              Confirm Action
            </h2>

            <p className="mt-2 text-sm text-gray-600">{confirmModal.message}</p>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() =>
                  setConfirmModal({ open: false, action: null, message: "" })
                }
                className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  if (confirmModal.action) {
                    await confirmModal.action();
                  }
                  setConfirmModal({ open: false, action: null, message: "" });
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {rejectModal.open && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="w-96 rounded-xl bg-white p-6 shadow-lg">
      <h2 className="text-lg font-semibold text-gray-800">
        Reject Supplier
      </h2>

      <input
        type="text"
        placeholder="Enter reject reason..."
        value={rejectModal.reason}
        onChange={(e) =>
          setRejectModal({ ...rejectModal, reason: e.target.value })
        }
        className="mt-4 w-full border rounded-lg p-2"
      />

      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={() =>
            setRejectModal({ open: false, supplierId: null, reason: "" })
          }
          className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          onClick={async () => {
            if (!rejectModal.reason.trim()) {
              alert("Reject reason is required");
              return;
            }

            await reviewSupplier(
              rejectModal.supplierId,
              "REJECTED",
              currentUser,
              rejectModal.reason
            );

            setRejectModal({ open: false, supplierId: null, reason: "" });
            refreshList();
          }}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
        >
          Reject
        </button>
      </div>
    </div>
  </div>
)}
    </div>
    
  );
}
