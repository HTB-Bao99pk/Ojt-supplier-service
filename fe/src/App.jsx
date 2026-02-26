import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import UpdateSupplier from './pages/supplier/UpdateSupplier'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/update/1" replace />} />
        <Route path="/update/:id" element={<UpdateSupplier />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
