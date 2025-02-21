import {ReactNode, useContext} from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './pages/login/Login.tsx';
import {AuthContext, AuthProvider} from "@/contexts/AuthContext.tsx";
import Dashboard from "@/pages/dashboard";

const PrivateRoute = ({ children }: {children: ReactNode}) => {
    const { isAuthenticated, loading } = useContext(AuthContext);
    if (loading) {
        return "";
    }
    if (!isAuthenticated) {
        return <Navigate to={"/login"}/>
    }
    return children;
}

const PublicRoute = ({ children }: {children: ReactNode}) => {
    const { isAuthenticated, loading } = useContext(AuthContext);
    if (loading) {
        return "";
    }
    if (isAuthenticated) {
        return <Navigate to={"/dashboard"}/>
    }
    return children;
}


const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>

                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <LoginForm />
                            </PublicRoute>
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

                    <Route path="/" element={<Navigate to="/dashboard" />} />

                    <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;