import AppLayout from "@/utils/AppLayout.tsx";
import GetUserChamados from "./components/getChamados.tsx";

export default function Chamados() {
    return (
        <AppLayout>
            <div className="flex flex-col h-full">
                <div className="flex-1 min-h-[50%] overflow-y-auto">
                    <GetUserChamados/>
                </div>
            </div>
        </AppLayout>
    )
}