import { cn } from "@/lib/utils.ts"
import { Button } from "@/components/ui/button.tsx"
import { Separator } from "@/components/ui/separator.tsx"
import { Link, useLocation } from 'react-router-dom';
import { FileText, Home, Settings, Users, LogOut } from "lucide-react"
import { useState, useEffect } from "react";

interface NavItemProps {
    icon: React.ElementType;
    title: string;
    path: string;
    collapsed: boolean;
}

const navItems = [
    {
        icon: Home,
        title: "Início",
        path: "/home"
    },
    {
        icon: FileText,
        title: "Chamados",
        path: "/chamados"
    },
    {
        icon: Users,
        title: "Perfil",
        path: "/perfil"
    },
    {
        icon: Settings,
        title: "Configurações",
        path: "/config"
    }
];

function NavItem({ icon: Icon, title, path, collapsed }: NavItemProps) {
    const location = useLocation()
    const isActive = location.pathname === path

    return (
        <Button
            variant="ghost"
            className={cn(
                "w-full justify-start gap-3 text-white hover:bg-white/10 h-10",
                collapsed ? "px-2" : "",
                isActive && "bg-white/10"
            )}
            asChild
            title={collapsed ? title : undefined}
        >
            <Link to={path} className={collapsed ? "flex justify-center" : ""}>
                <Icon className="h-5 w-5" />
                {!collapsed && <span>{title}</span>}
            </Link>
        </Button>
    )
}

function LogoutItem({ collapsed }: { collapsed: boolean }) {
    return (
        <>
            <Separator className="my-4 bg-white/20" />
            <Button
                variant="ghost"
                className={cn(
                    "w-full justify-start gap-3 text-white hover:bg-white/10 h-10",
                    collapsed ? "px-2" : ""
                )}
                asChild
                title={collapsed ? "Sair" : undefined}
            >
                <Link to="/signin" className={collapsed ? "flex justify-center" : ""}>
                    <LogOut className="h-5 w-5" />
                    {!collapsed && <span>Sair</span>}
                </Link>
            </Button>
        </>
    )
}

export default function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setCollapsed(window.innerWidth < 768);
        };

        checkScreenSize();

        window.addEventListener('resize', checkScreenSize);

        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    return (
        <div
            className={cn(
                "sidebar fixed top-0 left-0 h-screen border-r bg-primary z-40 transition-all duration-300",
                collapsed ? "w-16" : "w-64",
                className
            )}
        >
            <div className="py-4 flex flex-col h-[calc(100%-4rem)]">
                <nav className={cn("space-y-2", collapsed ? "px-1" : "px-2")}>
                    {navItems.map((item) => (
                        <NavItem
                            key={item.path}
                            icon={item.icon}
                            title={item.title}
                            path={item.path}
                            collapsed={collapsed}
                        />
                    ))}
                </nav>
                <div className={cn("mb-4", collapsed ? "px-1" : "px-2")}>
                    <LogoutItem collapsed={collapsed} />
                </div>
            </div>
        </div>
    )
}