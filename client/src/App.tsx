import {ReactNode, useContext} from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './pages/login/Login.tsx';
import {AuthContext, AuthProvider} from "@/contexts/AuthContext.tsx";
import Dashboard from "@/pages/dashboard";

const PrivateRoute = ({ children }: {children: ReactNode}) => {
    const { isAuthenticated } = useContext(AuthContext);
    if (!isAuthenticated) {
        return <Navigate to={"/login"}/>
    }
    return children;
}

const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<LoginForm />} />

                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />

                    <Route path="/" element={<Navigate to="/login" />} />

                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;