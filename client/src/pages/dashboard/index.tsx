import {useContext} from "react";
import {AuthContext} from "@/contexts/AuthContext.tsx";

export default function Dashboard() {
    const { user } = useContext(AuthContext)
    return (
        <>
            <h1>vai corinthians</h1>
            <p>Oi {user?.nome}</p>
            <p>nascimento {user?.dataNascimento}</p>
        </>
    )
}