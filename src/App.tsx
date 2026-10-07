import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFoundPage from "./pages/NotFoundPage";



export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />

        <Route
          path="tools"
          element={
            <PlaceholderPage
              title="Browse Tools"
              description="Find the right tool for your next project."
            />
          }
        />

        <Route path="login" element={<LoginPage />} />

        <Route
          path="register"
          element={
            <PlaceholderPage
              title="Join ToolShare"
              description="Create an account to start sharing and renting tools."
            />
          }
        />

        <Route
          path="dashboard"
          element={
            <PlaceholderPage
              title="Your Dashboard"
              description="Your listings and rental requests will appear here."
            />
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}