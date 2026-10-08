import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage";
import ToolsPage from "./pages/ToolsPage";
import ToolDetailsPage from "./pages/ToolDetailsPage";
import CreateToolPage from "./pages/CreateToolPage";
import EditToolPage from "./pages/EditToolPage";


export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />

        <Route path="tools" element={<ToolsPage />} />
        <Route path="tools/:id" element={<ToolDetailsPage />} />

        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
           <Route path="tools/new" element={<CreateToolPage />} />
           <Route path="tools/:id/edit" element={<EditToolPage />} />
           <Route path="dashboard" element={<DashboardPage />} />
           </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}