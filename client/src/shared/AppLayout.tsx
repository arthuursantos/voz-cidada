import Sidebar from "@/components/Sidebar"
import { useEffect, useState } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [sidebarWidth, setSidebarWidth] = useState("16rem"); // 16rem = 64px (w-64)

    useEffect(() => {
        const updateSidebarWidth = () => {
            setSidebarWidth(window.innerWidth < 768 ? "4rem" : "16rem"); // 4rem = 16px (w-16)
        };

        updateSidebarWidth();
        window.addEventListener('resize', updateSidebarWidth);

        return () => {
            window.removeEventListener('resize', updateSidebarWidth);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <div
                style={{ marginLeft: sidebarWidth }}
                className="transition-all duration-300"
            >
                <main>
                    {children}
                </main>
            </div>
        </div>
    );
}