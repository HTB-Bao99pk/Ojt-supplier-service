import { useNavigate } from "react-router-dom";
import "./AppHeader.css";

export default function AppHeader() {
    const navigate = useNavigate();

    return (
        <div className="app-header">
            <div className="app-header__container">
                <div
                    className="app-header__logo"
                    onClick={() => navigate("/suppliers")}
                >
                    Capital Coffee
                </div>

                <div className="app-header__nav">
                    <button onClick={() => navigate("/suppliers")}>
                        Suppliers
                    </button>
                </div>
            </div>
        </div>
    );
}