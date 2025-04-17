import { ReactNode, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from "@/contexts/AuthContext.tsx";
import About from "@/pages/about/index.tsx";          
import Contact from "@/pages/contact/index.tsx";        
import ResetPassword from "@/pages/resetPassword/ResetPassoword.tsx";    
import AdminDashboard from "./pages/admin/index.tsx";
import Dashboard from "./pages/homePage/homePage.tsx";
import AbrirChamado from "./pages/abrirChamado/index.tsx"; // Nova importação
import Profile from "./pages/Profile/index.tsx";
import Chamados from "./pages/chamados/index.tsx";
import SignIn from "./pages/signIn/index.tsx";
import SignUp from "./pages/signUp/index.tsx";
import { GoogleOAuthProvider } from '@react-oauth/google';
import OAuthSignUp from "@/pages/OAuthSignUp";
import {Toaster} from "react-hot-toast";
import Home from "./pages/Home/index.tsx";

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

    if (!requiredRole && userRoles?.includes("ROLE_OWNER")) {
        return <Navigate to="/admin/dashboard"/>
    }

    if (!requiredRole && userRoles?.includes("ROLE_ADMIN")) {
        return <Navigate to="/admin/dashboard"/>
    }

    if (requiredRole && !userRoles?.includes(requiredRole)) {
        return <Navigate to="/dashboard"/>
    }

    return children;
}

const PublicRoute = ({children}: { children: ReactNode }) => {
    const {isAuthenticated, loading} = useContext(AuthContext);
    if (loading) {
        return "";
    }
    if (isAuthenticated) {
        return <Navigate to="/dashboard" />
    }
    return children;
}

const OAuthRoute = ({children}: { children: ReactNode }) => {
    const {authStatus, loading} = useContext(AuthContext)
    if (loading) {
        return "";
    }
    if (authStatus == "SIGNUP") {
        return <Navigate to="/dashboard"/>
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
                            path="/admin/dashboard"
                            element={
                                <PrivateRoute requiredRole="ROLE_OWNER">
                                    <AdminDashboard />
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
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/about" 
                        element={
                            <PrivateRoute>
                                <About />
                            </PrivateRoute> 
                        }
                    />

                    <Route
                        path="/contact"
                        element={
                            <PrivateRoute>
                                <Contact />
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
                        path="/abrir-chamado" 
                        element={
                            <PrivateRoute>
                                <AbrirChamado />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/redefinir-senha"
                        element={
                            <PrivateRoute>
                                <ResetPassword />
                            </PrivateRoute>
                        }
                    />

                    <Route 
                        path="/conta"
                        element={
                            <PrivateRoute>
                                <Profile />
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

                        <Route path="/" element={<Navigate to="/dashboard"/>}/>
                        <Route path="*" element={<Navigate to="/dashboard"/>}/>
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
            <Toaster/>
        </GoogleOAuthProvider>
    );
};

export default App;