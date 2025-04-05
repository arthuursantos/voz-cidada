import {ReactNode, useContext} from "react";
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import SignIn from '@/pages/SignIn';
import {AuthContext, AuthProvider} from "@/contexts/AuthContext.tsx";
import AdminDashboard from "@/pages/Admin";
import SignUp from "@/pages/SignUp";
import Chamados from "@/pages/Chamados";
import Home from "@/pages/Home";
import OAuthSignUp from "@/pages/OAuthSignUp";
import {Toaster} from "react-hot-toast";

type RouteProps = {
    children: ReactNode;
    requiredRole?: string;
}

const PrivateRoute = ({children, requiredRole}: RouteProps) => {
    const {isAuthenticated, loading, userRoles} = useContext(AuthContext);

    if (loading) {
        return "";
    }

    if (!isAuthenticated) {
        return <Navigate to="/signin"/>
    }

    if (!requiredRole && userRoles?.includes("ROLE_ADMIN")) {
        return <Navigate to="/admin/home"/>
    }

    if (requiredRole && !userRoles?.includes(requiredRole)) {
        return <Navigate to="/home"/>
    }

    return children;
}

const PublicRoute = ({children}: { children: ReactNode }) => {
    const {isAuthenticated, loading} = useContext(AuthContext);
    if (loading) {
        return "";
    }
    if (isAuthenticated) {
        return <Navigate to={"/home"}/>
    }
    return children;
}

const OAuthRoute = ({children}: { children: ReactNode }) => {
    const {authStatus, loading} = useContext(AuthContext)
    if (loading) {
        return "";
    }
    if (authStatus == "SIGNUP") {
        return <Navigate to="/home"/>
    } else if (authStatus == null) {
        return <Navigate to="/signin"/>
    }
    return children;
}

const App = () => {
    return (
        <GoogleOAuthProvider clientId="518788781560-5kjacjm9okd3cnofcs2beq2e6nb7br12.apps.googleusercontent.com">
            <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        <Route
                            path="/signin"
                            element={
                                <PublicRoute>
                                    <SignIn/>
                                </PublicRoute>
                            }
                        />

                        <Route
                            path="/signup"
                            element={
                                <PublicRoute>
                                    <SignUp/>
                                </PublicRoute>
                            }
                        />

                        <Route
                            path="/admin/home"
                            element={
                                <PrivateRoute requiredRole="ROLE_ADMIN">
                                    <AdminDashboard/>
                                </PrivateRoute>
                            }
                        />

                        <Route
                            path="/home"
                            element={
                                <PrivateRoute>
                                    <Home/>
                                </PrivateRoute>
                            }
                        />

                        <Route
                            path="/chamados"
                            element={
                                <PrivateRoute>
                                    <Chamados/>
                                </PrivateRoute>
                            }
                        />

                        <Route
                            path="/signup/oauth"
                            element={
                                <OAuthRoute>
                                    <OAuthSignUp/>
                                </OAuthRoute>
                            }
                        />

                        <Route path="/" element={<Navigate to="/home"/>}/>
                        <Route path="*" element={<Navigate to="/home"/>}/>
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
            <Toaster/>
        </GoogleOAuthProvider>
    );
};

export default App;