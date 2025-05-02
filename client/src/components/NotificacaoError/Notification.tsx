import { AlertCircle } from "lucide-react";
import  { useState, useEffect } from "react";
import { Alert, AlertDescription } from "../ui/alert";

function NotificationError({ message }: { message: string }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 3000); // 3 segundos

        return () => clearTimeout(timer); // Limpa o timer ao desmontar o componente
    }, []);

    if (!visible) return null;

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
            <Alert
                variant="destructive"
                className="border-red-500 bg-red-50 animate-in fade-in slide-in-from-top duration-300 shadow-lg"
            >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
            </Alert>
        </div>
    );
}

export default NotificationError;