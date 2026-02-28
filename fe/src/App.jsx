import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

import UpdateSupplier from './pages/supplier/UpdateSupplier'
import SupplierList from './pages/supplier/SupplierList'

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Navigate to="/suppliers" replace />} />
                    <Route path="/suppliers" element={<SupplierList />} />
                    <Route path="/update/:id" element={<UpdateSupplier />} />
                    <Route path="*" element={<Navigate to="/suppliers" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App