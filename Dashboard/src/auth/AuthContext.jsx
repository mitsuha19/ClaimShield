import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const dummyUsers = [
  { email: "petugas@example.com", password: "123456", role: "petugas" },
  { email: "monitoring@example.com", password: "123456", role: "monitoring" },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  function login(email, password) {
    // cari user dari dummy data
    const found = dummyUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (found) {
      setUser(found);
      return { success: true, role: found.role };
    }

    return { success: false, message: "Invalid credentials" };
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
