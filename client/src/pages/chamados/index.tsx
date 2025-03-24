import AppLayout from "@/layout/AppLayout.tsx";
import UserChamados from "./components/UserChamados";

export default function Chamados() {
    return (
        <AppLayout>
            <div className="flex flex-col h-full">
                <div className="flex-1 min-h-[50%] overflow-y-auto">
                    <UserChamados/>
                </div>
            </div>
        </AppLayout>
    )
}