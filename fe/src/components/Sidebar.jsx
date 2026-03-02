import { NavLink } from "react-router-dom";

const Sidebar = () => {
    const linkStyle = ({ isActive }) => ({
        display: "block",
        padding: "14px 20px",
        marginBottom: "8px",
        borderRadius: "8px",
        textDecoration: "none",
        color: "white",
        backgroundColor: isActive ? "#f57c00" : "transparent",
        fontWeight: 500
    });

    return (
        <div style={{
            width: "250px",
            minHeight: "100vh",
            background: "#7B2E00",
            padding: "20px"
        }}>
            <h2 style={{ color: "white", marginBottom: "30px" }}>
                Capital Coffee
            </h2>

            <NavLink to="/" style={linkStyle}>
                Dashboard
            </NavLink>

            <NavLink to="/suppliers" style={linkStyle}>
                Suppliers
            </NavLink>
        </div>
    );
};

export default Sidebar;