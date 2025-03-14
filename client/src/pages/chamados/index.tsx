import Sidebar from "@/components/sidebar/index.tsx"
import GetUserChamados from "./components/getChamados.tsx"
export default function Chamados() {
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-y-auto">
                    <div className="flex flex-col h-full">
                        <div className="flex-1 min-h-[50%] overflow-y-auto">
                            <GetUserChamados/>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}