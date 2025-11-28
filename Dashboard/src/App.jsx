import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import MainLayout from "./components/layout/MainLayout";
import Add from "./pages/Add";
import Edit from "./pages/Edit";
import Register from "./pages/Register";
import Detail from "./pages/Detail";
import FKTP from "./dashboard/FKTP";
import BPJS from "./dashboard/BPJS";
import DetailBpjs from "./pages/DetailBpjs";
import { AuthProvider } from "./auth/AuthContext";
import { DataProvider } from "./auth/DataContext";
import FraudReportsPage from "./pages/FraudReportsPage";
import ClaimHistoryPage from "./pages/ClaimHistoryPage";

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Dashboard (Dummy) */}
            <Route
              path="/dashboard-fktp"
              element={
                <MainLayout>
                  <FKTP />
                </MainLayout>
              }
            />
            <Route
              path="/dashboard-bpjs"
              element={
                <MainLayout>
                  <BPJS />
                </MainLayout>
              }
            />

            {/* CRUD */}
            <Route
              path="/add"
              element={
                <MainLayout>
                  <Add />
                </MainLayout>
              }
            />
            <Route
              path="/edit"
              element={
                <MainLayout>
                  <Edit />
                </MainLayout>
              }
            />
            <Route
              path="/detail"
              element={
                <MainLayout>
                  <Detail />
                </MainLayout>
              }
            />
            <Route
              path="/detail-bpjs"
              element={
                <MainLayout>
                  <DetailBpjs />
                </MainLayout>
              }
            />
            <Route
              path="/fraud-reports"
              element={
                <MainLayout>
                  <FraudReportsPage />
                </MainLayout>
              }
            />
            <Route
              path="/claim-history"
              element={
                <MainLayout>
                  <ClaimHistoryPage />
                </MainLayout>
              }
            />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}
export default App;
