import { ReactNode, useContext/*, useState*/ } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext, AuthProvider } from "@/contexts/AuthContext.tsx";
import About from "@/pages/about/index.tsx";
import Contact from "@/pages/contact/index.tsx";
import ResetPassword from "@/pages/resetPassword/ResetPassoword.tsx";
import AdminDashboard from "./pages/Admin/index.tsx";
import Dashboard from "./pages/homePage/homePage.tsx";
import AbrirChamado from "./pages/abrirChamado/index.tsx"; // Nova importação
import Profile from "./pages/Profile/index.tsx";
import SignIn from "./pages/SignIn/index.tsx";
import SignUp from "./pages/SignUp/index.tsx";
import { GoogleOAuthProvider } from '@react-oauth/google';
import OAuthSignUp from "@/pages/OAuthSignUp";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home/index.tsx";
import {/*myGetToken,*/ onMessageListener} from "./firebase.ts"

type RouteProps = {
    children: ReactNode;
    requiredRole?: string;
};

const PrivateRoute = ({ children, requiredRole }: RouteProps) => {
    const { isAuthenticated, loading, userRoles, authStatus } = useContext(AuthContext);

    if (loading) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />;
    }

    // Se não for rota com role e for admin, manda pro admin dashboard
    if (!requiredRole && userRoles?.includes("ROLE_ADMIN")) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    // Primeiro acesso após OAuth?
    if (authStatus === "SIGNIN") {
        return <Navigate to="/signup/oauth" replace />;
    }

    // Se exigiu role e não tem, joga pro dashboard genérico
    if (requiredRole && !userRoles?.includes(requiredRole)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

const PublicRoute = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated, loading, authStatus } = useContext(AuthContext);

    if (loading) {
        return null;
    }
    if (authStatus === "SIGNIN") {
        return <Navigate to="/signup/oauth" replace />;
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }
    return <>{children}</>;
};

const OAuthRoute = ({ children }: { children: ReactNode }) => {
    const { authStatus, loading } = useContext(AuthContext);

    if (loading) {
        return null;
    }
    if (authStatus === "SIGNUP") {
        return <Navigate to="/dashboard" replace />;
    }
    if (authStatus == null) {
        return <Navigate to="/signin" replace />;
    }
    return <>{children}</>;
};

const App = () => {

    // const [isTokenFound, setTokenFound] = useState(false);
    // myGetToken(setTokenFound);

    onMessageListener()
        .then((payload) => {
            console.log('Foreground message received:', payload);
        })
        .catch((err) => {
            console.log('Error in onMessageListener:', err);
        });

    return (
        <GoogleOAuthProvider clientId="518788781560-5kjacjm9okd3cnofcs2beq2e6nb7br12.apps.googleusercontent.com">
            <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        {/* ROTEAS PÚBLICAS */}
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
                            path="/signup/oauth"
                            element={
                                <OAuthRoute>
                                    <OAuthSignUp />
                                </OAuthRoute>
                            }
                        />


                        {/* ROTA ADMIN PRINCIPAL */}
                        <Route
                            path="/admin/dashboard"
                            element={
                                <PrivateRoute requiredRole="ROLE_ADMIN">
                                    <AdminDashboard />
                                </PrivateRoute>
                            }
                        />


                        {/* ROTAS AUTENTICADAS GERAIS */}
                        <Route
                            path="/home"
                            element={
                                <PrivateRoute>
                                    <Home />
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

                        {/* REDIRECIONAMENTOS PADRÃO */}
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
            <Toaster />
        </GoogleOAuthProvider>
    );
};

export default App;
