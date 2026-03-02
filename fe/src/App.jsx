import { Routes, Route } from "react-router-dom";
import SupplierDashboard from "./pages/SupplierDashboard";
import SupplierList from "./pages/supplier/SupplierList";
import SupplierDetail from "./pages/supplier/SupplierDetail";
import UpdateSupplier from "./pages/supplier/UpdateSupplier";

function App() {
    return (
        <Routes>
            <Route path="/" element={<SupplierDashboard />} />

            <Route path="/suppliers" element={<SupplierList />} />
            <Route path="/suppliers/:id" element={<SupplierDetail />} />
            <Route path="/update/:id" element={<UpdateSupplier />} />
        </Routes>
    );
}

export default App;