import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Add from "./pages/Add";
import Edit from "./pages/Edit";
import Detail from "./pages/Detail";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<Add />} />
          <Route path="/edit" element={<Edit />} />
          <Route path="/detail" element={<Detail />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
