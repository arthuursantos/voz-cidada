import {useContext} from "react";
import {AuthContext} from "@/contexts/AuthContext.tsx";

export default function Dashboard() {
    const { user } = useContext(AuthContext)
    return (
        <>
            <p>user dashboard</p>
            <p>oi user {user?.nome}</p>
        </>
    )
}