import { Toaster } from "@/components/ui/sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";
import Tasks from "./pages/Tasks";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "@/lib/AuthContext";

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Auth />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/tasks" element={<Tasks />} />
            </Route>

            {/* Redireciona para a área protegida; ProtectedRoute decide se vai para /login */}
            <Route path="/" element={<Navigate to="/tasks" replace />} />

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
