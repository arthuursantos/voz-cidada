import Sidebar from "@/components/Sidebar/index.tsx"
import ReportsSection from "./components/ReportsSection.tsx"

export default function Reports() {
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-y-auto">
                    <div className="flex flex-col h-full">
                        <div className="flex-1 min-h-[50%] overflow-y-auto">
                            <ReportsSection />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}