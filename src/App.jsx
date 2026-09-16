import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ClientLayout from "./components/layout/ClientLayout";
import Overview from "./pages/Overview";
import Software from "./pages/Software";
import Academy from "./pages/Academy";
import Students from "./pages/Students";
import LicenseGenerator from "./pages/LicenseGenerator";
import Licenses from "./pages/Licenses";
import LicensePlans from "./pages/LicensePlans";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import PortalOverview from "./pages/portal/Overview";
import PortalBots from "./pages/portal/Bots";
import PortalIndicators from "./pages/portal/Indicators";
import PortalAcademy from "./pages/portal/Academy";
import PortalJournal from "./pages/portal/Journal";
import PortalSettings from "./pages/portal/Settings";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      {/* Portal del cliente (alumnos) */}
      <Route
        path="/portal/*"
        element={
          <ProtectedRoute>
            <ClientLayout>
              <Routes>
                <Route path="/" element={<PortalOverview />} />
                <Route path="/bots" element={<PortalBots />} />
                <Route path="/indicadores" element={<PortalIndicators />} />
                <Route path="/academia" element={<PortalAcademy />} />
                <Route path="/journal" element={<PortalJournal />} />
                <Route path="/ajustes" element={<PortalSettings />} />
              </Routes>
            </ClientLayout>
          </ProtectedRoute>
        }
      />

      {/* Panel de administración — solo usuarios con role "admin" */}
      <Route
        path="/panel/*"
        element={
          <ProtectedRoute requireAdmin>
            <Layout>
              <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="/software" element={<Software />} />
                <Route path="/academia" element={<Academy />} />
                <Route path="/estudiantes" element={<Students />} />
                <Route path="/licencias/generar" element={<LicenseGenerator />} />
                <Route path="/licenses" element={<Licenses />} />
                <Route path="/license-plans" element={<LicensePlans />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;