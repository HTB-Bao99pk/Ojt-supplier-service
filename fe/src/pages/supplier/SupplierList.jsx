import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllSuppliers,
  toggleSuspend,
  approveSupplier,
} from "../../api/supplierApi";
import { useAuth } from "../../context/AuthContext";
import "./SupplierList.css";

export default function SupplierList() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [suppliers, setSuppliers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchSuppliers = async (pageNumber = 0) => {
    try {
      setLoading(true);
      const data = await getAllSuppliers(pageNumber, 10);
      setSuppliers(data.content);
      setTotalPages(data.totalPages);
      setPage(pageNumber);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleToggle = async (id) => {
    await toggleSuspend(id, currentUser);
    fetchSuppliers(page);
  };

  const handleApprove = async (id) => {
    try {
      await approveSupplier(id, currentUser);
      fetchSuppliers(page);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="supplier-list__spinner">
        <div className="supplier-list__spinner-circle" />
      </div>
    );
  }

  return (
    <div className="supplier-list">
      <div className="supplier-list__wrapper">
        <h1 className="supplier-list__title">Supplier Management</h1>
        <button
          className="supplier-list__add-btn"
          onClick={() => navigate("/suppliers/create")}
          style={{
            marginBottom: "20px",
            padding: "10px 20px",
            background: "#78350f",
            color: "white",
            borderRadius: "8px",
          }}
        >
          + Add New Supplier
        </button>

        <div className="supplier-list__card">
          <table className="supplier-list__table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Region</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.contactEmail}</td>
                  <td>{s.region}</td>
                  <td>
                    <span
                      className={`status ${
                        s.status === "SUSPENDED" ? "suspended" : "approved"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => navigate(`/suppliers/${s.id}`)}>
                      Edit
                    </button>
                    {s.status === "PENDING" && (
                      <button
                        style={{
                          background:
                            "linear-gradient(135deg, #16a34a, #15803d)",
                        }}
                        onClick={() => handleApprove(s.id)}
                      >
                        Approve
                      </button>
                    )}

                    <button onClick={() => handleToggle(s.id)}>Toggle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="supplier-list__pagination">
            <button
              disabled={page === 0}
              onClick={() => fetchSuppliers(page - 1)}
            >
              Prev
            </button>

            <span>
              Page {page + 1} / {totalPages}
            </span>

            <button
              disabled={page + 1 === totalPages}
              onClick={() => fetchSuppliers(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
