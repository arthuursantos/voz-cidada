import { ReactNode, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from "@/contexts/AuthContext.tsx";
import Dashboard from "@/pages/dashboard";
import AdminDashboard from "@/pages/adminDashboard";
import About from "@/pages/about/index.tsx";          
import Contact from "@/pages/contact/index.tsx";      
import Cadastro from "@/pages/cadastro/index.tsx";    
import ResetPassword from "@/pages/resetPassword/index.tsx";    
import SignIn from "./pages/signIn/index.tsx";
import SignUp from "./pages/signUp/index.tsx";

type RouteProps = {
    children: ReactNode;
    requiredRole?: string;
}

const PrivateRoute = ({ children, requiredRole }: RouteProps) => {
    const { isAuthenticated, loading, userRoles } = useContext(AuthContext);

    if (loading) {
        return "";
    }

    if (!isAuthenticated) {
        return <Navigate to="/signin" />
    }

    if (!requiredRole && userRoles?.includes("ROLE_ADMIN")) {
        return <Navigate to="/admin/dashboard" />
    }

    if (requiredRole && !userRoles?.includes(requiredRole)) {
        return <Navigate to="/dashboard" />
    }

    return children;
}

const PublicRoute = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated, loading } = useContext(AuthContext);
    if (loading) {
        return "";
    }
    if (isAuthenticated) {
        return <Navigate to="/dashboard" />
    }
    return children;
}

const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route
                        path="/signin"
                        element={
                            <PublicRoute>
                                <SignIn />
                            </PublicRoute>
                        }
                    />

                    <Route
                        path="/signup"
                        element={
                            <PublicRoute>
                                <SignUp />
                            </PublicRoute>
                        }
                    />

                    <Route
                        path="/admin/dashboard"
                        element={
                            <PrivateRoute requiredRole="ROLE_ADMIN">
                                <AdminDashboard />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/about" //por enquanto deixei publico apenas para teste
                        element={
                            <PublicRoute>
                                <About />
                            </PublicRoute> 
                        }
                    />

                    <Route
                        path="/contact" //por enquanto deixei publico apenas para teste
                        element={
                            <PublicRoute>
                                <Contact />
                            </PublicRoute>
                        }
                    />

                    <Route
                        path="/cadastro"
                        element={
                            <PublicRoute>
                                <Cadastro />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/resetPassword"
                        element={
                            <PublicRoute>
                                <ResetPassword />
                            </PublicRoute>
                        }
                    />

                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;
