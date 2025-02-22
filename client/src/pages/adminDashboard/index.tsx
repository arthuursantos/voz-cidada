import {useContext} from "react";
import {AuthContext} from "@/contexts/AuthContext.tsx";

export default function AdminDashboard() {
    const { user } = useContext(AuthContext)
    return (
        <>
            <h1>admin dashboard</h1>
            <p>oi adm {user?.nome}</p>
        </>
    );
}