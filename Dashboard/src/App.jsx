import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FKTP from "./dashboard/FKTP";
import BPJS from "./dashboard/BPJS";
import { AuthProvider } from "./auth/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard */}
          <Route path="/dashboard-fktp" element={<FKTP />} />
          <Route path="/dashboard-bpjs" element={<BPJS />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
