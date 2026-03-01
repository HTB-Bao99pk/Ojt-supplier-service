import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

import UpdateSupplier from './pages/supplier/UpdateSupplier'
import SupplierList from './pages/supplier/SupplierList'
import AppHeader from './components/AppHeader'
import CreateSupplier from './pages/supplier/CreateSupplier'

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppHeader />
                <Routes>
                    <Route path="/" element={<Navigate to="/suppliers" replace />} />
                    <Route path="/suppliers" element={<SupplierList />} />
                    <Route path="/suppliers/:id" element={<UpdateSupplier />} />
                    <Route path="*" element={<Navigate to="/suppliers" replace />} />
                    <Route path="/suppliers/create" element={<CreateSupplier />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App