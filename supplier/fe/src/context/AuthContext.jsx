import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Bắt đầu là null (Chưa có ai đăng nhập)
  const [user, setUser] = useState(null); 

  // Hàm login giả lập để test
  const login = (role) => {
    setUser({
      username: role === 'ADMIN' ? 'admin_super' : 'supplier_test',
      role: role, // 'ADMIN' hoặc 'SUPPLIER'
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}