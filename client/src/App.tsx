import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/auth-context";
import { PrivateRoute } from "./components/layout/private-route";
import { Navbar } from "./components/layout/navbar";
import { LoginPage } from "./pages/login-page";
import { RegistroPage } from "./pages/registro-page";
import { DashboardPage } from "./pages/dashboard-page";
import { TransaccionesPage } from "./pages/transacciones-page";
import { CategoriasPage } from "./pages/categorias-page";
import { PresupuestosPage } from "./pages/presupuestos-page";
import { ReportesPage } from "./pages/reportes-page";

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <main className="py-2">{children}</main>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegistroPage />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/transacciones"
            element={
              <PrivateRoute>
                <AppLayout>
                  <TransaccionesPage />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/categorias"
            element={
              <PrivateRoute>
                <AppLayout>
                  <CategoriasPage />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/presupuestos"
            element={
              <PrivateRoute>
                <AppLayout>
                  <PresupuestosPage />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/reportes"
            element={
              <PrivateRoute>
                <AppLayout>
                  <ReportesPage />
                </AppLayout>
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
