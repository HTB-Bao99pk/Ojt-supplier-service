import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSupplierById } from "../../api/supplierApi";
import "./SupplierDetail.css";

export default function SupplierDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [supplier, setSupplier] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getSupplierById(id);
                setSupplier(data);
            } catch (err) {
                console.error(err);
            } finally {
                setTimeout(() => setLoading(false), 600); // smooth loading
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="detail-wrapper">
                <div className="detail-card">
                    <div className="skeleton title"></div>
                    <div className="skeleton line"></div>
                    <div className="skeleton line"></div>
                    <div className="skeleton line"></div>
                    <div className="skeleton line"></div>
                </div>
            </div>
        );
    }

    if (!supplier) {
        return (
            <div className="detail-wrapper">
                <div className="detail-card">
                    <h2>Supplier Not Found</h2>
                    <button className="btn-primary" onClick={() => navigate("/suppliers")}>
                        Back to List
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="detail-wrapper">
            <div className="detail-card fade-in">
                <div className="detail-header">
                    <h2>Supplier Detail</h2>
                    <button className="btn-secondary" onClick={() => navigate("/suppliers")}>
                        ← Back
                    </button>
                </div>

                <div className="detail-grid">
                    <div className="detail-item">
                        <label>Name</label>
                        <p>{supplier.name}</p>
                    </div>

                    <div className="detail-item">
                        <label>Email</label>
                        <p>{supplier.contactEmail}</p>
                    </div>

                    <div className="detail-item">
                        <label>Phone</label>
                        <p>{supplier.phone || "N/A"}</p>
                    </div>

                    <div className="detail-item">
                        <label>Region</label>
                        <p>{supplier.region}</p>
                    </div>

                    <div className="detail-item">
                        <label>Status</label>
                        <span className={`badge ${supplier.status.toLowerCase()}`}>
                            {supplier.status}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}