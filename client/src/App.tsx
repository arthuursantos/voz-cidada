import {ReactNode, useContext} from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from '@/pages/signIn';
import {AuthContext, AuthProvider} from "@/contexts/AuthContext.tsx";
import AdminDashboard from "@/pages/admin";
import SignUp from "@/pages/signUp";
import Reports from "src/pages/chamados";
import Home from "@/pages/home";

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
        return <Navigate to="/admin/home" />
    }

    if (requiredRole && !userRoles?.includes(requiredRole)) {
        return <Navigate to="/home" />
    }

    return children;
}

const PublicRoute = ({ children }: {children: ReactNode}) => {
    const { isAuthenticated, loading } = useContext(AuthContext);
    if (loading) {
        return "";
    }
    if (isAuthenticated) {
        return <Navigate to={"/home"}/>
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
                        path="/admin/home"
                        element={
                            <PrivateRoute requiredRole="ROLE_ADMIN">
                                <AdminDashboard />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/home"
                        element={
                            <PrivateRoute>
                                <Home />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/chamados"
                        element={
                            <PrivateRoute>
                                <Reports />
                            </PrivateRoute>
                        }
                    />

                    <Route path="/" element={<Navigate to="/home" />} />
                    <Route path="*" element={<Navigate to="/home" />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;