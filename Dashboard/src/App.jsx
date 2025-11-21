import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Add from "./pages/Add";
import Edit from "./pages/Edit";
import Register from "./pages/Register";
import Detail from "./pages/Detail";
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
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<Add />} />
          <Route path="/edit" element={<Edit />} />
          <Route path="/detail" element={<Detail />} />

          {/* Dashboard (Dummy) */}
          <Route path="/dashboard-fktp" element={<FKTP />} />
          <Route path="/dashboard-bpjs" element={<BPJS />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;
