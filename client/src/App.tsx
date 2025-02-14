import LoginForm from './components/Login.tsx';
import {AuthProvider} from "@/contexts/AuthContext.tsx";

const App = () => {
    return (
        <AuthProvider>
            <LoginForm></LoginForm>
        </AuthProvider>
    );
};

export default App;